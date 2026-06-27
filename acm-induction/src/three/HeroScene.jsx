import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import Starfield from './Starfield';

// The large drifting planet on the right of the hero.
function HeroPlanet() {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.12;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={[2.6, -0.4, -3]}>
        <mesh ref={ref}>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshStandardMaterial color="#1a1040" emissive="#7c6ff7" emissiveIntensity={0.18} roughness={0.7} metalness={0.1} />
        </mesh>
        {/* wireframe grid shell */}
        <mesh>
          <sphereGeometry args={[2.53, 24, 24]} />
          <meshBasicMaterial color="#7c6ff7" wireframe transparent opacity={0.09} />
        </mesh>
        {/* additive atmosphere glow */}
        <mesh>
          <sphereGeometry args={[2.75, 32, 32]} />
          <meshBasicMaterial color="#7c6ff7" transparent opacity={0.12} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </Float>
  );
}

// Gentle camera parallax following the pointer.
function CameraRig() {
  useFrame((state) => {
    const { camera, pointer } = state;
    camera.position.x += (pointer.x * 0.4 - camera.position.x) * 0.04;
    camera.position.y += (-pointer.y * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene({ reduced = false }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 3, 5]} intensity={1.4} color="#7c6ff7" />
      <pointLight position={[-5, -2, 2]} intensity={0.8} color="#1dc891" />
      <Stars radius={80} depth={50} count={reduced ? 1200 : 3500} factor={4} saturation={0} fade speed={0.6} />
      <Starfield count={reduced ? 300 : 700} parallax={!reduced} />
      <HeroPlanet />
      {!reduced && <CameraRig />}
    </>
  );
}
