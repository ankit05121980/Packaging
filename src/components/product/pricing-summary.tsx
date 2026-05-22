"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Palette,
  Clock,
  Leaf,
  TreePine,
  Wallet,
  TrendingDown,
  ArrowRight,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { PricingResult } from "@/lib/pricing";
import { calculateCashback, calculateSustainabilityImpact } from "@/lib/pricing";

interface Props {
  pricing: PricingResult | null;
  quantity: number;
  productName: string;
  onAddToCart: () => void;
  onDesignNow: () => void;
  onOrderSample: () => void;
}

export function PricingSummary({
  pricing,
  quantity,
  productName: _productName,
  onAddToCart,
  onDesignNow,
  onOrderSample,
}: Props) {
  if (!pricing) return null;

  const cashback = calculateCashback(pricing.subtotal);
  const impact = calculateSustainabilityImpact(quantity);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + pricing.estimatedDeliveryDays);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      {/* Price Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-slate-300">Unit Price</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={pricing.unitPrice.toFixed(2)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-3xl font-bold"
              >
                {formatCurrency(pricing.unitPrice)}
              </motion.p>
            </AnimatePresence>
            {pricing.discountPercentage > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-400 line-through">
                  {formatCurrency(pricing.unitPriceBeforeDiscount)}
                </span>
                <Badge className="bg-emerald-500 text-white text-[10px]">
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                  {pricing.discountPercentage}% OFF
                </Badge>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-300">Total</p>
            <p className="text-xl font-bold">
              {formatCurrency(pricing.subtotal)}
            </p>
            <p className="text-xs text-slate-400">{quantity} units</p>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="p-6 space-y-4">
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Material Cost</span>
            <span>{formatCurrency(pricing.baseMaterialCost)}/unit</span>
          </div>
          {pricing.printSurcharge > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Print Surcharge</span>
              <span>+{formatCurrency(pricing.printSurcharge)}/unit</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Setup Fee (amortized)</span>
            <span>{formatCurrency(pricing.setupFee / quantity)}/unit</span>
          </div>
          {pricing.discountPercentage > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span className="flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                {pricing.discountTier.label} Discount
              </span>
              <span>-{formatCurrency(pricing.discountAmount)}/unit</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Delivery */}
        <div className="flex items-center gap-3 text-sm">
          <Clock className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-slate-700 font-medium">
              Est. Delivery: {deliveryDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-slate-500">
              {pricing.estimatedDeliveryDays} business days production time
            </p>
          </div>
        </div>

        {/* Sustainability */}
        <div className="bg-emerald-50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
            <Leaf className="w-4 h-4" />
            Sustainability Impact
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <TreePine className="w-3.5 h-3.5" />
              <span>{impact.treesPlanted} tree{impact.treesPlanted !== 1 ? "s" : ""} planted</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <Leaf className="w-3.5 h-3.5" />
              <span>{impact.carbonOffsetKg.toFixed(1)}kg CO2 offset</span>
            </div>
          </div>
        </div>

        {/* Cashback */}
        <div className="bg-amber-50 rounded-xl p-4 flex items-center gap-3">
          <Wallet className="w-5 h-5 text-amber-600" />
          <div className="text-sm">
            <p className="font-medium text-amber-800">
              Earn {formatCurrency(cashback)} Wallet Credit
            </p>
            <p className="text-xs text-amber-600">
              5% cashback on this purchase
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={onAddToCart}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart — {formatCurrency(pricing.subtotal)}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onDesignNow}
          >
            <Palette className="w-5 h-5 mr-2" />
            Design in 3D Editor
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <button
            onClick={onOrderSample}
            className="w-full text-center text-sm text-slate-500 hover:text-slate-700 underline-offset-4 hover:underline transition-colors py-2"
          >
            <Package className="w-4 h-4 inline mr-1" />
            Order a sample for $15.00
          </button>
        </div>
      </div>
    </motion.div>
  );
}
