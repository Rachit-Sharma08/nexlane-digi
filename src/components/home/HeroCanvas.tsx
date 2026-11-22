"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Home hero scene (AGENTS §11.2, §13): our own N mark as a textured plane,
 * faked thickness from stacked tinted copies, slow float and pointer
 * parallax. No lights, no models, dpr capped at 1.5, rendering paused
 * off-screen and in hidden tabs.
 */

const LAYERS = 7;
const MARK_W = 3.1;
const MARK_H = MARK_W * (257 / 380);

function BrandMark() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const group = useRef<THREE.Group>(null);

  // Loaded by hand (not useLoader) so the texture is really ours to dispose.
  useEffect(() => {
    let disposed = false;
    new THREE.TextureLoader().load("/brand/nexlane-mark.png", (tex) => {
      if (disposed) {
        tex.dispose();
        return;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      setTexture(tex);
    });
    return () => {
      disposed = true;
    };
  }, []);

  useEffect(() => () => texture?.dispose(), [texture]);

  useFrame(({ clock, pointer }) => {
    const node = group.current;
    if (!node) return;
    const t = clock.getElapsedTime();
    node.position.y = Math.sin(t * 0.7) * 0.09;
    node.rotation.y = THREE.MathUtils.lerp(node.rotation.y, pointer.x * 0.34, 0.06);
    node.rotation.x = THREE.MathUtils.lerp(node.rotation.x, -pointer.y * 0.18, 0.06);
  });

  if (!texture) return null;

  return (
    <group ref={group}>
      {Array.from({ length: LAYERS }, (_, i) => {
        const front = i === LAYERS - 1;
        return (
          <mesh key={i} position={[0, 0, (i - (LAYERS - 1)) * 0.035]}>
            <planeGeometry args={[MARK_W, MARK_H]} />
            <meshBasicMaterial
              map={texture}
              transparent
              color={front ? "#ffffff" : "#0b3557"}
              opacity={front ? 1 : 0.92}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
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
    <div ref={host} className="absolute inset-0 z-[2]" aria-hidden="true">
      <Canvas
        frameloop={inView && visible ? "always" : "never"}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5.6], fov: 42, near: 0.1, far: 30 }}
      >
        <BrandMark />
      </Canvas>
    </div>
  );
}
