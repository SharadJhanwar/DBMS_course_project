// src/components/ThreeChef/ChefScene.jsx
import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import ChefModel from "./ChefModel";

export default function ChefScene() {
  const lookTarget = useRef({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  // smooth eye tracking
  const handleMove = (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -(e.clientY / window.innerHeight) * 2 + 1;
    lookTarget.current = { x: nx, y: ny };
  };

  // blink on click
  const handleClick = () => {
    setBlink(true);
    setTimeout(() => setBlink(false), 150);
  };

  // auto blink
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 4000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full" onMouseMove={handleMove} onClick={handleClick}>
      <Canvas camera={{ position: [0, 0.5, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <pointLight position={[-3, -2, 5]} intensity={0.5} />
        <ChefModel lookTarget={lookTarget} blink={blink} />
        <Environment preset="sunset" />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.2} />
      </Canvas>
    </div>
  );
}
