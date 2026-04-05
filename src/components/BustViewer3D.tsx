"use client";

import { useRef, useMemo, useCallback, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const AUTO_SPEED = 0.1;
const DRAG_SENSITIVITY = 0.01;
const MODEL_URL = "/lowpoly.glb";

function BustModel({
  dragRef,
}: {
  dragRef: React.RefObject<{ active: boolean; deltaX: number }>;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const meshRef = useRef<THREE.Group>(null);

  const { geo, scale } = useMemo(() => {
    let found: THREE.BufferGeometry | null = null;
    scene.traverse((child) => {
      if (!found && (child as THREE.Mesh).isMesh) {
        found = (child as THREE.Mesh).geometry.clone();
      }
    });
    if (!found) throw new Error("No mesh found in GLB");
    const geo: THREE.BufferGeometry = found;
    geo.rotateX(-Math.PI / 2);
    geo.center();
    geo.computeVertexNormals();
    geo.computeBoundingBox();
    const size = new THREE.Vector3();
    geo.boundingBox!.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    return { geo, scale: 2.4 / maxDim };
  }, [scene]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (dragRef.current.active) {
      meshRef.current.rotation.y += dragRef.current.deltaX * DRAG_SENSITIVITY;
      dragRef.current.deltaX = 0;
    } else {
      meshRef.current.rotation.y += 4 * delta * AUTO_SPEED;
    }
  });

  return (
    <group ref={meshRef} position={[0, -0.2, 0]}>
      <mesh geometry={geo} scale={scale}>
        <meshBasicMaterial color="#EE7374" />
      </mesh>
      <mesh geometry={geo} scale={scale}>
        <meshBasicMaterial color="white" wireframe />
      </mesh>
    </group>
  );
}

export default function BustViewer3D() {
  const dragRef = useRef({ active: false, deltaX: 0 });
  const lastX = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      dragRef.current.active = true;
      dragRef.current.deltaX = 0;
      lastX.current = e.clientX;
    },
    [],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current.active) return;
      dragRef.current.deltaX = e.clientX - lastX.current;
      lastX.current = e.clientX;
    },
    [],
  );

  const onPointerUp = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  return (
    <div
      className="w-[250px] h-[250px] rounded-2xl overflow-hidden shadow-lg shadow-stone-200/50 cursor-grab active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <Canvas
        camera={{ position: [0, -1, 4.2], fov: 34 }}
        gl={{ antialias: true }}
        style={{ background: "#EE7374" }}
      >
        <Suspense fallback={null}>
          <BustModel dragRef={dragRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
