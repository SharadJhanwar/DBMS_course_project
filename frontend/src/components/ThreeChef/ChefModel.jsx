// src/components/ThreeChef/ChefModel.jsx
import * as THREE from "three";
import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";

export default function ChefModel({ lookTarget, blink }) {
  const headRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  const leftPupilRef = useRef();
  const rightPupilRef = useRef();
  const leftLidRef = useRef();
  const rightLidRef = useRef();

  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  // Animation frame
  useFrame(() => {
    if (!lookTarget.current) return;
    const { x, y } = lookTarget.current;

    // subtle head rotation
    headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, x * 0.4, 0.1);
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -y * 0.2, 0.1);

    // pupil movement
    const eyeOffsetX = clamp(x * 0.2, -0.25, 0.25);
    const eyeOffsetY = clamp(y * 0.2, -0.25, 0.25);
    leftPupilRef.current.position.set(eyeOffsetX, eyeOffsetY, 0.15);
    rightPupilRef.current.position.set(eyeOffsetX, eyeOffsetY, 0.15);

    // blinking (eyelids)
    const lidY = blink ? 0 : 0.35;
    leftLidRef.current.position.y = THREE.MathUtils.lerp(leftLidRef.current.position.y, lidY, 0.25);
    rightLidRef.current.position.y = THREE.MathUtils.lerp(rightLidRef.current.position.y, lidY, 0.25);
  });

  return (
    <group ref={headRef} position={[0, -1.2, 0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* FACE */}
      <mesh>
        <sphereGeometry args={[1.3, 64, 64]} />
        <meshStandardMaterial color="#ffe7cc" />
      </mesh>

      {/* CHEF HAT */}
      <group position={[0, 1.6, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.8, 1, 0.5, 32]} />
          <meshStandardMaterial color="#fdfdfd" />
        </mesh>
      </group>

      {/* LEFT EYE */}
      <group ref={leftEyeRef} position={[-0.55, 0.3, 1]}>
        <mesh>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh ref={leftPupilRef}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#1e1e1e" />
        </mesh>
        <mesh ref={leftLidRef} position={[0, 0.35, 0.13]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="#ffe7cc" />
        </mesh>
      </group>

      {/* RIGHT EYE */}
      <group ref={rightEyeRef} position={[0.55, 0.3, 1]}>
        <mesh>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh ref={rightPupilRef}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#1e1e1e" />
        </mesh>
        <mesh ref={rightLidRef} position={[0, 0.35, 0.13]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="#ffe7cc" />
        </mesh>
      </group>

      {/* MOUSTACHE */}
      <mesh position={[0, -0.4, 1]}>
        <torusGeometry args={[0.7, 0.05, 16, 100, Math.PI]} />
        <meshStandardMaterial color="#4b2c10" />
      </mesh>

      {/* MOUTH */}
      <mesh position={[0, -0.7, 1]}>
        <torusGeometry args={[0.3, 0.04, 16, 100, Math.PI]} />
        <meshStandardMaterial color="#b3452d" />
      </mesh>

      {/* CHEEKS */}
      <mesh position={[-0.9, -0.2, 0.9]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#ffc1a6" />
      </mesh>
      <mesh position={[0.9, -0.2, 0.9]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#ffc1a6" />
      </mesh>
    </group>
  );
}
