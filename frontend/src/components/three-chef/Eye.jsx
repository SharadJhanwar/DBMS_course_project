// Eye.jsx
import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Eye component
 *
 * Props:
 *  - position: [x,y,z]
 *  - eyeTargetRef: ref to THREE.Vector3 target for both eyes
 *  - blinkRef: ref-like object that contains .current boolean (blink state)
 *  - materials: { skin, white, pupilMat, hatMat, hair } pre-created materials
 *  - side: 'left' | 'right' (for subtle asymmetry)
 *
 * Behavior:
 *  - Pupil (small sphere) tracks eyeTarget by aligning with vector from eye center to target.
 *  - Pupils constrained within an ellipse region using simple projection/scale.
 *  - Eyelid is a curved plane that translates down/up to blink.
 */

export default function Eye({ position = [0, 0, 0], eyeTargetRef, blinkRef, materials, side = "left" }) {
  const eyeGroup = useRef();
  const pupil = useRef();
  const lid = useRef();
  const sclera = useRef();
  const tempVec = new THREE.Vector3();

  // pupil relative offset (smooth)
  const pupilCur = useRef(new THREE.Vector2(0, 0));
  const pupilTarget = useRef(new THREE.Vector2(0, 0));

  // configuration
  const PUPIL_MAX_X = 0.12; // local units
  const PUPIL_MAX_Y = 0.07;
  const EASE = 0.14;

  useFrame(() => {
    if (!eyeGroup.current) return;

    // compute vector from eye world pos to target
    eyeGroup.current.getWorldPosition(tempVec); // eye center in world
    const target = eyeTargetRef.current.clone();
    const dir = target.clone().sub(tempVec).normalize(); // unit vector from eye to target

    // project direction into local eye group space
    const localDir = dir.clone().applyQuaternion(eyeGroup.current.getWorldQuaternion(new THREE.Quaternion()).invert());

    // simple mapping: use x,z components as left-right/up-down approximations
    const tx = THREE.MathUtils.clamp(localDir.x * 0.9, -1, 1);
    const ty = THREE.MathUtils.clamp(localDir.y * 0.9, -1, 1);

    // desired pupil offset
    pupilTarget.current.x = tx * PUPIL_MAX_X;
    pupilTarget.current.y = -ty * PUPIL_MAX_Y;

    // lerp current
    pupilCur.current.x += (pupilTarget.current.x - pupilCur.current.x) * EASE;
    pupilCur.current.y += (pupilTarget.current.y - pupilCur.current.y) * EASE;

    // set pupil position (local)
    if (pupil.current) {
      pupil.current.position.x = pupilCur.current.x;
      pupil.current.position.y = pupilCur.current.y;
      // slight forward inset for depth
      pupil.current.position.z = 0.14;
    }

    // eyelid control: blinkRef.current is boolean toggle
    const closed = blinkRef.current === true;
    if (lid.current) {
      // animate lid via position.y (higher when open, lower when closed)
      const openY = 0.15;
      const closedY = -0.02;
      lid.current.position.y += ((closed ? closedY : openY) - lid.current.position.y) * 0.22;
      lid.current.rotation.x = THREE.MathUtils.lerp(lid.current.rotation.x, closed ? -0.28 : -0.06, 0.18);
    }
  });

  return (
    <group ref={eyeGroup} position={position}>
      {/* sclera (white) */}
      <mesh ref={sclera}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>

      {/* pupil */}
      <mesh ref={pupil}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#101010" roughness={0.2} metalness={0.05} />
      </mesh>

      {/* small highlight */}
      <mesh position={[-0.05, 0.05, 0.22]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>

      {/* eyelid: a rounded plane (we use plane & rotate) */}
      <mesh ref={lid} position={[0, 0.15, 0.12]} rotation={[-0.06, 0, 0]}>
        <planeGeometry args={[0.55, 0.26, 8, 2]} />
        <meshStandardMaterial color="#ffdfc8" />
      </mesh>
    </group>
  );
}
