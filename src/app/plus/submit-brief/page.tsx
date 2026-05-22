"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubmitBriefPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <Briefcase className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">PackCraft Plus</h1>
        <p className="text-slate-500 mt-2">
          The enterprise B2B brief submission wizard will be built in Module 4.
          This multi-step form will handle packaging specifications, logistics
          requirements, document uploads, and RFQ tracking.
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
