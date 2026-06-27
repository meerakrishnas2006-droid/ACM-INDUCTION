import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useInViewport } from '../hooks';

function Planet({ tint = '#1dc891' }) {
  const planet = useRef();
  const moon = useRef();
  useFrame((state, delta) => {
    if (planet.current) planet.current.rotation.y += delta * 0.25;
    if (moon.current) {
      const t = state.clock.elapsedTime * 0.6;
      moon.current.position.set(Math.cos(t) * 2.5, Math.sin(t) * 0.6, Math.sin(t) * 2.5);
    }
  });
  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
      <group>
        <mesh ref={planet}>
          <sphereGeometry args={[1.8, 64, 64]} />
          <meshStandardMaterial color="#0d1a2e" emissive={tint} emissiveIntensity={0.12} roughness={0.8} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.83, 22, 22]} />
          <meshBasicMaterial color={tint} wireframe transparent opacity={0.13} />
        </mesh>
        <mesh>
          <sphereGeometry args={[2.0, 32, 32]} />
          <meshBasicMaterial color={tint} transparent opacity={0.1} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh ref={moon}>
          <sphereGeometry args={[0.15, 24, 24]} />
          <meshStandardMaterial color="#f0f0ff" emissive="#9fe9d0" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

// Self-contained mini-canvas planet (used in About + success panel).
export default function AboutPlanet({ tint = '#1dc891' }) {
  const [ref, inView] = useInViewport();
  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <Canvas
        flat
        dpr={[1, 1.5]}
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 3, 3]} intensity={2} color={tint} />
        <pointLight position={[-3, -1, 2]} intensity={0.6} color="#7c6ff7" />
        <Planet tint={tint} />
      </Canvas>
    </div>
  );
}
