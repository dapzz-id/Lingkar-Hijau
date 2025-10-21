"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Center } from "@react-three/drei";
import * as THREE from "three";

interface ModelProps {
  url?: string;
  scale?: number;
}

function Model({ url = "/models/a_recyclecompost_bin.glb", scale = 0.075 }: ModelProps) {
  const { scene } = useGLTF(url) as unknown as { scene: THREE.Group };

  return (
    <Center>
      <primitive object={scene} scale={scale} />
    </Center>
  );
}

interface ModelViewerProps {
  className?: string;
}

export default function ModelViewer({ className = "" }: ModelViewerProps) {
  return (
    <div className={`w-full max-w-50 md:max-w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 1.8], fov: 35 }}
        gl={{ antialias: true }}
        className="w-full h-full rounded-2xl"
      >
        {/* Cahaya */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 5]} intensity={1.2} />

        {/* Model */}
        <Suspense fallback={null}>
          <Model />
          <Environment preset="sunset" />
        </Suspense>

        {/* Orbit auto rotate */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/a_recyclecompost_bin.glb");