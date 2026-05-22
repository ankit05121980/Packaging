"use client";

import React, { useState } from "react";
import { Plus, Type, Trash2, RotateCw, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useEditorStore } from "@/stores/editor-store";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

const FONTS = [
  "Arial",
  "Helvetica",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Impact",
  "Comic Sans MS",
];

const TEXT_COLORS = [
  "#FFFFFF", "#000000", "#E74C3C", "#3498DB",
  "#2ECC71", "#F39C12", "#9B59B6", "#1ABC9C",
];

export function TextEditor() {
  const activeFace = useEditorStore((s) => s.activeFace);
  const textLayers = useEditorStore((s) => s.textLayers);
  const addTextLayer = useEditorStore((s) => s.addTextLayer);
  const updateTextLayer = useEditorStore((s) => s.updateTextLayer);
  const removeTextLayer = useEditorStore((s) => s.removeTextLayer);

  const faceTexts = textLayers.filter((l) => l.face === activeFace);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddText = () => {
    const id = uuidv4();
    addTextLayer({
      id,
      face: activeFace,
      text: "Your Text",
      fontFamily: "Arial",
      fontSize: 16,
      color: "#FFFFFF",
      x: 50,
      y: 50,
      rotation: 0,
    });
    setExpandedId(id);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Text Layers
        </label>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddText}
          className="h-7 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Text
        </Button>
      </div>

      {faceTexts.length === 0 && (
        <div className="text-center py-4 border border-dashed border-slate-700 rounded-xl">
          <Type className="w-5 h-5 text-slate-600 mx-auto mb-1" />
          <p className="text-[10px] text-slate-500">
            No text on <span className="text-emerald-400 capitalize">{activeFace}</span> face
          </p>
        </div>
      )}

      {faceTexts.map((layer) => {
        const isExpanded = expandedId === layer.id;
        return (
          <div
            key={layer.id}
            className="bg-slate-700/50 rounded-lg overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedId(isExpanded ? null : layer.id)
              }
              className="w-full flex items-center justify-between p-3 hover:bg-slate-700/80 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-slate-400" />
                <span
                  className="text-xs text-slate-200 max-w-[120px] truncate"
                  style={{
                    fontFamily: layer.fontFamily,
                    color: layer.color,
                  }}
                >
                  {layer.text || "Empty"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-500 hover:text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTextLayer(layer.id);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </button>

            {isExpanded && (
              <div className="p-3 pt-0 space-y-3 border-t border-slate-700">
                {/* Text Input */}
                <Input
                  value={layer.text}
                  onChange={(e) =>
                    updateTextLayer(layer.id, { text: e.target.value })
                  }
                  placeholder="Enter text..."
                  className="bg-slate-800 border-slate-600 text-white text-sm h-9"
                />

                {/* Font Select */}
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500">Font</p>
                  <div className="grid grid-cols-2 gap-1">
                    {FONTS.map((font) => (
                      <button
                        key={font}
                        onClick={() =>
                          updateTextLayer(layer.id, { fontFamily: font })
                        }
                        className={cn(
                          "text-[10px] py-1.5 px-2 rounded text-left truncate transition-colors",
                          layer.fontFamily === font
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        )}
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Size</span>
                    <span>{layer.fontSize}px</span>
                  </div>
                  <Slider
                    value={[layer.fontSize]}
                    min={8}
                    max={72}
                    step={1}
                    onValueChange={([v]) =>
                      updateTextLayer(layer.id, { fontSize: v })
                    }
                    className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                  />
                </div>

                {/* Color */}
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500">Color</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {TEXT_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          updateTextLayer(layer.id, { color })
                        }
                        className={cn(
                          "w-6 h-6 rounded-md border transition-all",
                          layer.color === color
                            ? "border-emerald-400 scale-110"
                            : "border-slate-600"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Position X */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Move className="w-3 h-3" /> X
                    </span>
                    <span>{layer.x}%</span>
                  </div>
                  <Slider
                    value={[layer.x]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([v]) =>
                      updateTextLayer(layer.id, { x: v })
                    }
                    className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                  />
                </div>

                {/* Position Y */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Move className="w-3 h-3" /> Y
                    </span>
                    <span>{layer.y}%</span>
                  </div>
                  <Slider
                    value={[layer.y]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([v]) =>
                      updateTextLayer(layer.id, { y: v })
                    }
                    className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                  />
                </div>

                {/* Rotation */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <RotateCw className="w-3 h-3" /> Rotation
                    </span>
                    <span>{layer.rotation}&deg;</span>
                  </div>
                  <Slider
                    value={[layer.rotation]}
                    min={0}
                    max={360}
                    step={5}
                    onValueChange={([v]) =>
                      updateTextLayer(layer.id, { rotation: v })
                    }
                    className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
