"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MaterialType } from "@/types/database";

const MATERIAL_BG: Record<MaterialType, string> = {
  kraft: "from-kraft-100 to-kraft-200",
  white: "from-slate-50 to-white",
  bleached: "from-slate-50 to-slate-100",
};

const MATERIAL_BOX_COLOR: Record<MaterialType, string> = {
  kraft: "bg-kraft-300",
  white: "bg-white border-2 border-slate-200",
  bleached: "bg-slate-100",
};

interface Props {
  productName: string;
  material: MaterialType;
  length: number;
  width: number;
  depth: number;
  ecoLabel: boolean;
}

export function ProductGallery({
  productName: _productName,
  material,
  length,
  width,
  depth,
  ecoLabel,
}: Props) {
  const [activeView, setActiveView] = useState(0);
  const views = ["Front", "Angle", "Top", "Open"];

  return (
    <div className="space-y-4">
      {/* Main View */}
      <div
        className={cn(
          "relative aspect-square rounded-2xl bg-gradient-to-br overflow-hidden",
          MATERIAL_BG[material]
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative">
              <motion.div
                className={cn(
                  "rounded-2xl shadow-2xl flex items-center justify-center",
                  MATERIAL_BOX_COLOR[material]
                )}
                style={{
                  width: Math.max(120, Math.min(280, length * 0.7)),
                  height: Math.max(80, Math.min(200, (width + depth) * 0.4)),
                }}
                animate={{
                  rotateY: activeView === 1 ? 15 : 0,
                  rotateX: activeView === 2 ? 20 : activeView === 3 ? -10 : 0,
                }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <Package
                  className={cn(
                    "w-16 h-16",
                    material === "kraft" ? "text-kraft-600" : "text-slate-400"
                  )}
                />
              </motion.div>

              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/5 blur-xl rounded-full" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* View labels */}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm">
            {views[activeView]} View
          </Badge>
        </div>

        {ecoLabel && (
          <Badge
            variant="success"
            className="absolute top-4 right-4"
          >
            FSC Certified
          </Badge>
        )}

        {/* Dimension overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">Dimensions</span>
            <span className="font-mono font-medium text-slate-700">
              {length} x {width} x {depth} mm
            </span>
          </div>
        </div>

        {/* Nav arrows */}
        <button
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          onClick={() =>
            setActiveView((v) => (v - 1 + views.length) % views.length)
          }
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          onClick={() => setActiveView((v) => (v + 1) % views.length)}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2">
        {views.map((view, i) => (
          <button
            key={view}
            onClick={() => setActiveView(i)}
            className={cn(
              "flex-1 aspect-square rounded-xl border-2 flex items-center justify-center transition-all",
              i === activeView
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 bg-slate-50 hover:border-slate-300"
            )}
          >
            <div className="text-center">
              <Package
                className={cn(
                  "w-6 h-6 mx-auto",
                  i === activeView ? "text-emerald-600" : "text-slate-400"
                )}
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {view}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
