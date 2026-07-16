"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

type DistortMaterial = THREE.MeshStandardMaterial & { distort: number };

/**
 * Progression du scroll dans le hero épinglé (0 → 1).
 * Le hero fait 180svh, la scène reste sticky sur les 80svh de scroll :
 * la déstructuration se joue sur cette distance.
 */
function useScrollProgress() {
  const progress = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const range = window.innerHeight * 0.8;
      progress.current = Math.min(Math.max(window.scrollY / range, 0), 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

/**
 * L'orbe central — un icosaèdre distordu qui respire,
 * et se déstructure à mesure que l'on scrolle.
 */
function Orb({ progress }: { progress: React.RefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const p = progress.current;

    // La rotation s'emballe avec le scroll
    mesh.current.rotation.y += delta * (0.12 + p * 0.7);
    mesh.current.rotation.z += delta * (0.04 + p * 0.25);
    mesh.current.scale.setScalar(1 - p * 0.18);

    // La distorsion explose : l'orbe se désintègre
    const mat = mesh.current.material as DistortMaterial;
    mat.distort = 0.38 + p * 0.55;
    mat.emissiveIntensity = 0.22 + p * 0.6;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.9}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.55, 32]} />
        <MeshDistortMaterial
          color="#2a2050"
          emissive="#7c5cff"
          emissiveIntensity={0.22}
          roughness={0.18}
          metalness={0.85}
          distort={0.38}
          speed={1.6}
        />
      </mesh>
    </Float>
  );
}

/**
 * Anneau de particules en orbite autour de l'orbe.
 * Au scroll, les particules s'échappent vers l'extérieur.
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
    points.current.rotation.y += delta * (0.08 + p * 0.4);
    points.current.scale.setScalar(1 + p * 1.6);
    (points.current.material as THREE.PointsMaterial).opacity =
      0.85 * (1 - p * 0.45);
  });

  return (
    <points ref={points} rotation={[0.45, 0, 0.18]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#4cc9f0"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Champ d'étoiles en arrière-plan. */
function Stars() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 900;
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
    points.current.rotation.y += delta * 0.015;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#8a8a9e"
        transparent
        opacity={0.55}
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
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 4]} intensity={45} color="#7c5cff" />
      <pointLight position={[-4, -2, 3]} intensity={28} color="#4cc9f0" />
      <Scene />
    </Canvas>
  );
}
