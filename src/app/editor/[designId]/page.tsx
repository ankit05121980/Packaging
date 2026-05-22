"use client";

import React, { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { EditorHeader } from "@/components/editor/editor-header";
import { EditorSidebar } from "@/components/editor/editor-sidebar";
import { useEditorStore } from "@/stores/editor-store";
import { getProductBySlug } from "@/lib/mock-data";

const EditorScene = dynamic(
  () => import("@/components/editor/scene").then((m) => m.EditorScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading 3D Editor...</p>
        </div>
      </div>
    ),
  }
);

export default function EditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const designId = params.designId as string;
  const productSlug = searchParams.get("product");

  const store = useEditorStore();

  useEffect(() => {
    if (designId === "new") {
      store.setDesignId("new");
      if (productSlug) {
        const product = getProductBySlug(productSlug);
        if (product) {
          store.setProductId(product.id);
          store.setName(`${product.name} - Custom Design`);
        }
      }
    } else {
      store.setDesignId(designId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designId, productSlug]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-900">
      <EditorHeader />
      <div className="flex-1 flex overflow-hidden">
        <EditorSidebar />
        <div className="flex-1 relative">
          <EditorScene />
          {/* Floating info */}
          <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700">
            <p className="text-[10px] text-slate-400">
              Scroll to zoom &middot; Click + drag to rotate &middot; Right-click to pan
            </p>
          </div>
          <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700">
            <p className="text-xs font-mono text-slate-300">
              {store.dimensions.length} x {store.dimensions.width} x{" "}
              {store.dimensions.depth} mm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
