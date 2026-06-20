"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Text } from "@react-three/drei";
import * as THREE from "three";
import type { ComponentSpec } from "@/lib/smart-socket-data";

interface Props {
  component: ComponentSpec;
  isPowered: boolean;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovering: boolean) => void;
}

/**
 * Renders a single component as a stylised 3D mesh.
 * The mesh shape depends on the `component.shape` field.
 * Each shape is a stylised representation (not photorealistic) — enough to be
 * recognisable and to convey the component's function at a glance.
 */
export function ComponentMesh({
  component,
  isPowered,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle hover bobbing animation
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    if (isHovered || isSelected) {
      groupRef.current.position.y =
        component.position[1] + Math.sin(t * 2) * 0.08;
    } else {
      groupRef.current.position.y = component.position[1];
    }
  });

  // Render the appropriate shape
  const shape = renderShape(component, isPowered);

  const highlight = isSelected || isHovered;

  return (
    <group
      ref={groupRef}
      position={component.position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onHover(false);
        document.body.style.cursor = "auto";
      }}
    >
      {shape}

      {/* Hover/selected highlight ring */}
      {highlight && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.55, 0]}>
          <ringGeometry args={[0.85, 1.05, 32]} />
          <meshBasicMaterial
            color={isSelected ? "#F39C12" : "#FFFFFF"}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Component short label, always visible */}
      <Text
        position={[0, 1.0, 0]}
        fontSize={0.32}
        color="#1a1a1a"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#FFFFFF"
      >
        {component.shortLabel}
      </Text>

      {/* Tooltip on hover */}
      {isHovered && (
        <Html
          position={[0, 1.5, 0]}
          center
          distanceFactor={10}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            style={{
              background: "rgba(15, 23, 42, 0.92)",
              color: "white",
              padding: "6px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              fontFamily: "system-ui, sans-serif",
              whiteSpace: "nowrap",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <strong>{component.name}</strong>
          </div>
        </Html>
      )}
    </group>
  );
}

// ---------- Shape renderers ----------

/**
 * Self-contained pulsing LED — uses its own ref internally to animate
 * emissive intensity without accessing the ref during render.
 */
function PulsingLED({
  position,
  baseColor = "#FF0000",
  isPowered,
  pulseSpeed = 3,
  peakIntensity = 1.5,
  baseIntensity = 0.2,
  radius = 0.06,
}: {
  position: [number, number, number];
  baseColor?: string;
  isPowered: boolean;
  pulseSpeed?: number;
  peakIntensity?: number;
  baseIntensity?: number;
  radius?: number;
}) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    if (!matRef.current) return;
    const t = state.clock.getElapsedTime();
    const target = isPowered
      ? peakIntensity + Math.sin(t * pulseSpeed) * 0.4
      : baseIntensity;
    matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      matRef.current.emissiveIntensity,
      target,
      0.1
    );
  });
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 12, 12]} />
      <meshStandardMaterial
        ref={matRef}
        color={baseColor}
        emissive={baseColor}
        emissiveIntensity={baseIntensity}
      />
    </mesh>
  );
}

