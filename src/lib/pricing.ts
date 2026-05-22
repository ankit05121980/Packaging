import type { PrintType } from '@/types/database';

export interface PricingInput {
  length: number;
  width: number;
  depth: number;
  materialCostPerSqM: number;
  quantity: number;
  printType: PrintType;
  setupFee?: number;
}

export interface PricingResult {
  surfaceAreaSqM: number;
  baseMaterialCost: number;
  printSurcharge: number;
  setupFee: number;
  unitPriceBeforeDiscount: number;
  discountTier: DiscountTier;
  discountPercentage: number;
  discountAmount: number;
  unitPrice: number;
  subtotal: number;
  carbonOffset: number;
  estimatedDeliveryDays: number;
}

export interface DiscountTier {
  label: string;
  minQty: number;
  maxQty: number | null;
  percentage: number;
}

export const DISCOUNT_TIERS: DiscountTier[] = [
  { label: 'Standard', minQty: 1, maxQty: 49, percentage: 0 },
  { label: 'Starter', minQty: 50, maxQty: 99, percentage: 15 },
  { label: 'Business', minQty: 100, maxQty: 499, percentage: 30 },
  { label: 'Enterprise', minQty: 500, maxQty: null, percentage: 50 },
];

const PRINT_SURCHARGE: Record<PrintType, number> = {
  unprinted: 0,
  single_color: 0.15,
  full_color: 0.40,
};

const CARBON_OFFSET_PER_BOX = 0.02;
const DEFAULT_SETUP_FEE = 50.00;
const BASE_LEAD_TIME = 14;

function getDiscountTier(quantity: number): DiscountTier {
  for (let i = DISCOUNT_TIERS.length - 1; i >= 0; i--) {
    if (quantity >= DISCOUNT_TIERS[i].minQty) {
      return DISCOUNT_TIERS[i];
    }
  }
  return DISCOUNT_TIERS[0];
}

/**
 * Surface Area = 2 * (L*W + W*D + L*D)
 * Dimensions in mm, result in m²
 */
function calculateSurfaceArea(L: number, W: number, D: number): number {
  const areaMmSq = 2 * (L * W + W * D + L * D);
  return areaMmSq / 1_000_000;
}

function estimateDeliveryDays(quantity: number): number {
  if (quantity < 50) return BASE_LEAD_TIME;
  if (quantity < 100) return BASE_LEAD_TIME + 3;
  if (quantity < 500) return BASE_LEAD_TIME + 7;
  return BASE_LEAD_TIME + 14;
}

export function calculatePackagingPrice(input: PricingInput): PricingResult {
  const { length, width, depth, materialCostPerSqM, quantity, printType, setupFee } = input;

  const surfaceAreaSqM = calculateSurfaceArea(length, width, depth);
  const baseMaterialCost = surfaceAreaSqM * materialCostPerSqM;
  const printSurcharge = PRINT_SURCHARGE[printType] * surfaceAreaSqM;
  const effectiveSetupFee = setupFee ?? DEFAULT_SETUP_FEE;
  const setupFeePerUnit = effectiveSetupFee / Math.max(quantity, 1);

  const unitPriceBeforeDiscount = baseMaterialCost + printSurcharge + setupFeePerUnit;

  const discountTier = getDiscountTier(quantity);
  const discountPercentage = discountTier.percentage;
  const discountAmount = unitPriceBeforeDiscount * (discountPercentage / 100);
  const unitPrice = unitPriceBeforeDiscount - discountAmount;
  const subtotal = unitPrice * quantity;

  const carbonOffset = CARBON_OFFSET_PER_BOX * quantity;
  const estimatedDeliveryDays = estimateDeliveryDays(quantity);

  return {
    surfaceAreaSqM,
    baseMaterialCost,
    printSurcharge,
    setupFee: effectiveSetupFee,
    unitPriceBeforeDiscount,
    discountTier,
    discountPercentage,
    discountAmount,
    unitPrice,
    subtotal,
    carbonOffset,
    estimatedDeliveryDays,
  };
}

export function calculateCashback(orderSubtotal: number): number {
  return orderSubtotal * 0.05;
}

export function calculateSustainabilityImpact(totalBoxes: number) {
  return {
    carbonOffsetKg: totalBoxes * CARBON_OFFSET_PER_BOX,
    treesPlanted: Math.floor(totalBoxes / 100),
    recycledMaterialKg: totalBoxes * 0.05,
  };
}
