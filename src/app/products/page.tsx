"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Leaf,
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PRODUCTS } from "@/lib/mock-data";
import type { ProductCategory } from "@/types/database";

const CATEGORIES: { label: string; value: ProductCategory | "all" }[] = [
  { label: "All Products", value: "all" },
  { label: "Mailer Boxes", value: "mailer" },
  { label: "Shipping Boxes", value: "shipping" },
  { label: "Rigid Boxes", value: "rigid" },
  { label: "Paper Bags", value: "bags" },
];

const MATERIAL_COLORS: Record<string, string> = {
  kraft: "bg-kraft-400",
  white: "bg-white border-2 border-slate-200",
  bleached: "bg-slate-50 border-2 border-slate-100",
};

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCategory = category === "all" || p.category === category;
      const matchSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [search, category]);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Custom Packaging Products
            </h1>
            <p className="mt-3 text-slate-500 max-w-2xl">
              Explore our range of customizable packaging solutions. Configure
              your perfect box with instant pricing.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block" />
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                variant={category === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat.value)}
                className={
                  category === cat.value
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : ""
                }
              >
                {cat.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-6">
          Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          {view === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link href={`/products/${product.slug}`}>
                    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                      <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-50 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-24 bg-kraft-300/80 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <Package className="w-10 h-10 text-kraft-700" />
                          </div>
                        </div>
                        {product.eco_certified && (
                          <Badge
                            variant="success"
                            className="absolute top-3 left-3"
                          >
                            <Leaf className="w-3 h-3 mr-1" />
                            Eco
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className="absolute top-3 right-3 capitalize"
                        >
                          {product.category}
                        </Badge>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="mt-4 flex items-center gap-2">
                          {product.material_types.map((m) => (
                            <div
                              key={m}
                              className={`w-5 h-5 rounded-full ${MATERIAL_COLORS[m]} shadow-sm`}
                              title={m}
                            />
                          ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-slate-900">
                              From ${product.base_price.toFixed(2)}
                            </span>
                            <span className="text-xs text-slate-400 ml-1">
                              /unit
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            MOQ: {product.minimum_order_quantity}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {product.features.slice(0, 3).map((f) => (
                            <Badge
                              key={f}
                              variant="secondary"
                              className="text-[10px]"
                            >
                              {f}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link href={`/products/${product.slug}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4 flex items-center gap-6">
                        <div className="w-24 h-20 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Package className="w-8 h-8 text-kraft-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                              {product.name}
                            </h3>
                            {product.eco_certified && (
                              <Badge variant="success" className="text-[10px]">
                                <Leaf className="w-3 h-3 mr-0.5" />
                                Eco
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">
                            {product.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {product.features.slice(0, 3).map((f) => (
                              <Badge
                                key={f}
                                variant="secondary"
                                className="text-[10px]"
                              >
                                {f}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold text-slate-900">
                            ${product.base_price.toFixed(2)}
                          </div>
                          <div className="text-xs text-slate-500">per unit</div>
                          <div className="text-xs text-slate-400 mt-1">
                            MOQ: {product.minimum_order_quantity}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700">
              No products found
            </h3>
            <p className="text-slate-500 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
