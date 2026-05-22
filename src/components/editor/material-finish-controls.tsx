"use client";

import React from "react";
import { Layers, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor-store";
import type { MaterialType, FinishOption, PrintType } from "@/types/database";

const MATERIALS: { type: MaterialType; label: string; color: string }[] = [
  { type: "kraft", label: "Kraft", color: "bg-kraft-400" },
  { type: "white", label: "White", color: "bg-white" },
  { type: "bleached", label: "Bleached", color: "bg-slate-200" },
];

const FINISHES: { type: FinishOption; label: string }[] = [
  { type: "matte", label: "Matte" },
  { type: "glossy", label: "Glossy" },
  { type: "foil", label: "Foil" },
  { type: "spot_uv", label: "Spot UV" },
  { type: "embossed", label: "Emboss" },
];

const PRINT_TYPES: { type: PrintType; label: string }[] = [
  { type: "unprinted", label: "None" },
  { type: "single_color", label: "1-Color" },
  { type: "full_color", label: "Full" },
];

export function MaterialFinishControls() {
  const material = useEditorStore((s) => s.material);
  const finish = useEditorStore((s) => s.finish);
  const printType = useEditorStore((s) => s.printType);
  const setMaterial = useEditorStore((s) => s.setMaterial);
  const setFinish = useEditorStore((s) => s.setFinish);
  const setPrintType = useEditorStore((s) => s.setPrintType);

  return (
    <div className="space-y-4">
      {/* Material */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          Material
        </label>
        <div className="flex gap-1.5">
          {MATERIALS.map((m) => (
            <button
              key={m.type}
              onClick={() => setMaterial(m.type)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                material === m.type
                  ? "bg-emerald-600/20 ring-1 ring-emerald-500"
                  : "bg-slate-700/50 hover:bg-slate-700"
              )}
            >
              <div
                className={cn("w-5 h-5 rounded-full border border-slate-500", m.color)}
              />
              <span className="text-[10px] text-slate-300">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Finish */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Finish
        </label>
        <div className="flex flex-wrap gap-1.5">
          {FINISHES.map((f) => (
            <button
              key={f.type}
              onClick={() => setFinish(f.type)}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all",
                finish === f.type
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Print Type */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Print
        </label>
        <div className="flex gap-1.5">
          {PRINT_TYPES.map((p) => (
            <button
              key={p.type}
              onClick={() => setPrintType(p.type)}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all",
                printType === p.type
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
