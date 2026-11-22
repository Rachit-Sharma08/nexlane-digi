"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Home hero scene (AGENTS §11.2, §13): our own N mark as procedural geometry,
 * faked thickness from stacked tinted copies, slow float and pointer
 * parallax. No lights, no models, dpr capped at 1.5, rendering paused
 * off-screen and in hidden tabs.
 */

const LAYERS = 7;
const MARK_W = 3.1;
const MARK_H = MARK_W * (257 / 380);
const STROKE_WIDTH = 0.18;

function createNMarkGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const w = MARK_W;
  const h = MARK_H;
  const sw = STROKE_WIDTH;

  // N letter as a thick stroke path
  // Left vertical: x=0 to x=sw, y=0 to y=h
  // Diagonal: from (0, h) to (w, 0) with stroke width
  // Right vertical: x=w-sw to x=w, y=0 to y=h

  // We'll create the N as a single closed path using Shape
  // Left vertical down
  shape.moveTo(0, 0);
  shape.lineTo(sw, 0);
  shape.lineTo(sw, h);
  // Diagonal connection to right vertical
  shape.lineTo(w, h);
  shape.lineTo(w, 0);
  shape.lineTo(w - sw, 0);
  shape.lineTo(w - sw, h);
  // Diagonal back to left
  shape.lineTo(0, h);
  shape.lineTo(0, 0);

  const geometry = new THREE.ShapeGeometry(shape);
  geometry.translate(-w / 2, -h / 2, 0);
  return geometry;
}

function createArrowGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const w = MARK_W * 0.35;
  const h = MARK_H * 0.45;
  const sw = STROKE_WIDTH * 1.2;

  // Arrow pointing up: vertical stem + arrowhead
  const stemX = -sw / 2;
  const stemW = sw;
  const stemH = h * 0.6;
  const headW = w;
  const headH = h * 0.4;

  // Stem
  shape.moveTo(stemX, -h / 2);
  shape.lineTo(stemX + stemW, -h / 2);
  shape.lineTo(stemX + stemW, -h / 2 + stemH);
  // Arrowhead right
  shape.lineTo(stemX + stemW + headW / 2, -h / 2 + stemH);
  shape.lineTo(stemX + stemW / 2, -h / 2 + stemH - headH);
  // Arrowhead left
  shape.lineTo(stemX - headW / 2, -h / 2 + stemH);
  shape.lineTo(stemX, -h / 2 + stemH);
  shape.lineTo(stemX, -h / 2);

  const geometry = new THREE.ShapeGeometry(shape);
  geometry.translate(0, 0, 0);
  return geometry;
}

const nGeometry = createNMarkGeometry();
const arrowGeometry = createArrowGeometry();

function BrandMark() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    const node = group.current;
    if (!node) return;
    const t = clock.getElapsedTime();
    node.position.y = Math.sin(t * 0.7) * 0.09;
    node.rotation.y = THREE.MathUtils.lerp(node.rotation.y, pointer.x * 0.34, 0.06);
    node.rotation.x = THREE.MathUtils.lerp(node.rotation.x, -pointer.y * 0.18, 0.06);
  });

  return (
    <group ref={group}>
      {Array.from({ length: LAYERS }, (_, i) => {
        const front = i === LAYERS - 1;
        const z = (i - (LAYERS - 1)) * 0.035;
        return (
          <group key={i} position={[0, 0, z]}>
            {/* N letter - frost white on front, dark charcoal on back layers */}
            <mesh geometry={nGeometry}>
              <meshBasicMaterial
                color={front ? "#F5F3EF" : "#0F100F"}
                opacity={front ? 1 : 0.92}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Rising arrow - lime gradient (approximated with accent color) */}
            <mesh geometry={arrowGeometry} position={[0, -MARK_H * 0.15, 0]}>
              <meshBasicMaterial
                color={front ? "#C8FF2E" : "#8FCC00"}
                opacity={front ? 1 : 0.9}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
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