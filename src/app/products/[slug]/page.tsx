"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Leaf, Shield, Truck, Clock } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { ProductGallery } from "@/components/product/product-gallery";
import { MaterialSelector } from "@/components/product/material-selector";
import { DimensionSelector } from "@/components/product/dimension-selector";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { PrintTypeSelector } from "@/components/product/print-type-selector";
import { FinishSelector } from "@/components/product/finish-selector";
import { PricingSummary } from "@/components/product/pricing-summary";

import { useConfiguratorStore } from "@/stores/configurator-store";
import { useCartStore } from "@/stores/cart-store";
import { getProductBySlug, getVariantsForProduct } from "@/lib/mock-data";
import { v4 as uuidv4 } from "uuid";

export default function ProductConfigPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const product = useMemo(() => getProductBySlug(slug), [slug]);
  const variants = useMemo(() => getVariantsForProduct(slug), [slug]);

  const store = useConfiguratorStore();
  const addToCart = useCartStore((s) => s.addItem);

  const initialized = useRef(false);
  useEffect(() => {
    if (product && variants.length > 0 && !initialized.current) {
      initialized.current = true;
      store.setProduct(product, variants);
    }
  }, [product, variants, store]);

  const filteredVariants = useMemo(
    () => variants.filter((v) => v.material_type === store.material),
    [variants, store.material]
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Product not found
          </h1>
          <Link href="/products">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!store.pricing || !product) return;
    addToCart({
      id: uuidv4(),
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      variantId: store.selectedVariant?.id,
      variantName: store.selectedVariant?.name,
      quantity: store.quantity,
      unitPrice: store.pricing.unitPrice,
      subtotal: store.pricing.subtotal,
      dimensions: {
        length: store.length,
        width: store.width,
        depth: store.depth,
      },
      material: store.material,
      finish: store.finish,
      printType: store.printType,
      isSample: false,
    });
    router.push("/cart");
  };

  const handleOrderSample = () => {
    if (!product) return;
    addToCart({
      id: uuidv4(),
      productId: product.id,
      productSlug: product.slug,
      productName: `${product.name} - Sample`,
      quantity: 1,
      unitPrice: product.sample_price,
      subtotal: product.sample_price,
      dimensions: {
        length: store.length,
        width: store.width,
        depth: store.depth,
      },
      material: store.material,
      finish: store.finish,
      printType: "unprinted",
      isSample: true,
    });
    router.push("/cart");
  };

  const handleDesignNow = () => {
    router.push(`/editor/new?product=${product.slug}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link
              href="/products"
              className="hover:text-slate-700 transition-colors"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left: Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5"
          >
            <div className="lg:sticky lg:top-24">
              <ProductGallery
                productName={product.name}
                material={store.material}
                length={store.length}
                width={store.width}
                depth={store.depth}
                ecoLabel={product.eco_certified}
              />

              {/* Features */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {product.features.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    {f}
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="mt-6 flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Quality Guarantee
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  Free Shipping 500+
                </div>
                <div className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  Eco Certified
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center: Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                  {product.name}
                </h1>
                <p className="text-slate-500 mt-1 text-sm">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  {product.eco_certified && (
                    <Badge variant="success">
                      <Leaf className="w-3 h-3 mr-1" />
                      Eco-Friendly
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    <Clock className="w-3 h-3 mr-1" />
                    {product.lead_time_days} day lead time
                  </Badge>
                </div>
              </div>

              <Accordion
                type="multiple"
                defaultValue={["material", "dimensions", "quantity", "print"]}
                className="space-y-0"
              >
                <AccordionItem value="material">
                  <AccordionTrigger className="text-base font-semibold">
                    Material
                  </AccordionTrigger>
                  <AccordionContent>
                    <MaterialSelector
                      available={product.material_types}
                      selected={store.material}
                      onChange={store.setMaterial}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="dimensions">
                  <AccordionTrigger className="text-base font-semibold">
                    Dimensions
                  </AccordionTrigger>
                  <AccordionContent>
                    <DimensionSelector
                      variants={filteredVariants}
                      selectedVariant={store.selectedVariant}
                      mode={store.dimensionMode}
                      length={store.length}
                      width={store.width}
                      depth={store.depth}
                      onSelectVariant={store.selectVariant}
                      onModeChange={store.setDimensionMode}
                      onLengthChange={store.setLength}
                      onWidthChange={store.setWidth}
                      onDepthChange={store.setDepth}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="quantity">
                  <AccordionTrigger className="text-base font-semibold">
                    Quantity
                  </AccordionTrigger>
                  <AccordionContent>
                    <QuantitySelector
                      value={store.quantity}
                      min={product.minimum_order_quantity}
                      onChange={store.setQuantity}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="print">
                  <AccordionTrigger className="text-base font-semibold">
                    Print Type
                  </AccordionTrigger>
                  <AccordionContent>
                    <PrintTypeSelector
                      selected={store.printType}
                      onChange={store.setPrintType}
                    />
                  </AccordionContent>
                </AccordionItem>

                {store.selectedVariant &&
                  store.selectedVariant.finish_options.length > 0 && (
                    <AccordionItem value="finish">
                      <AccordionTrigger className="text-base font-semibold">
                        Finish
                      </AccordionTrigger>
                      <AccordionContent>
                        <FinishSelector
                          available={store.selectedVariant.finish_options}
                          selected={store.finish}
                          onChange={store.setFinish}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  )}
              </Accordion>
            </div>
          </motion.div>

          {/* Right: Pricing Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="lg:sticky lg:top-24">
              <PricingSummary
                pricing={store.pricing}
                quantity={store.quantity}
                productName={product.name}
                onAddToCart={handleAddToCart}
                onDesignNow={handleDesignNow}
                onOrderSample={handleOrderSample}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
