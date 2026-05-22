"use client";

import React from "react";
import { motion } from "framer-motion";
import { Printer, Droplet, Palette, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PrintType } from "@/types/database";

const PRINT_OPTIONS: {
  type: PrintType;
  label: string;
  description: string;
  icon: React.ReactNode;
  priceNote: string;
}[] = [
  {
    type: "unprinted",
    label: "Unprinted",
    description: "Plain box without any printing",
    icon: <Printer className="w-5 h-5" />,
    priceNote: "No extra cost",
  },
  {
    type: "single_color",
    label: "Single Color",
    description: "One-color flexographic printing",
    icon: <Droplet className="w-5 h-5" />,
    priceNote: "+$0.15/m\u00b2",
  },
  {
    type: "full_color",
    label: "Full Color",
    description: "High-resolution CMYK digital printing",
    icon: <Palette className="w-5 h-5" />,
    priceNote: "+$0.40/m\u00b2",
  },
];

interface Props {
  selected: PrintType;
  onChange: (p: PrintType) => void;
}

export function PrintTypeSelector({ selected, onChange }: Props) {
  return (
    <div className="space-y-3">
      {PRINT_OPTIONS.map((opt) => {
        const isSelected = selected === opt.type;
        return (
          <motion.button
            key={opt.type}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(opt.type)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
              isSelected
                ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                isSelected
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              )}
            >
              {opt.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900">{opt.label}</p>
              <p className="text-xs text-slate-500">{opt.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-slate-500">{opt.priceNote}</p>
              {isSelected && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto mt-1" />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