function renderShape(c: ComponentSpec, isPowered: boolean) {
  const color = c.color;

  switch (c.shape) {
    case "cylinder-battery":
      return (
        <group>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.8, 32]} />
            <meshStandardMaterial color={color} roughness={0.5} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
            <meshStandardMaterial color="#C0392B" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.5, 0]} castShadow>
            <cylinderGeometry args={[0.65, 0.65, 0.1, 32]} />
            <meshStandardMaterial color="#2c2c2c" roughness={0.8} />
          </mesh>
        </group>
      );

    case "diode":
      return (
        <group rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.7, 16]} />
            <meshStandardMaterial color={color} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.19, 0.19, 0.1, 16]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
            <meshStandardMaterial color="#999" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
            <meshStandardMaterial color="#999" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      );

    case "ic-to220":
      return (
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.7, 0.35]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.85, 0.4, 0.4]} />
            <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.45, 16]} />
            <meshStandardMaterial color="#000" />
          </mesh>
          {[-0.2, 0, 0.2].map((x, i) => (
            <mesh key={i} position={[x, -0.6, 0]}>
              <boxGeometry args={[0.06, 0.5, 0.04]} />
              <meshStandardMaterial color="#ddd" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
          <mesh position={[0, 0.36, 0.18]}>
            <planeGeometry args={[0.7, 0.18]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </group>
      );

    case "capacitor-cyl":
      return (
        <group>
          {[-0.3, 0, 0.3].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.2, 0.7, 24]} />
              <meshStandardMaterial
                color={i === 0 ? "#1a4d8f" : i === 1 ? "#2c2c2c" : "#5a3a1a"}
                roughness={0.5}
                metalness={0.3}
              />
            </mesh>
          ))}
          <mesh position={[0.55, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 12]} />
            <meshStandardMaterial color="#c0392b" />
          </mesh>
        </group>
      );

    case "zener":
      return (
        <group rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.13, 0.13, 0.45, 12]} />
            <meshStandardMaterial color="#c0392b" />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.07, 12]} />
            <meshStandardMaterial color="#000" />
          </mesh>
        </group>
      );

    case "resistor":
      return (
        <group rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.6, 16]} />
            <meshStandardMaterial color="#d4b896" roughness={0.7} />
          </mesh>
          {[-0.18, -0.06, 0.06, 0.18].map((x, i) => (
            <mesh key={i} position={[0, x, 0]}>
              <cylinderGeometry args={[0.17, 0.17, 0.05, 16]} />
              <meshStandardMaterial
                color={["#000", "#8B4513", "#FF0000", "#FFD700"][i]}
              />
            </mesh>
          ))}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
            <meshStandardMaterial color="#999" metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
            <meshStandardMaterial color="#999" metalness={0.9} />
          </mesh>
        </group>
      );

    case "led":
      return (
        <group>
          <PulsingLED
            position={[0, 0, 0]}
            baseColor="#FF0000"
            isPowered={isPowered}
            radius={0.22}
            peakIntensity={1.5}
            baseIntensity={0.2}
          />
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.2, 12]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </group>
      );

    case "usb-socket":
      return (
        <group>
          <mesh castShadow>
            <boxGeometry args={[1.1, 0.7, 0.6]} />
            <meshStandardMaterial color="#bdc3c7" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.31]}>
            <boxGeometry args={[0.85, 0.45, 0.05]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0, -0.1, 0.32]}>
            <boxGeometry args={[0.7, 0.12, 0.04]} />
            <meshStandardMaterial color="#f5f5f5" />
          </mesh>
          <PulsingLED
            position={[0.45, 0.25, 0.31]}
            baseColor="#FF0000"
            isPowered={isPowered}
            radius={0.06}
            peakIntensity={1.5}
            baseIntensity={0.2}
          />
        </group>
      );

    case "esp8266":
      return (
        <group>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.1, 1.9]} />
            <meshStandardMaterial color="#1a4d8f" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.15, 0.1]} castShadow>
            <boxGeometry args={[0.9, 0.12, 0.7]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-0.55, 0.15, 0.85]}>
            <boxGeometry args={[0.3, 0.18, 0.22]} />
            <meshStandardMaterial color="#888" metalness={0.9} />
          </mesh>
          {Array.from({ length: 15 }).map((_, i) => (
            <mesh key={i} position={[-0.6 + i * 0.085, 0.18, -0.85]}>
              <boxGeometry args={[0.04, 0.08, 0.06]} />
              <meshStandardMaterial color="#000" />
            </mesh>
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <mesh key={`b${i}`} position={[-0.6 + i * 0.085, 0.18, 0.85]}>
              <boxGeometry args={[0.04, 0.08, 0.06]} />
              <meshStandardMaterial color="#000" />
            </mesh>
          ))}
          <mesh position={[0.4, 0.18, 0.85]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color="#00FF00"
              emissive="#00FF00"
              emissiveIntensity={isPowered ? 1.2 : 0.2}
            />
          </mesh>
        </group>
      );

    case "relay":
      return (
        <group>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.1, 0.9]} />
            <meshStandardMaterial color="#2c5f2d" roughness={0.6} />
          </mesh>
          <mesh position={[-0.1, 0.3, 0]} castShadow>
            <boxGeometry args={[0.7, 0.6, 0.5]} />
            <meshStandardMaterial
              color="#3498db"
              transparent
              opacity={0.65}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0.45, 0.18, 0]}>
            <boxGeometry args={[0.25, 0.1, 0.4]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          {[[-0.4, 0.25], [-0.4, -0.25], [0.4, 0.25], [0.4, -0.25]].map(
            ([x, z], i) => (
              <mesh key={i} position={[x, 0.18, z]}>
                <boxGeometry args={[0.15, 0.15, 0.2]} />
                <meshStandardMaterial color="#27ae60" />
              </mesh>
            )
          )}
          <mesh position={[0.45, 0.18, 0.25]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color="#FF0000"
              emissive="#FF0000"
              emissiveIntensity={isPowered ? 1 : 0.1}
            />
          </mesh>
        </group>
      );

    case "router":
      return (
        <group>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.25, 1.0]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
          </mesh>
          {[-0.5, 0.5].map((x, i) => (
            <group key={i} position={[x, 0.3, -0.3]} rotation={[0.3, 0, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.04, 0.04, 1.0, 12]} />
                <meshStandardMaterial color="#1a1a1a" />
              </mesh>
              <mesh position={[0, 0.55, 0]}>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial color="#333" />
              </mesh>
            </group>
          ))}
          {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
            <mesh key={i} position={[x, 0.14, 0.35]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial
                color="#00FF00"
                emissive="#00FF00"
                emissiveIntensity={isPowered ? 1 : 0.1}
              />
            </mesh>
          ))}
          <mesh position={[0, 0.05, 0.51]}>
            <planeGeometry args={[0.6, 0.08]} />
            <meshBasicMaterial color="#3498db" />
          </mesh>
        </group>
      );

    case "phone":
      return (
        <group>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.9, 1.7, 0.1]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[0.78, 1.55]} />
            <meshStandardMaterial
              color={isPowered ? "#1f6f8b" : "#0a1a2a"}
              emissive={isPowered ? "#1f6f8b" : "#000"}
              emissiveIntensity={isPowered ? 0.4 : 0}
            />
          </mesh>
          <mesh position={[0, 0.6, 0.07]}>
            <planeGeometry args={[0.7, 0.18]} />
            <meshStandardMaterial color="#0d3a4d" />
          </mesh>
          {[-0.2, -0.5, -0.8].map((y, i) => (
            <mesh key={i} position={[0, y, 0.07]}>
              <planeGeometry args={[0.6, 0.2]} />
              <meshStandardMaterial
                color={i === 1 ? "#e67e22" : "#2a4a5a"}
                emissive={isPowered ? "#1a2a3a" : "#000"}
                emissiveIntensity={isPowered ? 0.3 : 0}
              />
            </mesh>
          ))}
          <mesh position={[0, -1.15, 0.07]}>
            <planeGeometry args={[0.5, 0.25]} />
            <meshStandardMaterial color={isPowered ? "#27ae60" : "#e74c3c"} />
          </mesh>
          <mesh position={[0, -1.6, 0.06]}>
            <circleGeometry args={[0.08, 16]} />
            <meshStandardMaterial color="#444" />
          </mesh>
        </group>
      );

    default:
      return (
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.6, 0.6]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
  }
}
