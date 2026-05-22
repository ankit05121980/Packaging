"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MaterialType } from "@/types/database";

interface MaterialOption {
  type: MaterialType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  eco: boolean;
}

const MATERIALS: MaterialOption[] = [
  {
    type: "kraft",
    label: "Eco Kraft",
    description: "Natural brown kraft, 100% recycled & recyclable",
    icon: <Leaf className="w-5 h-5" />,
    color: "border-kraft-400 bg-kraft-50 text-kraft-700",
    bgColor: "bg-kraft-400",
    eco: true,
  },
  {
    type: "white",
    label: "Premium White",
    description: "Smooth white surface for vibrant full-color printing",
    icon: <Sparkles className="w-5 h-5" />,
    color: "border-slate-300 bg-white text-slate-700",
    bgColor: "bg-white border-2 border-slate-200",
    eco: false,
  },
  {
    type: "bleached",
    label: "Luxury Bleached",
    description: "Ultra-premium bleached board for luxury products",
    icon: <Sparkles className="w-5 h-5" />,
    color: "border-slate-200 bg-slate-50 text-slate-600",
    bgColor: "bg-slate-100",
    eco: false,
  },
];

interface Props {
  available: MaterialType[];
  selected: MaterialType;
  onChange: (m: MaterialType) => void;
}

export function MaterialSelector({ available, selected, onChange }: Props) {
  const options = MATERIALS.filter((m) => available.includes(m.type));

  return (
    <div className="space-y-3">
      {options.map((mat) => {
        const isSelected = selected === mat.type;
        return (
          <motion.button
            key={mat.type}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(mat.type)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
              isSelected
                ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shadow-sm",
                mat.bgColor
              )}
            >
              <div className={cn("w-6 h-6 rounded", mat.bgColor)} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">{mat.label}</span>
                {mat.eco && (
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                    ECO
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{mat.description}</p>
            </div>

            {isSelected && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
