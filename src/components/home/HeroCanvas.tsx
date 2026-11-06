"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Home hero scene (AGENTS.md §11.2): glowing lanes receding in perspective with
 * a rising arrow. Low poly, basic materials only (no lights), dpr capped at 1.5,
 * rendering paused off-screen and in hidden tabs.
 */

const LANE_COUNT = 7;

function LaneField() {
  const field = useRef<THREE.Group>(null);
  const lanes = useMemo(
    () =>
      Array.from({ length: LANE_COUNT }, (_, i) => ({
        x: (i - (LANE_COUNT - 1) / 2) * 1.15,
        z: -5 - (i % 3) * 4,
        color: i % 3 === 1 ? "#7CF4EF" : i % 3 === 2 ? "#0572F5" : "#1ED3F2",
      })),
    [],
  );

  useFrame((_, delta) => {
    field.current?.children.forEach((lane) => {
      lane.position.z += delta * 1.3;
      if (lane.position.z > 5) lane.position.z -= 26;
    });
  });

  return (
    <group ref={field}>
      {lanes.map((lane, i) => (
        <mesh key={i} position={[lane.x, -0.95, lane.z]}>
          <boxGeometry args={[0.035, 0.02, 21]} />
          <meshBasicMaterial color={lane.color} transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function RisingArrow() {
  const arrow = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!arrow.current) return;
    const t = clock.getElapsedTime();
    arrow.current.position.y = 0.05 + Math.sin(t * 0.9) * 0.1;
    arrow.current.rotation.y = Math.sin(t * 0.32) * 0.35;
  });

  return (
    <group ref={arrow} position={[0, 0.05, -1.5]}>
      <mesh position={[0, 0.52, 0]}>
        <coneGeometry args={[0.3, 0.52, 4]} />
        <meshBasicMaterial color="#7CF4EF" />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.1, 0.62, 0.1]} />
        <meshBasicMaterial color="#10A9F2" />
      </mesh>
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.46, 48]} />
        <meshBasicMaterial color="#1ED3F2" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CameraRig() {
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    camera.lookAt(0, 0.15, -5);
  }, [camera]);
  return null;
}

export default function HeroCanvas() {
  const host = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.05,
    });
    if (host.current) observer.observe(host.current);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={host} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={inView && visible ? "always" : "never"}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.35, 6.4], fov: 46, near: 0.1, far: 60 }}
      >
        <CameraRig />
        <LaneField />
        <RisingArrow />
      </Canvas>
    </div>
  );
}
