"use client";

import React, { useState } from "react";
import {
  Palette,
  Type,
  Image as ImageIcon,
  Ruler,
  Layers,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FaceSelector } from "./face-selector";
import { ColorPicker } from "./color-picker";
import { ImageUploader } from "./image-uploader";
import { TextEditor } from "./text-editor";
import { DimensionControls } from "./dimension-controls";
import { MaterialFinishControls } from "./material-finish-controls";

type TabId = "face" | "color" | "image" | "text" | "dimensions" | "material";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "face", label: "Face", icon: <Layers className="w-4 h-4" /> },
  { id: "color", label: "Color", icon: <Palette className="w-4 h-4" /> },
  { id: "image", label: "Image", icon: <ImageIcon className="w-4 h-4" /> },
  { id: "text", label: "Text", icon: <Type className="w-4 h-4" /> },
  { id: "dimensions", label: "Size", icon: <Ruler className="w-4 h-4" /> },
  { id: "material", label: "Material", icon: <Layers className="w-4 h-4" /> },
];

export function EditorSidebar() {
  const [activeTab, setActiveTab] = useState<TabId>("face");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "bg-slate-800 border-r border-slate-700 flex transition-all duration-300",
        collapsed ? "w-14" : "w-72"
      )}
    >
      {/* Tab rail */}
      <div className="w-14 flex-shrink-0 bg-slate-900 border-r border-slate-700 flex flex-col items-center py-2 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (collapsed) setCollapsed(false);
              setActiveTab(tab.id);
            }}
            className={cn(
              "w-10 h-10 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all",
              activeTab === tab.id && !collapsed
                ? "bg-emerald-600 text-white"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
            )}
            title={tab.label}
          >
            {tab.icon}
            <span className="text-[8px] font-medium">{tab.label}</span>
          </button>
        ))}

        <div className="flex-1" />

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
        >
          <ChevronRight
            className={cn(
              "w-4 h-4 transition-transform",
              collapsed ? "" : "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Panel content */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
          {activeTab === "face" && <FaceSelector />}
          {activeTab === "color" && <ColorPicker />}
          {activeTab === "image" && <ImageUploader />}
          {activeTab === "text" && <TextEditor />}
          {activeTab === "dimensions" && <DimensionControls />}
          {activeTab === "material" && <MaterialFinishControls />}
        </div>
      )}
    </div>
  );
}
