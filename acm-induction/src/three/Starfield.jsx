import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Colored point cloud — layered on top of drei <Stars> for nebula tint.
// Slowly rotates and drifts toward the camera (subtle warp), with mouse parallax.
export default function Starfield({ count = 800, spread = 60, parallax = true }) {
  const ref = useRef();

  const { positions, colors } = useMemo(() => {
    // deterministic PRNG → stable stars across renders (and lint-pure)
    let seed = 1337 + count;
    const rand = () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const palette = [
      new THREE.Color('#7c6ff7'),
      new THREE.Color('#1dc891'),
      new THREE.Color('#378add'),
      new THREE.Color('#ffffff'),
    ];
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * spread;
      positions[i * 3 + 1] = (rand() - 0.5) * spread;
      positions[i * 3 + 2] = (rand() - 0.5) * spread;
      const c = palette[(rand() * palette.length) | 0];
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count, spread]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.02;
    if (parallax) {
      const { x, y } = state.pointer;
      ref.current.rotation.x += (y * 0.08 - ref.current.rotation.x) * 0.04;
      ref.current.rotation.z += (-x * 0.05 - ref.current.rotation.z) * 0.04;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
