import { create } from 'zustand';
import type { MaterialType, FinishOption, PrintType, Product, ProductVariant } from '@/types/database';
import { calculatePackagingPrice, type PricingResult } from '@/lib/pricing';

export interface ConfiguratorState {
  product: Product | null;
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;

  material: MaterialType;
  finish: FinishOption;
  printType: PrintType;
  quantity: number;

  dimensionMode: 'preset' | 'custom';
  length: number;
  width: number;
  depth: number;

  pricing: PricingResult | null;

  setProduct: (product: Product, variants: ProductVariant[]) => void;
  selectVariant: (variant: ProductVariant) => void;
  setMaterial: (material: MaterialType) => void;
  setFinish: (finish: FinishOption) => void;
  setPrintType: (printType: PrintType) => void;
  setQuantity: (quantity: number) => void;
  setDimensionMode: (mode: 'preset' | 'custom') => void;
  setLength: (length: number) => void;
  setWidth: (width: number) => void;
  setDepth: (depth: number) => void;
  recalculate: () => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  product: null,
  variants: [],
  selectedVariant: null,

  material: 'kraft',
  finish: 'matte',
  printType: 'unprinted',
  quantity: 10,

  dimensionMode: 'preset',
  length: 200,
  width: 150,
  depth: 100,

  pricing: null,

  setProduct: (product, variants) => {
    const firstVariant = variants[0] || null;
    set({
      product,
      variants,
      selectedVariant: firstVariant,
      material: firstVariant?.material_type || 'kraft',
      quantity: product.minimum_order_quantity,
      length: firstVariant?.preset_length_mm || 200,
      width: firstVariant?.preset_width_mm || 150,
      depth: firstVariant?.preset_depth_mm || 100,
    });
    get().recalculate();
  },

  selectVariant: (variant) => {
    set({
      selectedVariant: variant,
      material: variant.material_type,
      length: variant.preset_length_mm || get().length,
      width: variant.preset_width_mm || get().width,
      depth: variant.preset_depth_mm || get().depth,
      dimensionMode: 'preset',
    });
    get().recalculate();
  },

  setMaterial: (material) => {
    set({ material });
    const { variants } = get();
    const matching = variants.find((v) => v.material_type === material);
    if (matching) {
      set({ selectedVariant: matching });
    }
    get().recalculate();
  },

  setFinish: (finish) => {
    set({ finish });
    get().recalculate();
  },

  setPrintType: (printType) => {
    set({ printType });
    get().recalculate();
  },

  setQuantity: (quantity) => {
    const { product } = get();
    const min = product?.minimum_order_quantity || 1;
    set({ quantity: Math.max(min, quantity) });
    get().recalculate();
  },

  setDimensionMode: (mode) => {
    set({ dimensionMode: mode });
    if (mode === 'preset') {
      const { selectedVariant } = get();
      if (selectedVariant) {
        set({
          length: selectedVariant.preset_length_mm || get().length,
          width: selectedVariant.preset_width_mm || get().width,
          depth: selectedVariant.preset_depth_mm || get().depth,
        });
      }
    }
    get().recalculate();
  },

  setLength: (length) => {
    const { selectedVariant } = get();
    if (selectedVariant) {
      length = Math.min(Math.max(length, selectedVariant.min_length_mm), selectedVariant.max_length_mm);
    }
    set({ length });
    get().recalculate();
  },

  setWidth: (width) => {
    const { selectedVariant } = get();
    if (selectedVariant) {
      width = Math.min(Math.max(width, selectedVariant.min_width_mm), selectedVariant.max_width_mm);
    }
    set({ width });
    get().recalculate();
  },

  setDepth: (depth) => {
    const { selectedVariant } = get();
    if (selectedVariant) {
      depth = Math.min(Math.max(depth, selectedVariant.min_depth_mm), selectedVariant.max_depth_mm);
    }
    set({ depth });
    get().recalculate();
  },

  recalculate: () => {
    const { length, width, depth, selectedVariant, quantity, printType, product } = get();
    if (!selectedVariant || !product) return;

    const pricing = calculatePackagingPrice({
      length,
      width,
      depth,
      materialCostPerSqM: selectedVariant.material_cost_per_sqm,
      quantity,
      printType,
      setupFee: product.setup_fee,
    });
    set({ pricing });
  },
}));
