export type ProductCategory = 'mailer' | 'shipping' | 'rigid' | 'bags';
export type MaterialType = 'kraft' | 'white' | 'bleached';
export type FinishOption = 'matte' | 'glossy' | 'foil' | 'spot_uv' | 'embossed';
export type PrintType = 'unprinted' | 'single_color' | 'full_color';
export type OrderStatus =
  | 'draft'
  | 'pending_payment'
  | 'paid'
  | 'in_production'
  | 'printing'
  | 'cutting'
  | 'assembly'
  | 'quality_check'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';
export type WalletTxType = 'credit' | 'debit';
export type BriefStatus =
  | 'submitted'
  | 'under_review'
  | 'quote_ready'
  | 'sample_in_production'
  | 'approved'
  | 'rejected'
  | 'completed';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
}

export interface User {
  id: string;
  auth_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  company_id?: string;
  is_b2b: boolean;
  wallet_balance: number;
  preferred_currency: CurrencyCode;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  legal_name?: string;
  vat_id?: string;
  tax_id?: string;
  industry?: string;
  website?: string;
  logo_url?: string;
  discount_tier: number;
  discount_percentage: number;
  billing_address: Address;
  shipping_address: Address;
  default_currency: CurrencyCode;
  payment_terms_days: number;
  credit_limit: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category: ProductCategory;
  base_price: number;
  material_types: MaterialType[];
  minimum_order_quantity: number;
  sample_price: number;
  is_active: boolean;
  hero_image_url?: string;
  gallery_images: string[];
  features: string[];
  eco_certified: boolean;
  lead_time_days: number;
  setup_fee: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  name: string;
  min_length_mm: number;
  max_length_mm: number;
  min_width_mm: number;
  max_width_mm: number;
  min_depth_mm: number;
  max_depth_mm: number;
  preset_length_mm?: number;
  preset_width_mm?: number;
  preset_depth_mm?: number;
  material_type: MaterialType;
  material_thickness_gsm: number;
  material_cost_per_sqm: number;
  finish_options: FinishOption[];
  weight_grams?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BoxDimensions {
  length: number;
  width: number;
  depth: number;
}

export interface TextLayer {
  id: string;
  face: BoxFace;
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  x: number;
  y: number;
  rotation: number;
}

export interface ImageLayer {
  id: string;
  face: BoxFace;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
}

export type BoxFace = 'top' | 'bottom' | 'front' | 'back' | 'left' | 'right';

export interface UserDesign {
  id: string;
  user_id: string;
  product_id: string;
  variant_id?: string;
  name: string;
  dimensions: BoxDimensions;
  face_textures: Record<BoxFace, string>;
  text_layers: TextLayer[];
  image_layers: ImageLayer[];
  base_color: string;
  material: MaterialType;
  finish: FinishOption;
  print_type: PrintType;
  dieline_config: Record<string, unknown>;
  thumbnail_url?: string;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  company_id?: string;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  wallet_credits_applied: number;
  tax_amount: number;
  tax_rate: number;
  carbon_offset_amount: number;
  shipping_cost: number;
  total: number;
  currency: CurrencyCode;
  stripe_payment_intent_id?: string;
  stripe_invoice_id?: string;
  billing_address: Address;
  shipping_address: Address;
  tracking_number?: string;
  tracking_url?: string;
  production_stage?: string;
  estimated_delivery?: string;
  shipped_at?: string;
  delivered_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  design_id?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  discount_percentage: number;
  dimensions?: BoxDimensions;
  material?: MaterialType;
  finish?: FinishOption;
  print_type: PrintType;
  is_sample: boolean;
  carbon_offset_per_unit: number;
  created_at: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  order_id?: string;
  type: WalletTxType;
  amount: number;
  balance_after: number;
  description?: string;
  created_at: string;
}

export interface BudgetRange {
  min: number;
  max: number;
  currency: CurrencyCode;
}

export interface ShipmentLocation {
  address: Address;
  percentage: number;
  notes?: string;
}

export interface PrintingRequirements {
  inside_printing: boolean;
  hot_stamping: boolean;
  embossing: boolean;
  spot_uv: boolean;
  custom_notes?: string;
}

export interface B2BBrief {
  id: string;
  user_id: string;
  company_id?: string;
  brief_number: string;
  status: BriefStatus;
  target_categories: ProductCategory[];
  custom_sizing?: string;
  annual_volume_estimate?: number;
  material_preferences: MaterialType[];
  finish_preferences: FinishOption[];
  printing_requirements: PrintingRequirements;
  warehousing_needed: boolean;
  split_shipment: boolean;
  shipment_locations: ShipmentLocation[];
  attachment_urls: string[];
  brand_guidelines_url?: string;
  dieline_url?: string;
  budget_range: BudgetRange;
  special_instructions?: string;
  internal_notes?: string;
  quoted_amount?: number;
  quoted_at?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}
