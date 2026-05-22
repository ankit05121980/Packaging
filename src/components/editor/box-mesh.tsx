"use client";

import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEditorStore } from "@/stores/editor-store";
import type { BoxFace } from "@/types/database";

const FACE_ORDER: BoxFace[] = ["right", "left", "top", "bottom", "front", "back"];

const MATERIAL_BASE_COLORS: Record<string, string> = {
  kraft: "#D4A574",
  white: "#F8F8F8",
  bleached: "#EEEEEE",
};

interface FaceCanvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
}

export function BoxMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const faceCanvasesRef = useRef<Map<BoxFace, FaceCanvas>>(new Map());

  const dimensions = useEditorStore((s) => s.dimensions);
  const baseColor = useEditorStore((s) => s.baseColor);
  const material = useEditorStore((s) => s.material);
  const activeFace = useEditorStore((s) => s.activeFace);
  const textLayers = useEditorStore((s) => s.textLayers);
  const imageLayers = useEditorStore((s) => s.imageLayers);

  const scaleX = dimensions.length / 200;
  const scaleY = dimensions.depth / 200;
  const scaleZ = dimensions.width / 200;

  const resolvedBaseColor = baseColor === "#D4A574"
    ? MATERIAL_BASE_COLORS[material] || baseColor
    : baseColor;

  const faceCanvases = useMemo(() => {
    const map = new Map<BoxFace, FaceCanvas>();
    FACE_ORDER.forEach((face) => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      map.set(face, { canvas, ctx, texture });
    });
    faceCanvasesRef.current = map;
    return map;
  }, []);

  useEffect(() => {
    FACE_ORDER.forEach((face) => {
      const fc = faceCanvases.get(face);
      if (!fc) return;
      const { ctx, canvas, texture } = fc;

      ctx.fillStyle = resolvedBaseColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (face === activeFace) {
        ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
        ctx.lineWidth = 8;
        ctx.setLineDash([16, 8]);
        ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
        ctx.setLineDash([]);
      }

      const faceImages = imageLayers.filter((l) => l.face === face);
      faceImages.forEach((layer) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          ctx.save();
          const cx = (layer.x / 100) * canvas.width;
          const cy = (layer.y / 100) * canvas.height;
          const w = (layer.width / 100) * canvas.width * layer.scale;
          const h = (layer.height / 100) * canvas.height * layer.scale;
          ctx.translate(cx + w / 2, cy + h / 2);
          ctx.rotate((layer.rotation * Math.PI) / 180);
          ctx.drawImage(img, -w / 2, -h / 2, w, h);
          ctx.restore();
          texture.needsUpdate = true;
        };
        img.src = layer.url;
      });

      const faceTexts = textLayers.filter((l) => l.face === face);
      faceTexts.forEach((layer) => {
        ctx.save();
        const x = (layer.x / 100) * canvas.width;
        const y = (layer.y / 100) * canvas.height;
        ctx.translate(x, y);
        ctx.rotate((layer.rotation * Math.PI) / 180);
        ctx.font = `${layer.fontSize * 3}px ${layer.fontFamily}`;
        ctx.fillStyle = layer.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(layer.text, 0, 0);
        ctx.restore();
      });

      texture.needsUpdate = true;
    });
  }, [resolvedBaseColor, activeFace, textLayers, imageLayers, faceCanvases]);

  const materials = useMemo(() => {
    return FACE_ORDER.map((face) => {
      const fc = faceCanvases.get(face);
      if (!fc) {
        return new THREE.MeshStandardMaterial({ color: resolvedBaseColor });
      }
      return new THREE.MeshStandardMaterial({
        map: fc.texture,
        roughness: 0.65,
        metalness: 0.05,
      });
    });
  }, [faceCanvases, resolvedBaseColor]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef} scale={[scaleX, scaleY, scaleZ]} material={materials} castShadow receiveShadow>
      <boxGeometry args={[2, 2, 2]} />
    </mesh>
  );
}
