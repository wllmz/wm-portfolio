"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

type DistortMaterial = THREE.MeshStandardMaterial & { distort: number };

/**
 * Progression du scroll dans le hero épinglé (0 → 1).
 * Le hero fait 160svh, la scène reste sticky sur les 60svh de scroll :
 * la dislocation (douce) se joue sur cette distance.
 */
function useScrollProgress() {
  const progress = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const range = window.innerHeight * 0.6;
      progress.current = Math.min(Math.max(window.scrollY / range, 0), 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

/**
 * L'orbe central — une sculpture d'encre graphite qui respire,
 * et se disloque doucement à mesure que l'on scrolle.
 */
function Orb({ progress }: { progress: React.RefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const p = progress.current;

    // Rotation légèrement accélérée par le scroll — rien de brutal
    mesh.current.rotation.y += delta * (0.1 + p * 0.25);
    mesh.current.rotation.z += delta * (0.03 + p * 0.08);
    mesh.current.scale.setScalar(1 - p * 0.08);

    // La distorsion s'accentue en douceur
    const mat = mesh.current.material as DistortMaterial;
    mat.distort = 0.32 + p * 0.22;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.7}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.55, 32]} />
        <MeshDistortMaterial
          color="#141416"
          roughness={0.32}
          metalness={0.55}
          distort={0.32}
          speed={1.3}
        />
      </mesh>
    </Float>
  );
}

/**
 * Anneau de particules en orbite autour de l'orbe.
 * Au scroll, elles s'écartent légèrement en se dissipant.
 */
function Halo({ progress }: { progress: React.RefObject<number> }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 400;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.4 + Math.random() * 0.5;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.35;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!points.current) return;
    const p = progress.current;
    points.current.rotation.y += delta * (0.07 + p * 0.15);
    points.current.scale.setScalar(1 + p * 0.6);
    (points.current.material as THREE.PointsMaterial).opacity =
      0.55 * (1 - p * 0.35);
  });

  return (
    <points ref={points} rotation={[0.45, 0, 0.18]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#8a8a90"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Poussière discrète en arrière-plan. */
function Stars() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 700;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribution sphérique creuse, loin de la caméra
      const r = 7 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi) - 6;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color="#b9b9b2"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Fait pivoter doucement toute la scène vers la position de la souris. */
function Rig({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const targetY = state.pointer.x * 0.35;
    const targetX = -state.pointer.y * 0.25;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      targetY,
      2.2,
      delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      targetX,
      2.2,
      delta
    );
  });

  return <group ref={group}>{children}</group>;
}

function Scene() {
  const progress = useScrollProgress();

  return (
    <Rig>
      <Orb progress={progress} />
      <Halo progress={progress} />
      <Stars />
    </Rig>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      {/* Éclairage studio : lumière blanche + relief, pas de néon */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 5, 3]} intensity={2.4} color="#ffffff" />
      <directionalLight
        position={[-5, -2, 4]}
        intensity={0.8}
        color="#f0ede6"
      />
      <Scene />
    </Canvas>
  );
}
