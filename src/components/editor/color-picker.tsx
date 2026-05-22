"use client";

import React, { useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { useEditorStore } from "@/stores/editor-store";

const PRESET_COLORS = [
  "#D4A574", "#F5E6D3", "#FFFFFF", "#F8F8F8",
  "#1A1A1A", "#2D3436", "#E17055", "#00B894",
  "#6C5CE7", "#FDCB6E", "#E84393", "#0984E3",
  "#00CEC9", "#FAB1A0", "#DFE6E9", "#636E72",
];

export function ColorPicker() {
  const baseColor = useEditorStore((s) => s.baseColor);
  const setBaseColor = useEditorStore((s) => s.setBaseColor);
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Base Color
      </label>

      {/* Presets */}
      <div className="grid grid-cols-8 gap-1.5">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setBaseColor(color)}
            className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 ${
              baseColor === color
                ? "border-emerald-400 ring-2 ring-emerald-400/30"
                : "border-slate-600"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Custom picker toggle */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
      >
        <div
          className="w-5 h-5 rounded border border-slate-600"
          style={{ backgroundColor: baseColor }}
        />
        Custom: {baseColor}
      </button>

      {showPicker && (
        <div className="space-y-2">
          <HexColorPicker
            color={baseColor}
            onChange={setBaseColor}
            style={{ width: "100%" }}
          />
          <HexColorInput
            color={baseColor}
            onChange={setBaseColor}
            prefixed
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white font-mono"
          />
        </div>
      )}
    </div>
  );
}
