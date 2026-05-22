"use client";

import React, { useCallback, useRef } from "react";
import { Upload, Image as ImageIcon, Trash2, Move, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useEditorStore } from "@/stores/editor-store";
import { v4 as uuidv4 } from "uuid";

export function ImageUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeFace = useEditorStore((s) => s.activeFace);
  const imageLayers = useEditorStore((s) => s.imageLayers);
  const addImageLayer = useEditorStore((s) => s.addImageLayer);
  const updateImageLayer = useEditorStore((s) => s.updateImageLayer);
  const removeImageLayer = useEditorStore((s) => s.removeImageLayer);

  const faceImages = imageLayers.filter((l) => l.face === activeFace);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        addImageLayer({
          id: uuidv4(),
          face: activeFace,
          url,
          x: 25,
          y: 25,
          width: 50,
          height: 50,
          rotation: 0,
          scale: 1,
        });
      };
      reader.readAsDataURL(file);

      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [activeFace, addImageLayer]
  );

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Logo / Image
      </label>

      {/* Upload zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-600 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/5 transition-all"
      >
        <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2" />
        <p className="text-xs text-slate-400">
          Drop PNG, SVG, or JPG here
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          On: <span className="text-emerald-400 capitalize font-medium">{activeFace}</span> face
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Image layers list */}
      {faceImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] text-slate-500">
            {faceImages.length} image{faceImages.length !== 1 ? "s" : ""} on {activeFace}
          </p>
          {faceImages.map((layer, i) => (
            <div
              key={layer.id}
              className="bg-slate-700/50 rounded-lg p-3 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-300">
                    Image {i + 1}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-500 hover:text-red-400"
                  onClick={() => removeImageLayer(layer.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              {/* Position X */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Move className="w-3 h-3" /> X Position
                  </span>
                  <span>{layer.x}%</span>
                </div>
                <Slider
                  value={[layer.x]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([v]) =>
                    updateImageLayer(layer.id, { x: v })
                  }
                  className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                />
              </div>

              {/* Position Y */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Move className="w-3 h-3" /> Y Position
                  </span>
                  <span>{layer.y}%</span>
                </div>
                <Slider
                  value={[layer.y]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([v]) =>
                    updateImageLayer(layer.id, { y: v })
                  }
                  className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                />
              </div>

              {/* Scale */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Scale</span>
                  <span>{(layer.scale * 100).toFixed(0)}%</span>
                </div>
                <Slider
                  value={[layer.scale * 100]}
                  min={10}
                  max={200}
                  step={5}
                  onValueChange={([v]) =>
                    updateImageLayer(layer.id, { scale: v / 100 })
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
                    updateImageLayer(layer.id, { rotation: v })
                  }
                  className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
