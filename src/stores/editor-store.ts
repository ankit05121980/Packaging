import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BoxFace, MaterialType, FinishOption, PrintType, TextLayer, ImageLayer } from '@/types/database';

export interface EditorState {
  designId: string | null;
  productId: string | null;
  name: string;

  dimensions: { length: number; width: number; depth: number };
  baseColor: string;
  material: MaterialType;
  finish: FinishOption;
  printType: PrintType;

  activeFace: BoxFace;
  textLayers: TextLayer[];
  imageLayers: ImageLayer[];

  isDirty: boolean;
  isSaving: boolean;

  setDesignId: (id: string) => void;
  setProductId: (id: string) => void;
  setName: (name: string) => void;
  setDimensions: (dims: { length: number; width: number; depth: number }) => void;
  setBaseColor: (color: string) => void;
  setMaterial: (material: MaterialType) => void;
  setFinish: (finish: FinishOption) => void;
  setPrintType: (printType: PrintType) => void;
  setActiveFace: (face: BoxFace) => void;

  addTextLayer: (layer: TextLayer) => void;
  updateTextLayer: (id: string, updates: Partial<TextLayer>) => void;
  removeTextLayer: (id: string) => void;

  addImageLayer: (layer: ImageLayer) => void;
  updateImageLayer: (id: string, updates: Partial<ImageLayer>) => void;
  removeImageLayer: (id: string) => void;

  markDirty: () => void;
  markClean: () => void;
  setSaving: (saving: boolean) => void;
  reset: () => void;
}

const initialState = {
  designId: null,
  productId: null,
  name: 'Untitled Design',
  dimensions: { length: 200, width: 150, depth: 100 },
  baseColor: '#D4A574',
  material: 'kraft' as MaterialType,
  finish: 'matte' as FinishOption,
  printType: 'unprinted' as PrintType,
  activeFace: 'front' as BoxFace,
  textLayers: [],
  imageLayers: [],
  isDirty: false,
  isSaving: false,
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      ...initialState,

      setDesignId: (id) => set({ designId: id }),
      setProductId: (id) => set({ productId: id }),
      setName: (name) => set({ name, isDirty: true }),
      setDimensions: (dimensions) => set({ dimensions, isDirty: true }),
      setBaseColor: (baseColor) => set({ baseColor, isDirty: true }),
      setMaterial: (material) => set({ material, isDirty: true }),
      setFinish: (finish) => set({ finish, isDirty: true }),
      setPrintType: (printType) => set({ printType, isDirty: true }),
      setActiveFace: (activeFace) => set({ activeFace }),

      addTextLayer: (layer) =>
        set((state) => ({
          textLayers: [...state.textLayers, layer],
          isDirty: true,
        })),
      updateTextLayer: (id, updates) =>
        set((state) => ({
          textLayers: state.textLayers.map((l) =>
            l.id === id ? { ...l, ...updates } : l
          ),
          isDirty: true,
        })),
      removeTextLayer: (id) =>
        set((state) => ({
          textLayers: state.textLayers.filter((l) => l.id !== id),
          isDirty: true,
        })),

      addImageLayer: (layer) =>
        set((state) => ({
          imageLayers: [...state.imageLayers, layer],
          isDirty: true,
        })),
      updateImageLayer: (id, updates) =>
        set((state) => ({
          imageLayers: state.imageLayers.map((l) =>
            l.id === id ? { ...l, ...updates } : l
          ),
          isDirty: true,
        })),
      removeImageLayer: (id) =>
        set((state) => ({
          imageLayers: state.imageLayers.filter((l) => l.id !== id),
          isDirty: true,
        })),

      markDirty: () => set({ isDirty: true }),
      markClean: () => set({ isDirty: false }),
      setSaving: (isSaving) => set({ isSaving }),
      reset: () => set(initialState),
    }),
    {
      name: 'packcraft-editor-drafts',
    }
  )
);
