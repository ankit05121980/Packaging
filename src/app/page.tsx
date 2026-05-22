"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  ArrowRight,
  Leaf,
  Truck,
  Palette,
  Shield,
  Recycle,
  Zap,
  Star,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRODUCTS } from "@/lib/mock-data";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const CATEGORIES = [
  { name: "Mailer Boxes", icon: Package, slug: "mailer", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { name: "Shipping Boxes", icon: Truck, slug: "shipping", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { name: "Rigid Boxes", icon: Shield, slug: "rigid", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { name: "Paper Bags", icon: Palette, slug: "bags", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

const FEATURES = [
  {
    icon: Palette,
    title: "3D Design Editor",
    description: "Design your packaging in our interactive 3D editor. Upload logos, add text, and see your creation come to life.",
  },
  {
    icon: Zap,
    title: "Instant Pricing",
    description: "Get real-time pricing as you configure. No waiting for quotes on standard orders.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Options",
    description: "FSC certified materials, water-based inks, and carbon offset with every order.",
  },
  {
    icon: Truck,
    title: "Fast Production",
    description: "7-21 day lead times. Express options available for urgent orders.",
  },
  {
    icon: Recycle,
    title: "100% Recyclable",
    description: "All our packaging is made from recyclable materials. Good for your brand, great for the planet.",
  },
  {
    icon: Building2,
    title: "Enterprise Solutions",
    description: "PackCraft Plus for large volumes, custom logistics, warehousing, and split shipments.",
  },
];

const MATERIAL_COLORS: Record<string, string> = {
  kraft: "bg-kraft-400",
  white: "bg-white border-2 border-slate-200",
  bleached: "bg-slate-50 border-2 border-slate-100",
};

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-amber-100 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <Badge variant="success" className="mb-6 py-1.5 px-4">
                <Leaf className="w-3.5 h-3.5 mr-1.5" />
                Eco-Friendly Packaging
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Custom Packaging
                <br />
                <span className="text-emerald-600">Made Simple</span>
              </h1>

              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-lg">
                Design, configure, and order custom packaging for your brand.
                From 10 units to 10,000+ — with instant pricing, 3D preview,
                and sustainable materials.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/products">
                  <Button variant="primary" size="xl">
                    Browse Products
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/plus/submit-brief">
                  <Button variant="outline" size="xl">
                    <Building2 className="w-5 h-5 mr-2" />
                    Enterprise Quotes
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-8 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>4.9/5 rating</span>
                </div>
                <div>Min. 10 units</div>
                <div>Free design tools</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-kraft-200 to-kraft-400 rounded-3xl transform rotate-6 shadow-2xl" />
                <div className="absolute inset-4 bg-gradient-to-br from-white to-kraft-100 rounded-2xl shadow-inner flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-24 bg-kraft-300 rounded-xl mx-auto mb-4 shadow-lg flex items-center justify-center transform -rotate-3">
                      <Package className="w-12 h-12 text-kraft-700" />
                    </div>
                    <p className="text-kraft-700 font-semibold text-lg">
                      Your Brand Here
                    </p>
                    <p className="text-kraft-500 text-sm mt-1">
                      Customizable in 3D
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-slate-900">
              Shop by Category
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-slate-500 max-w-2xl mx-auto">
              Choose from our range of customizable packaging solutions
            </motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/products?category=${cat.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 rounded-2xl ${cat.color} border flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <cat.icon className="w-7 h-7" />
                      </div>
                      <h3 className="font-semibold text-slate-900">{cat.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Starting from $0.35/unit
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Popular Products
              </h2>
              <p className="mt-2 text-slate-500">
                Our best-selling packaging solutions
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.slice(0, 6).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/products/${product.slug}`}>
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                      </div>

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
                        {product.features.slice(0, 2).map((f) => (
                          <Badge key={f} variant="secondary" className="text-[10px]">
                            {f}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">
              Why Choose PackCraft
            </h2>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              Everything you need to create stunning custom packaging
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Create Your Custom Packaging?
            </h2>
            <p className="mt-4 text-emerald-100 text-lg max-w-2xl mx-auto">
              Start with as few as 10 units. Get instant pricing and design
              your packaging in our free 3D editor.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <Button
                  size="xl"
                  className="bg-white text-emerald-700 hover:bg-emerald-50"
                >
                  Start Designing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/plus/submit-brief">
                <Button
                  variant="outline"
                  size="xl"
                  className="border-emerald-400 text-white hover:bg-emerald-600"
                >
                  Request Enterprise Quote
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
