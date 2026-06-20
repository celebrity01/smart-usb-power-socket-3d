"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useState, useCallback } from "react";
import { COMPONENTS, type ComponentCategory } from "@/lib/smart-socket-data";
import { ComponentMesh } from "./ComponentMesh";
import { Wires } from "./Wires";

interface Props {
  isPowered: boolean;
  activeCategory: ComponentCategory | "all";
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

/**
 * The 3D scene containing all components and wires.
 * Wrapped in <Canvas> with lighting, environment, controls.
 */
export function Scene({ isPowered, activeCategory, selectedId, onSelect }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleSelect = useCallback((id: string) => {
    onSelect(id === selectedId ? null : id);
  }, [selectedId, onSelect]);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 8, 14], fov: 45 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#0a1628"]} />
      <fog attach="fog" args={["#0a1628", 20, 40]} />

      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[8, 12, 6]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
        />
        <pointLight position={[-8, 5, -5]} intensity={0.5} color="#3a6ea5" />
        <pointLight position={[0, 8, 0]} intensity={0.4} color="#ffcc66" />

        <Environment preset="city" />

        {/* Floor grid + ground */}
        <Grid
          args={[40, 40]}
          position={[0, -5.5, 0]}
          cellSize={1}
          cellThickness={0.6}
          cellColor="#1a3050"
          sectionSize={5}
          sectionThickness={1.2}
          sectionColor="#2c5f8a"
          fadeDistance={35}
          fadeStrength={1}
          infiniteGrid
        />
        <ContactShadows
          position={[0, -5.49, 0]}
          opacity={0.5}
          scale={30}
          blur={2}
          far={8}
        />

        {/* All components */}
        {COMPONENTS.map((c) => (
          <ComponentMesh
            key={c.id}
            component={c}
            isPowered={isPowered}
            isSelected={selectedId === c.id}
            isHovered={hoveredId === c.id}
            onSelect={() => handleSelect(c.id)}
            onHover={(h) => setHoveredId(h ? c.id : null)}
          />
        ))}

        {/* All wires */}
        <Wires isPowered={isPowered} activeCategory={activeCategory} />

        {/* Camera controls */}
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={6}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, -1, 0]}
          dampingFactor={0.08}
        />
      </Suspense>
    </Canvas>
  );
}
