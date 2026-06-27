import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { DOMAINS } from '../data/content';

const DEFAULT_CAM = new THREE.Vector3(0, 3.2, 13);

// Module-scope scratch geometry for the constellation lines (one orbit system on the page).
const LINE_POS = new Float32Array(DOMAINS.length * 2 * 3);
const LINE_GEOM = new THREE.BufferGeometry();
LINE_GEOM.setAttribute('position', new THREE.BufferAttribute(LINE_POS, 3));

// Central pulsing star.
function Sun() {
  const ref = useRef();
  const corona = useRef();
  useFrame((state, delta) => {
    const p = 1.4 + Math.sin(state.clock.elapsedTime * 2) * 0.25;
    if (ref.current) ref.current.material.emissiveIntensity = p;
    if (corona.current) corona.current.rotation.x += delta * 0.3;
  });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[0.62, 48, 48]} />
        <meshStandardMaterial color="#ffffff" emissive="#7c6ff7" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshBasicMaterial color="#7c6ff7" transparent opacity={0.18} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={corona} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.012, 8, 80]} />
        <meshBasicMaterial color="#9fe9d0" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// Faint orbit ring in the XZ plane, opacity gently pulsing.
function OrbitRing({ radius, color }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.material.opacity = 0.1 + (Math.sin(state.clock.elapsedTime + radius) * 0.5 + 0.5) * 0.14;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.01, radius + 0.01, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.18} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Planet({ domain, index, selectedId, progressRef, positionsRef, onSelect }) {
  const group = useRef();
  const planet = useRef();
  const atmo = useRef();
  const angleRef = useRef(domain.orbitPhase);
  const scaleRef = useRef(1);

  useFrame((_, delta) => {
    const selected = selectedId === domain.id;
    const someoneElse = selectedId && !selected;
    if (!selected) angleRef.current += delta * domain.orbitSpeed;

    const r = domain.orbitRadius * progressRef.current;
    const x = Math.cos(angleRef.current) * r;
    const z = Math.sin(angleRef.current) * r;
    if (group.current) group.current.position.set(x, 0, z);
    positionsRef.current[index].set(x, 0, z);

    const target = selected ? 1.7 : 1;
    scaleRef.current += (target - scaleRef.current) * 0.12;
    if (group.current) group.current.scale.setScalar(scaleRef.current);

    if (planet.current) planet.current.rotation.y += delta * 0.5;

    const op = someoneElse ? 0.3 : 1;
    if (planet.current) planet.current.material.opacity += (op - planet.current.material.opacity) * 0.1;
    if (atmo.current) atmo.current.material.opacity += ((someoneElse ? 0.04 : 0.14) - atmo.current.material.opacity) * 0.1;
  });

  return (
    <group ref={group}>
      <mesh ref={planet} onClick={(e) => { e.stopPropagation(); onSelect(domain.id); }}>
        <sphereGeometry args={[0.4, 40, 40]} />
        <meshStandardMaterial color={domain.color} emissive={domain.emissive} emissiveIntensity={0.7} transparent opacity={1} toneMapped={false} />
      </mesh>
      <mesh ref={atmo} scale={1.25}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshBasicMaterial color={domain.color} transparent opacity={0.14} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <Html center distanceFactor={11} style={{ pointerEvents: 'none' }}>
        <div className="planet-label">{domain.name}</div>
      </Html>
    </group>
  );
}

// Lines connecting adjacent planets, rebuilt each frame.
function Constellation({ positionsRef, faded }) {
  const lineRef = useRef();
  useFrame(() => {
    for (let i = 0; i < DOMAINS.length; i++) {
      const a = positionsRef.current[i];
      const b = positionsRef.current[(i + 1) % DOMAINS.length];
      LINE_POS[i * 6] = a.x; LINE_POS[i * 6 + 1] = a.y; LINE_POS[i * 6 + 2] = a.z;
      LINE_POS[i * 6 + 3] = b.x; LINE_POS[i * 6 + 4] = b.y; LINE_POS[i * 6 + 5] = b.z;
    }
    LINE_GEOM.attributes.position.needsUpdate = true;
    if (lineRef.current) lineRef.current.material.opacity += ((faded ? 0.03 : 0.12) - lineRef.current.material.opacity) * 0.1;
  });
  return (
    <lineSegments ref={lineRef} geometry={LINE_GEOM}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.1} />
    </lineSegments>
  );
}

// Entrance fly-out + camera focus.
function Director({ selectedId, progressRef, positionsRef }) {
  const targetRef = useRef(new THREE.Vector3());
  useFrame((state, delta) => {
    progressRef.current += (1 - progressRef.current) * Math.min(1, delta * 1.6);

    const cam = state.camera;
    if (selectedId) {
      const idx = DOMAINS.findIndex((d) => d.id === selectedId);
      const p = positionsRef.current[idx];
      targetRef.current.set(p.x * 1.4, p.y + 2.2, p.z * 1.4 + 6);
    } else {
      targetRef.current.copy(DEFAULT_CAM);
    }
    cam.position.lerp(targetRef.current, 0.05);
    cam.lookAt(0, 0, 0);
  });
  return null;
}

function Scene({ selectedId, onSelect }) {
  const progressRef = useRef(0.0001);
  const positionsRef = useRef(DOMAINS.map(() => new THREE.Vector3()));
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={2.2} color="#7c6ff7" distance={20} />
      <Sun />
      {DOMAINS.map((d) => (
        <OrbitRing key={`r-${d.id}`} radius={d.orbitRadius} color={d.color} />
      ))}
      {DOMAINS.map((d, i) => (
        <Planet key={d.id} domain={d} index={i} selectedId={selectedId} progressRef={progressRef} positionsRef={positionsRef} onSelect={onSelect} />
      ))}
      <Constellation positionsRef={positionsRef} faded={!!selectedId} />
      <Director selectedId={selectedId} progressRef={progressRef} positionsRef={positionsRef} />
    </>
  );
}

export default function OrbitSystem({ selectedId, onSelect }) {
  return (
    <Canvas
      flat
      dpr={[1, 2]}
      camera={{ position: DEFAULT_CAM.toArray(), fov: 55 }}
      gl={{ alpha: true, antialias: true }}
      onPointerMissed={() => onSelect(null)}
    >
      <Scene selectedId={selectedId} onSelect={onSelect} />
    </Canvas>
  );
}
