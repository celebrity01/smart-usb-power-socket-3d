"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  COMPONENTS,
  WIRES,
  CATEGORY_COLORS,
  type ComponentCategory,
} from "@/lib/smart-socket-data";

interface Props {
  isPowered: boolean;
  activeCategory: ComponentCategory | "all";
}

interface WireGeometry {
  from: THREE.Vector3;
  to: THREE.Vector3;
  midpoint: THREE.Vector3;
  control: THREE.Vector3;
}

/**
 * Renders all wires between components as curved tubes.
 * When `isPowered` is true, animated particles flow along each wire
 * to visualise the current / data flow.
 */
export function Wires({ isPowered, activeCategory }: Props) {
  // Pre-compute wire geometries from component positions
  const wireGeometries = useMemo<WireGeometry[]>(() => {
    const componentMap = new Map(COMPONENTS.map((c) => [c.id, c]));

    return WIRES.map((wire) => {
      const fromComp = componentMap.get(wire.from);
      const toComp = componentMap.get(wire.to);
      if (!fromComp || !toComp) {
        return {
          from: new THREE.Vector3(),
          to: new THREE.Vector3(),
          midpoint: new THREE.Vector3(),
          control: new THREE.Vector3(),
        };
      }
      const from = new THREE.Vector3(...fromComp.position);
      const to = new THREE.Vector3(...toComp.position);
      const midpoint = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
      // Curve the wire slightly upward for a "cable" look
      const distance = from.distanceTo(to);
      const control = midpoint.clone();
      control.y += Math.min(distance * 0.2, 0.6);
      return { from, to, midpoint, control };
    });
  }, []);

  return (
    <group>
      {WIRES.map((wire, i) => (
        <WireTube
          key={i}
          wire={wire}
          geometry={wireGeometries[i]}
          isPowered={isPowered}
          dim={activeCategory !== "all" && wire.category !== activeCategory}
        />
      ))}
    </group>
  );
}

function WireTube({
  wire,
  geometry,
  isPowered,
  dim,
}: {
  wire: (typeof WIRES)[number];
  geometry: WireGeometry;
  isPowered: boolean;
  dim: boolean;
}) {
  const tubeRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Group>(null);

  // Build a quadratic bezier curve and a tube geometry from it
  const { tubeGeometry, curve } = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      geometry.from,
      geometry.control,
      geometry.to
    );
    const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.04, 8, false);
    return { tubeGeometry, curve };
  }, [geometry]);

  // Pre-compute particle positions along the curve
  const particleCount = 4;
  const particleOffsets = useMemo(
    () => Array.from({ length: particleCount }, (_, i) => i / particleCount),
    []
  );

  useFrame((state) => {
    if (!isPowered || !particlesRef.current) return;
    const t = state.clock.getElapsedTime();
    // Speed depends on wire category
    const speed =
      wire.category === "communication"
        ? 0.5
        : wire.category === "control"
        ? 0.6
        : wire.category === "sensing"
        ? 0.4
        : 0.3;

    particlesRef.current.children.forEach((child, i) => {
      const offset = particleOffsets[i];
      const u = (t * speed + offset) % 1;
      const point = curve.getPoint(u);
      child.position.copy(point);
    });
  });

  const color = CATEGORY_COLORS[wire.category];
  const opacity = dim ? 0.15 : 1;

  return (
    <group>
      {/* The wire itself */}
      <mesh ref={tubeRef} geometry={tubeGeometry}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isPowered && !dim ? 0.4 : 0}
          roughness={0.4}
          metalness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Animated flow particles (only when powered) */}
      {isPowered && !dim && (
        <group ref={particlesRef}>
          {particleOffsets.map((_, i) => (
            <mesh key={i}>
              <sphereGeometry args={[0.09, 12, 12]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive={color}
                emissiveIntensity={2}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
