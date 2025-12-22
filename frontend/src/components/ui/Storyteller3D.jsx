import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

const Book = () => {
  const bookRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    bookRef.current.rotation.y = Math.sin(t / 2) * 0.2;
    bookRef.current.position.y = Math.sin(t) * 0.1;
  });

  return (
    <group ref={bookRef} position={[0, 0.5, 1.5]} rotation={[0.5, 0, 0]}>
      {/* Cover */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.1, 0.8]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      {/* Pages */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[1.1, 0.05, 0.7]} />
        <meshStandardMaterial
          color="#F5F5DC"
          emissive="#F5F5DC"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Magic coming out */}
      <Sparkles
        count={50}
        scale={2}
        size={4}
        speed={0.4}
        opacity={0.7}
        color="#FFD700"
        position={[0, 0.5, 0]}
      />
    </group>
  );
};

const HakawatiCharacter = () => {
  const group = useRef();
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Breathing animation
    group.current.position.y = -1 + Math.sin(t * 0.5) * 0.05;

    // Head movement (storytelling)
    headRef.current.rotation.y = Math.sin(t * 0.3) * 0.2;
    headRef.current.rotation.x = Math.sin(t * 0.5) * 0.05;

    // Arm gestures
    leftArmRef.current.rotation.z = -0.5 + Math.sin(t * 1.2) * 0.2;
    rightArmRef.current.rotation.z = 0.5 - Math.sin(t * 1.2 + 1) * 0.2;
  });

  return (
    <group ref={group} position={[0, -1, 0]}>
      {/* Body (Robe) */}
      <mesh position={[0, 0.75, 0]}>
        <coneGeometry args={[0.8, 2.5, 32]} />
        <meshStandardMaterial color="#4A148C" roughness={0.7} />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 2.1, 0]}>
        <mesh>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial color="#D7CCC8" />
        </mesh>
        {/* Turban */}
        <mesh position={[0, 0.2, 0]}>
          <torusGeometry args={[0.35, 0.15, 16, 100]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Arms */}
      <group position={[-0.6, 1.5, 0]} ref={leftArmRef}>
        <mesh position={[0, -0.4, 0]}>
          <capsuleGeometry args={[0.12, 0.8, 4, 8]} />
          <meshStandardMaterial color="#4A148C" />
        </mesh>
        <mesh position={[0, -0.9, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial color="#D7CCC8" />
        </mesh>
      </group>

      <group position={[0.6, 1.5, 0]} ref={rightArmRef}>
        <mesh position={[0, -0.4, 0]}>
          <capsuleGeometry args={[0.12, 0.8, 4, 8]} />
          <meshStandardMaterial color="#4A148C" />
        </mesh>
        <mesh position={[0, -0.9, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial color="#D7CCC8" />
        </mesh>
      </group>
    </group>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4A148C" />

      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <HakawatiCharacter />
        <Book />
      </Float>

      <Sparkles
        count={100}
        scale={5}
        size={2}
        speed={0.4}
        opacity={0.5}
        color="#FFF"
      />
    </>
  );
};

export default function Storyteller3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
        <Scene />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
