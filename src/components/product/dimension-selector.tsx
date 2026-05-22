"use client";

import React from "react";
import { motion } from "framer-motion";
import { Ruler, ToggleLeft, ToggleRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types/database";

interface Props {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  mode: "preset" | "custom";
  length: number;
  width: number;
  depth: number;
  onSelectVariant: (v: ProductVariant) => void;
  onModeChange: (mode: "preset" | "custom") => void;
  onLengthChange: (v: number) => void;
  onWidthChange: (v: number) => void;
  onDepthChange: (v: number) => void;
}

export function DimensionSelector({
  variants,
  selectedVariant,
  mode,
  length,
  width,
  depth,
  onSelectVariant,
  onModeChange,
  onLengthChange,
  onWidthChange,
  onDepthChange,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
        <button
          onClick={() => onModeChange("preset")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
            mode === "preset"
              ? "bg-white shadow-sm text-slate-900"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          <ToggleLeft className="w-4 h-4" />
          Standard Sizes
        </button>
        <button
          onClick={() => onModeChange("custom")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
            mode === "custom"
              ? "bg-white shadow-sm text-slate-900"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          <ToggleRight className="w-4 h-4" />
          Custom Dimensions
        </button>
      </div>

      {mode === "preset" ? (
        <div className="space-y-2">
          {variants.map((v) => (
            <motion.button
              key={v.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectVariant(v)}
              className={cn(
                "w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all text-left",
                selectedVariant?.id === v.id
                  ? "border-emerald-500 bg-emerald-50/50"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Ruler className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {v.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {v.preset_length_mm} x {v.preset_width_mm} x{" "}
                    {v.preset_depth_mm} mm
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                {v.material_thickness_gsm} GSM
              </Badge>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {selectedVariant && (
            <>
              <DimensionSlider
                label="Length (L)"
                value={length}
                min={selectedVariant.min_length_mm}
                max={selectedVariant.max_length_mm}
                onChange={onLengthChange}
                unit="mm"
              />
              <DimensionSlider
                label="Width (W)"
                value={width}
                min={selectedVariant.min_width_mm}
                max={selectedVariant.max_width_mm}
                onChange={onWidthChange}
                unit="mm"
              />
              {selectedVariant.max_depth_mm > 0 && (
                <DimensionSlider
                  label="Depth (D)"
                  value={depth}
                  min={selectedVariant.min_depth_mm}
                  max={selectedVariant.max_depth_mm}
                  onChange={onDepthChange}
                  unit="mm"
                />
              )}
            </>
          )}

          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Final Dimensions</span>
              <span className="font-mono font-medium text-slate-900">
                {length} x {width} x {depth} mm
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DimensionSlider({
  label,
  value,
  min,
  max,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  unit: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm text-slate-700">{label}</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={value}
            min={min}
            max={max}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-20 h-8 text-center text-sm"
          />
          <span className="text-xs text-slate-400">{unit}</span>
        </div>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={([v]) => onChange(v)}
      />
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
