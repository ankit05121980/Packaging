"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  Leaf,
  TreePine,
  Wallet,
  Package,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/lib/utils";
import { calculateCashback, calculateSustainabilityImpact } from "@/lib/pricing";

const MATERIAL_LABELS: Record<string, string> = {
  kraft: "Kraft",
  white: "White",
  bleached: "Bleached",
};

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    walletCreditsToApply,
    setWalletCredits,
    getSubtotal,
    getTotalItems,
  } = useCartStore();

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  const cashback = calculateCashback(subtotal);
  const impact = calculateSustainabilityImpact(totalItems);
  const walletBalance = 25.0;
  const maxApply = Math.min(walletBalance, subtotal);
  const finalTotal = Math.max(0, subtotal - walletCreditsToApply);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900">
            Your cart is empty
          </h1>
          <p className="text-slate-500 mt-2">
            Start configuring your custom packaging
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg" className="mt-6">
              Browse Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
            <p className="text-slate-500 mt-1">
              {items.length} item{items.length !== 1 ? "s" : ""} &middot;{" "}
              {totalItems} units total
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Package className="w-8 h-8 text-kraft-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {item.productName}
                              </h3>
                              {item.variantName && (
                                <p className="text-xs text-slate-500">
                                  {item.variantName}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary" className="text-[10px]">
                              {MATERIAL_LABELS[item.material] || item.material}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px]">
                              {item.dimensions.length}x{item.dimensions.width}x
                              {item.dimensions.depth}mm
                            </Badge>
                            {item.isSample && (
                              <Badge variant="warning" className="text-[10px]">
                                Sample
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {!item.isSample ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      Math.max(1, item.quantity - 10)
                                    )
                                  }
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-12 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 10)
                                  }
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <span className="text-sm text-slate-500">
                                1 sample
                              </span>
                            )}
                            <div className="text-right">
                              <p className="font-semibold text-slate-900">
                                {formatCurrency(item.subtotal)}
                              </p>
                              {!item.isSample && (
                                <p className="text-xs text-slate-500">
                                  {formatCurrency(item.unitPrice)}/unit
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Order Summary
                </h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shipping</span>
                    <span className="text-emerald-600 font-medium">
                      {totalItems >= 500 ? "FREE" : "Calculated at checkout"}
                    </span>
                  </div>
                  {walletCreditsToApply > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Wallet Credits</span>
                      <span className="font-medium">
                        -{formatCurrency(walletCreditsToApply)}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>

                {/* Wallet Credits */}
                {walletBalance > 0 && (
                  <div className="bg-amber-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                      <Wallet className="w-4 h-4" />
                      PackCraft Wallet
                    </div>
                    <div className="flex items-center justify-between text-xs text-amber-700">
                      <span>Available: {formatCurrency(walletBalance)}</span>
                      <span>Apply: {formatCurrency(walletCreditsToApply)}</span>
                    </div>
                    <Slider
                      value={[walletCreditsToApply]}
                      min={0}
                      max={maxApply}
                      step={0.5}
                      onValueChange={([v]) => setWalletCredits(v)}
                    />
                  </div>
                )}

                {/* Cashback incentive */}
                <div className="bg-emerald-50 rounded-xl p-4 flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                  <div className="text-sm">
                    <p className="font-medium text-emerald-800">
                      Earn {formatCurrency(cashback)}
                    </p>
                    <p className="text-xs text-emerald-600">
                      5% cashback to your wallet
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    window.alert("Stripe checkout session would be created here.");
                  }}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>

            {/* Sustainability Impact */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  Your Sustainability Impact
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-500">
                      <TreePine className="w-4 h-4 text-emerald-500" />
                      Trees Planted
                    </span>
                    <span className="font-medium text-emerald-700">
                      {impact.treesPlanted}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Leaf className="w-4 h-4 text-emerald-500" />
                      CO2 Offset
                    </span>
                    <span className="font-medium text-emerald-700">
                      {impact.carbonOffsetKg.toFixed(1)} kg
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
