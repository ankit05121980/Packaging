"use client";

import React from "react";
import { Minus, Plus, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DISCOUNT_TIERS } from "@/lib/pricing";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  min: number;
  onChange: (v: number) => void;
}

export function QuantitySelector({ value, min, onChange }: Props) {
  const activeTierIdx = DISCOUNT_TIERS.findIndex(
    (t) => value >= t.minQty && (t.maxQty === null || value <= t.maxQty)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onChange(Math.max(min, value - 10))}
          disabled={value <= min}
          className="h-10 w-10"
        >
          <Minus className="w-4 h-4" />
        </Button>

        <Input
          type="number"
          value={value}
          min={min}
          onChange={(e) => {
            const v = parseInt(e.target.value) || min;
            onChange(Math.max(min, v));
          }}
          className="text-center text-lg font-semibold h-12"
        />

        <Button
          variant="outline"
          size="icon"
          onClick={() => onChange(value + 10)}
          className="h-10 w-10"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-xs text-slate-500 flex items-center gap-1">
        <Info className="w-3 h-3" />
        Minimum order: {min} units
      </p>

      {/* Discount Tiers */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-700">Volume Discounts</p>
        <div className="grid grid-cols-2 gap-2">
          {DISCOUNT_TIERS.map((tier, i) => {
            const isActive = i === activeTierIdx;
            const isReachable = value < tier.minQty;
            return (
              <button
                key={tier.label}
                onClick={() => onChange(tier.minQty)}
                className={cn(
                  "p-2.5 rounded-lg border-2 text-left transition-all",
                  isActive
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-900">
                    {tier.label}
                  </span>
                  {tier.percentage > 0 && (
                    <Badge
                      variant={isActive ? "success" : "secondary"}
                      className="text-[10px]"
                    >
                      -{tier.percentage}%
                    </Badge>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {tier.minQty}
                  {tier.maxQty ? `–${tier.maxQty}` : "+"} units
                </p>
                {isReachable && tier.percentage > 0 && (
                  <p className="text-[10px] text-emerald-600 mt-0.5">
                    Add {tier.minQty - value} more to save {tier.percentage}%
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
