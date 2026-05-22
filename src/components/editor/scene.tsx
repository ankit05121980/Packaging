"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PerspectiveCamera,
} from "@react-three/drei";
import { BoxMesh } from "./box-mesh";

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#D4A574" wireframe />
    </mesh>
  );
}

function GroundGrid() {
  return (
    <group position={[0, -1.2, 0]}>
      <gridHelper args={[20, 40, "#334155", "#1e293b"]} />
    </group>
  );
}

export function EditorScene() {
  return (
    <Canvas
      shadows
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      className="w-full h-full"
      style={{ background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)" }}
    >
      <PerspectiveCamera makeDefault position={[3, 2.5, 4]} fov={45} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-3, 4, -3]} intensity={0.4} />
      <pointLight position={[0, 5, 0]} intensity={0.3} />

      <Suspense fallback={<LoadingFallback />}>
        <Environment preset="studio" />
        <BoxMesh />
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />
        <GroundGrid />
      </Suspense>

      <OrbitControls
        makeDefault
        minDistance={2}
        maxDistance={12}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.05}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
