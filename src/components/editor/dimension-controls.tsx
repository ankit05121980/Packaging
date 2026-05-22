"use client";

import React from "react";
import { Ruler } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/stores/editor-store";

export function DimensionControls() {
  const dimensions = useEditorStore((s) => s.dimensions);
  const setDimensions = useEditorStore((s) => s.setDimensions);

  const update = (key: "length" | "width" | "depth", value: number) => {
    setDimensions({ ...dimensions, [key]: Math.max(20, Math.min(600, value)) });
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Ruler className="w-3.5 h-3.5" />
        Dimensions (mm)
      </label>

      {(["length", "width", "depth"] as const).map((dim) => (
        <div key={dim} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 capitalize">{dim}</span>
            <Input
              type="number"
              value={dimensions[dim]}
              min={20}
              max={600}
              onChange={(e) => update(dim, Number(e.target.value))}
              className="w-20 h-7 text-xs text-center bg-slate-800 border-slate-600 text-white"
            />
          </div>
          <Slider
            value={[dimensions[dim]]}
            min={20}
            max={600}
            step={5}
            onValueChange={([v]) => update(dim, v)}
            className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
          />
        </div>
      ))}

      <div className="bg-slate-700/50 rounded-lg p-2.5 text-center">
        <span className="text-xs text-slate-400 font-mono">
          {dimensions.length} x {dimensions.width} x {dimensions.depth} mm
        </span>
      </div>
    </div>
  );
}
