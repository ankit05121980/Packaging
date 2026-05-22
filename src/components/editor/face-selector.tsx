"use client";

import React from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Square,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor-store";
import type { BoxFace } from "@/types/database";

const FACES: { face: BoxFace; label: string; icon: React.ReactNode }[] = [
  { face: "front", label: "Front", icon: <Square className="w-4 h-4" /> },
  { face: "back", label: "Back", icon: <Layers className="w-4 h-4" /> },
  { face: "top", label: "Top", icon: <ArrowUp className="w-4 h-4" /> },
  { face: "bottom", label: "Bottom", icon: <ArrowDown className="w-4 h-4" /> },
  { face: "left", label: "Left", icon: <ArrowLeft className="w-4 h-4" /> },
  { face: "right", label: "Right", icon: <ArrowRight className="w-4 h-4" /> },
];

export function FaceSelector() {
  const activeFace = useEditorStore((s) => s.activeFace);
  const setActiveFace = useEditorStore((s) => s.setActiveFace);

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Active Face
      </label>
      <div className="grid grid-cols-3 gap-1.5">
        {FACES.map(({ face, label, icon }) => (
          <button
            key={face}
            onClick={() => setActiveFace(face)}
            className={cn(
              "flex flex-col items-center gap-1 p-2.5 rounded-lg text-xs font-medium transition-all",
              activeFace === face
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                : "bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            )}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
