// ChefCanvas.jsx
import React, { Suspense, useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Float, Html, useProgress } from "@react-three/drei";
import Chef from "./Chef";
import LoaderOverlay from "./LoaderOverlay";

/**
 * ChefCanvas - wraps the Three.js Canvas and scene settings.
 *
 * Props:
 *  - interactive: boolean (enable pointer tracking & blink on click)
 *  - formBlinkRef: optional React ref to signal blink when password focused (external)
 *
 * The component sets up lighting, environment, and passes pointer events to the Chef model.
 */

export default function ChefCanvas({ interactive = true, formBlinkRef = null, className = "" }) {
  // scene-level state (look target): normalized device coords (-1..1)
  const lookTargetRef = useRef({ x: 0, y: 0, updated: false });

  // blink controller
  const [blinkTrigger, setBlinkTrigger] = useState(false);

  // expose external blink control if provided (for password focus)
  useEffect(() => {
    if (!formBlinkRef) return;
    formBlinkRef.current = {
      blinkNow: () => {
        setBlinkTrigger(true);
        setTimeout(() => setBlinkTrigger(false), 140);
      },
    };
    return () => {
      if (formBlinkRef.current) formBlinkRef.current = null;
    };
  }, [formBlinkRef]);

  // handle pointer move => compute normalized coords
  const onPointerMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // compute relative to center and normalize -1..1
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    lookTargetRef.current.x = x;
    lookTargetRef.current.y = y;
    lookTargetRef.current.updated = true;
  }, []);

  const onPointerLeave = useCallback(() => {
    lookTargetRef.current.x = 0;
    lookTargetRef.current.y = 0;
    lookTargetRef.current.updated = true;
  }, []);

  const onClick = useCallback(() => {
    // blink on click
    setBlinkTrigger(true);
    setTimeout(() => setBlinkTrigger(false), 120);
  }, []);

  return (
    <div
      className={`chef-canvas-wrapper ${className}`}
      onMouseMove={interactive ? onPointerMove : undefined}
      onMouseLeave={interactive ? onPointerLeave : undefined}
      onClick={interactive ? onClick : undefined}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <Canvas
        gl={{ antialias: true, toneMappingExposure: 1 }}
        camera={{ position: [0, 0.6, 4.5], fov: 32 }}
      >
        <Suspense fallback={<LoaderOverlay />}>
          {/* Environment + lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 6, 5]} intensity={1.0} castShadow shadow-mapSize={[1024, 1024]} />
          <pointLight position={[-5, 3, 3]} intensity={0.15} />
          <Environment preset="sunset" />
          {/* subtle floating (gives gentle bobbing) */}
          <Float speed={0.6} rotationIntensity={0.02} floatIntensity={0.3}>
            <Chef lookTargetRef={lookTargetRef} blinkTrigger={blinkTrigger} />
          </Float>

          {/* orbitcontrols for dev, disabled for production or set to enableRotate=false */}
          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.1} minPolarAngle={Math.PI / 3.6} />

          {/* contact shadow / ground plane - decorative */}
        </Suspense>
      </Canvas>
    </div>
  );
}
