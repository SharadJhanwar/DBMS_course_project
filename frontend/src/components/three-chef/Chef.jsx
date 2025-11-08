// Chef.jsx
import React, { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Eye from "./Eye";

/**
 * Chef - composes the 3D chef model from primitives.
 *
 * Props:
 *  - lookTargetRef: ref object { x, y, updated } with normalized pointer coords (-1..1)
 *  - blinkTrigger: boolean toggles blink state for a short period
 *
 * Implementation notes:
 *  - Head is a slightly flattened sphere
 *  - Eyes are separate Eye components (spheres + pupil)
 *  - Eyelids are simple planes that translate to simulate blink
 *  - Hat is composed of multiple stacked shapes
 *  - Smooth interpolation used for pupil & head rotations
 *  - Idle breathing uses subtle scaling and rotation
 */

export default function Chef({ lookTargetRef, blinkTrigger }) {
  // group refs
  const rootRef = useRef();
  const headRef = useRef();

  // world-space target for eyes (3D vector)
  const eyeTarget = useRef(new THREE.Vector3(0, 0.2, 0.8)); // default forward

  // internal trackers for smooth motion
  const current = useRef({ x: 0, y: 0, headY: 0, headX: 0 });
  const pupilLerp = useRef({ x: 0, y: 0 });
  const blinkState = useRef(false);
  const blinkTimerRef = useRef(null);

  // auto-blink schedule
  useEffect(() => {
    let active = true;
    const schedule = () => {
      if (!active) return;
      const t = 3500 + Math.random() * 5500;
      blinkTimerRef.current = setTimeout(() => {
        blinkState.current = true;
        setTimeout(() => (blinkState.current = false), 120);
        schedule();
      }, t);
    };
    schedule();
    return () => {
      active = false;
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    };
  }, []);

  // convert normalized screen coords (x,y) -> 3D point in front of face
  const mapNormalizedToEyeWorld = (nx, ny) => {
    // nx, ny in [-1,1], we map to a small sphere in front of eyes
    const spread = 0.6; // how far target moves
    const tx = nx * spread;
    const ty = ny * spread * 0.6; // vertical smaller
    const tz = 0.85; // forward from head center
    return new THREE.Vector3(tx, ty + 0.22, tz);
  };

  // blink control: combine auto blink + external blinkTrigger prop
  useEffect(() => {
    if (blinkTrigger) {
      blinkState.current = true;
      setTimeout(() => (blinkState.current = false), 120);
    }
  }, [blinkTrigger]);

  // initial shapes/materials memoized for perf
  const materials = useMemo(() => {
    const skin = new THREE.MeshStandardMaterial({ color: "#ffdfc8", roughness: 0.7, metalness: 0.02 });
    const white = new THREE.MeshStandardMaterial({ color: "#fff", roughness: 0.6 });
    const pupilMat = new THREE.MeshStandardMaterial({ color: "#111", roughness: 0.2, metalness: 0.05 });
    const hatMat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.4 });
    const hair = new THREE.MeshStandardMaterial({ color: "#7b4a2c", roughness: 0.6 });
    return { skin, white, pupilMat, hatMat, hair };
  }, []);

  // main animation loop
  useFrame((state, delta) => {
    // hover interpolation for look target
    if (lookTargetRef?.current?.updated) {
      const nx = lookTargetRef.current.x;
      const ny = lookTargetRef.current.y;
      // smooth current -> target
      current.current.x += (nx - current.current.x) * 0.12;
      current.current.y += (ny - current.current.y) * 0.12;

      // head rotation
      current.current.headY += (current.current.x * 0.45 - current.current.headY) * 0.08;
      current.current.headX += (-current.current.y * 0.25 - current.current.headX) * 0.08;
    } else {
      // gently return to neutral slowly
      current.current.x += (0 - current.current.x) * 0.02;
      current.current.y += (0 - current.current.y) * 0.02;
      current.current.headY += (0 - current.current.headY) * 0.03;
      current.current.headX += (0 - current.current.headX) * 0.03;
    }

    // update head group rotation
    if (headRef.current) {
      headRef.current.rotation.y = current.current.headY;
      headRef.current.rotation.x = current.current.headX;
      // slight vertical bob (breathing)
      const t = state.clock.getElapsedTime();
      headRef.current.position.y = -0.05 + Math.sin(t * 0.8) * 0.005;
    }

    // compute 3D eye target
    const worldTarget = mapNormalizedToEyeWorld(current.current.x, current.current.y);
    eyeTarget.current.lerp(worldTarget, 0.22); // smoothing

    // update blink flag and pass via prop to Eye components by state (we use ref)
    // blinkState.current toggles by auto-blink and prop
  });

  // The Chef model builds geometry with named groups so Eyes can reference transforms.
  return (
    <group ref={rootRef} position={[0, -0.6, 0]}>
      {/* neck + collar */}
      <group position={[0, -0.9, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.55, 0.5, 0.6, 32]} />
          <meshStandardMaterial color="#fff0e6" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <torusGeometry args={[0.62, 0.12, 16, 64]} />
          <meshStandardMaterial color="#ffe9df" />
        </mesh>
      </group>

      {/* head group */}
      <group ref={headRef} position={[0, 0, 0]}>
        {/* main face */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.0, 64, 64]} />
          { /* slight squash to form face shape */ }
          <meshStandardMaterial {...materials.skin} />
        </mesh>

        {/* cheeks: subtle colored spheres */}
        <mesh position={[-0.62, -0.12, 0.82]} scale={[0.3, 0.2, 0.22]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#ffc6ad" transparent opacity={0.95} />
        </mesh>
        <mesh position={[0.62, -0.12, 0.82]} scale={[0.3, 0.2, 0.22]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#ffc6ad" transparent opacity={0.95} />
        </mesh>

        {/* moustache - a couple of torus / tubes */}
        <mesh position={[0, -0.16, 0.9]} rotation={[Math.PI * 0.03, 0, 0]}>
          <torusGeometry args={[0.42, 0.05, 12, 100, Math.PI]} />
          <meshStandardMaterial {...materials.hair} />
        </mesh>

        {/* mouth (small lip) */}
        <mesh position={[0, -0.36, 0.92]}>
          <torusGeometry args={[0.22, 0.04, 12, 100, Math.PI]} />
          <meshStandardMaterial color="#b34b30" />
        </mesh>

        {/* hat */}
        <group position={[0, 1.05, -0.05]}>
          <mesh position={[0, 0.36, 0]}>
            <sphereGeometry args={[0.95, 48, 48]} />
            <meshStandardMaterial {...materials.hatMat} />
          </mesh>
          <mesh position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.95, 1.05, 0.34, 48]} />
            <meshStandardMaterial color="#fafafa" />
          </mesh>
        </group>

        {/* two eyes - use Eye comp */}
        <Eye
          position={[-0.46, 0.15, 0.82]}
          eyeTargetRef={eyeTarget}
          blinkRef={blinkState}
          materials={materials}
          side="left"
        />
        <Eye
          position={[0.46, 0.15, 0.82]}
          eyeTargetRef={eyeTarget}
          blinkRef={blinkState}
          materials={materials}
          side="right"
        />
      </group>
    </group>
  );
}
