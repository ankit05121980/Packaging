"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FinishOption } from "@/types/database";

const FINISH_LABELS: Record<FinishOption, { label: string; desc: string }> = {
  matte: { label: "Matte", desc: "Smooth non-reflective finish" },
  glossy: { label: "Glossy", desc: "Shiny reflective surface" },
  foil: { label: "Foil Stamping", desc: "Metallic foil accents" },
  spot_uv: { label: "Spot UV", desc: "Selective gloss coating" },
  embossed: { label: "Embossed", desc: "Raised texture effects" },
};

interface Props {
  available: FinishOption[];
  selected: FinishOption;
  onChange: (f: FinishOption) => void;
}

export function FinishSelector({ available, selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {available.map((f) => {
        const isSelected = selected === f;
        const info = FINISH_LABELS[f];
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={cn(
              "p-3 rounded-xl border-2 text-left transition-all",
              isSelected
                ? "border-emerald-500 bg-emerald-50/50"
                : "border-slate-200 hover:border-slate-300"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-900">
                {info.label}
              </span>
              {isSelected && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">{info.desc}</p>
          </button>
        );
      })}
    </div>
  );
}
