"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center max-w-md">
        <Construction className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white">3D Editor</h1>
        <p className="text-slate-400 mt-2">
          The interactive 3D packaging canvas editor will be built in Module 3.
          This page will feature React Three Fiber with mesh texture mapping,
          design toolkit panel, and real-time 3D preview.
        </p>
        <Link href="/products">
          <Button variant="primary" className="mt-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>
    </div>
  );
}
