"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Save,
  FileDown,
  ShoppingCart,
  Package,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/stores/editor-store";
import { useCartStore } from "@/stores/cart-store";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { calculatePackagingPrice } from "@/lib/pricing";

export function EditorHeader() {
  const router = useRouter();
  const store = useEditorStore();
  const addToCart = useCartStore((s) => s.addItem);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const handleSaveDraft = async () => {
    setSaveStatus("saving");
    await new Promise((resolve) => setTimeout(resolve, 800));
    store.markClean();
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const handleExportPDF = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = `${store.name.replace(/\s+/g, "_")}_dieline.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  const handleAddToCart = () => {
    const pricing = calculatePackagingPrice({
      length: store.dimensions.length,
      width: store.dimensions.width,
      depth: store.dimensions.depth,
      materialCostPerSqM: 2.5,
      quantity: 10,
      printType: store.printType,
      setupFee: 50,
    });

    addToCart({
      id: uuidv4(),
      productId: store.productId || "custom",
      productSlug: "custom-design",
      productName: store.name,
      designId: store.designId || uuidv4(),
      quantity: 10,
      unitPrice: pricing.unitPrice,
      subtotal: pricing.subtotal,
      dimensions: store.dimensions,
      material: store.material,
      finish: store.finish,
      printType: store.printType,
      isSample: false,
    });
    router.push("/cart");
  };

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4 gap-4 z-50">
      {/* Left: Back + Name */}
      <div className="flex items-center gap-3 min-w-0">
        <Link href="/products">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>

        <div className="flex items-center gap-2 min-w-0">
          <Package className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <Input
            value={store.name}
            onChange={(e) => store.setName(e.target.value)}
            className="h-7 text-sm bg-transparent border-transparent text-white font-medium hover:border-slate-600 focus:border-emerald-500 max-w-[200px]"
          />
          {store.isDirty && (
            <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSaveDraft}
          disabled={saveStatus === "saving"}
          className="text-slate-400 hover:text-white h-8 text-xs"
        >
          {saveStatus === "saving" ? (
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
          ) : saveStatus === "saved" ? (
            <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
          ) : (
            <Save className="w-3.5 h-3.5 mr-1.5" />
          )}
          {saveStatus === "saved" ? "Saved" : "Save Draft"}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleExportPDF}
          className="text-slate-400 hover:text-white h-8 text-xs"
        >
          <FileDown className="w-3.5 h-3.5 mr-1.5" />
          Export
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={handleAddToCart}
          className="h-8 text-xs"
        >
          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
          Add to Cart
        </Button>
      </div>
    </header>
  );
}
