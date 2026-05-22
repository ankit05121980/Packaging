-- ============================================================================
-- PackCraft: Full Database Schema Migration
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE product_category AS ENUM ('mailer', 'shipping', 'rigid', 'bags');
CREATE TYPE material_type AS ENUM ('kraft', 'white', 'bleached');
CREATE TYPE finish_option AS ENUM ('matte', 'glossy', 'foil', 'spot_uv', 'embossed');
CREATE TYPE print_type AS ENUM ('unprinted', 'single_color', 'full_color');
CREATE TYPE order_status AS ENUM (
  'draft', 'pending_payment', 'paid', 'in_production',
  'printing', 'cutting', 'assembly', 'quality_check',
  'shipped', 'delivered', 'cancelled', 'refunded'
);
CREATE TYPE wallet_tx_type AS ENUM ('credit', 'debit');
CREATE TYPE brief_status AS ENUM (
  'submitted', 'under_review', 'quote_ready',
  'sample_in_production', 'approved', 'rejected', 'completed'
);
CREATE TYPE currency_code AS ENUM ('USD', 'EUR', 'GBP');

-- ============================================================================
-- USERS
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  company_id UUID,
  is_b2b BOOLEAN DEFAULT FALSE,
  wallet_balance NUMERIC(12,2) DEFAULT 0.00,
  preferred_currency currency_code DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COMPANIES (B2B)
-- ============================================================================

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  legal_name TEXT,
  vat_id TEXT,
  tax_id TEXT,
  industry TEXT,
  website TEXT,
  logo_url TEXT,
  discount_tier INTEGER DEFAULT 0 CHECK (discount_tier >= 0 AND discount_tier <= 5),
  discount_percentage NUMERIC(5,2) DEFAULT 0.00,
  billing_address JSONB DEFAULT '{}'::jsonb,
  shipping_address JSONB DEFAULT '{}'::jsonb,
  default_currency currency_code DEFAULT 'USD',
  payment_terms_days INTEGER DEFAULT 30,
  credit_limit NUMERIC(12,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ADD CONSTRAINT fk_users_company
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;

-- ============================================================================
-- PRODUCTS
-- ============================================================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category product_category NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  material_types material_type[] NOT NULL DEFAULT '{kraft}',
  minimum_order_quantity INTEGER NOT NULL DEFAULT 10,
  sample_price NUMERIC(10,2) DEFAULT 15.00,
  is_active BOOLEAN DEFAULT TRUE,
  hero_image_url TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  eco_certified BOOLEAN DEFAULT FALSE,
  lead_time_days INTEGER DEFAULT 14,
  setup_fee NUMERIC(10,2) DEFAULT 50.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PRODUCT VARIANTS
-- ============================================================================

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  min_length_mm NUMERIC(8,2) NOT NULL DEFAULT 50,
  max_length_mm NUMERIC(8,2) NOT NULL DEFAULT 600,
  min_width_mm NUMERIC(8,2) NOT NULL DEFAULT 50,
  max_width_mm NUMERIC(8,2) NOT NULL DEFAULT 600,
  min_depth_mm NUMERIC(8,2) NOT NULL DEFAULT 20,
  max_depth_mm NUMERIC(8,2) NOT NULL DEFAULT 300,
  preset_length_mm NUMERIC(8,2),
  preset_width_mm NUMERIC(8,2),
  preset_depth_mm NUMERIC(8,2),
  material_type material_type NOT NULL DEFAULT 'kraft',
  material_thickness_gsm INTEGER NOT NULL DEFAULT 300,
  material_cost_per_sqm NUMERIC(10,4) NOT NULL DEFAULT 2.50,
  finish_options finish_option[] DEFAULT '{matte}',
  weight_grams NUMERIC(8,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_variants_product ON product_variants(product_id);

-- ============================================================================
-- USER DESIGNS (3D Editor State)
-- ============================================================================

CREATE TABLE user_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  name TEXT DEFAULT 'Untitled Design',
  dimensions JSONB NOT NULL DEFAULT '{"length": 200, "width": 150, "depth": 100}'::jsonb,
  face_textures JSONB DEFAULT '{}'::jsonb,
  text_layers JSONB DEFAULT '[]'::jsonb,
  image_layers JSONB DEFAULT '[]'::jsonb,
  base_color TEXT DEFAULT '#D4A574',
  material material_type DEFAULT 'kraft',
  finish finish_option DEFAULT 'matte',
  print_type print_type DEFAULT 'unprinted',
  dieline_config JSONB DEFAULT '{}'::jsonb,
  thumbnail_url TEXT,
  is_draft BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_designs_user ON user_designs(user_id);

-- ============================================================================
-- ORDERS
-- ============================================================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  status order_status DEFAULT 'draft',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(12,2) DEFAULT 0.00,
  wallet_credits_applied NUMERIC(12,2) DEFAULT 0.00,
  tax_amount NUMERIC(12,2) DEFAULT 0.00,
  tax_rate NUMERIC(5,4) DEFAULT 0.00,
  carbon_offset_amount NUMERIC(10,2) DEFAULT 0.00,
  shipping_cost NUMERIC(10,2) DEFAULT 0.00,
  total NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  currency currency_code DEFAULT 'USD',
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  billing_address JSONB DEFAULT '{}'::jsonb,
  shipping_address JSONB DEFAULT '{}'::jsonb,
  tracking_number TEXT,
  tracking_url TEXT,
  production_stage TEXT,
  estimated_delivery DATE,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- ============================================================================
-- ORDER ITEMS
-- ============================================================================

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  design_id UUID REFERENCES user_designs(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  discount_percentage NUMERIC(5,2) DEFAULT 0.00,
  dimensions JSONB,
  material material_type,
  finish finish_option,
  print_type print_type DEFAULT 'unprinted',
  is_sample BOOLEAN DEFAULT FALSE,
  carbon_offset_per_unit NUMERIC(8,4) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================================================
-- WALLET TRANSACTIONS (Cashback Ledger)
-- ============================================================================

CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  type wallet_tx_type NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  balance_after NUMERIC(12,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wallet_tx_user ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_tx_order ON wallet_transactions(order_id);

-- ============================================================================
-- B2B BRIEFS (RFQ System)
-- ============================================================================

CREATE TABLE b2b_briefs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  brief_number TEXT UNIQUE NOT NULL,
  status brief_status DEFAULT 'submitted',
  target_categories product_category[] NOT NULL DEFAULT '{}',
  custom_sizing TEXT,
  annual_volume_estimate INTEGER,
  material_preferences material_type[] DEFAULT '{}',
  finish_preferences finish_option[] DEFAULT '{}',
  printing_requirements JSONB DEFAULT '{}'::jsonb,
  warehousing_needed BOOLEAN DEFAULT FALSE,
  split_shipment BOOLEAN DEFAULT FALSE,
  shipment_locations JSONB DEFAULT '[]'::jsonb,
  attachment_urls TEXT[] DEFAULT '{}',
  brand_guidelines_url TEXT,
  dieline_url TEXT,
  budget_range JSONB DEFAULT '{"min": 0, "max": 0, "currency": "USD"}'::jsonb,
  special_instructions TEXT,
  internal_notes TEXT,
  quoted_amount NUMERIC(12,2),
  quoted_at TIMESTAMPTZ,
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_b2b_briefs_user ON b2b_briefs(user_id);
CREATE INDEX idx_b2b_briefs_status ON b2b_briefs(status);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT USING (auth_id = auth.uid());
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE USING (auth_id = auth.uid());

CREATE POLICY "Company members can view company"
  ON companies FOR SELECT USING (
    id IN (SELECT company_id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Product variants are publicly readable"
  ON product_variants FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Users can manage own designs"
  ON user_designs FOR ALL USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id IN (
        SELECT id FROM users WHERE auth_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can view own wallet"
  ON wallet_transactions FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can manage own briefs"
  ON b2b_briefs FOR ALL USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- ============================================================================
-- TRIGGER: Auto-update updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_product_variants_updated_at BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_user_designs_updated_at BEFORE UPDATE ON user_designs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_b2b_briefs_updated_at BEFORE UPDATE ON b2b_briefs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- FUNCTION: Generate order number
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'PCK-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
    UPPER(SUBSTRING(gen_random_uuid()::text FROM 1 FOR 6));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_number BEFORE INSERT ON orders
  FOR EACH ROW WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- ============================================================================
-- FUNCTION: Generate brief number
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_brief_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.brief_number = 'RFQ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
    UPPER(SUBSTRING(gen_random_uuid()::text FROM 1 FOR 6));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_briefs_number BEFORE INSERT ON b2b_briefs
  FOR EACH ROW WHEN (NEW.brief_number IS NULL)
  EXECUTE FUNCTION generate_brief_number();

-- ============================================================================
-- SEED DATA: Products & Variants
-- ============================================================================

INSERT INTO products (slug, name, description, category, base_price, material_types, minimum_order_quantity, hero_image_url, features, eco_certified, lead_time_days, setup_fee) VALUES
  ('eco-mailer-box', 'Eco Mailer Box', 'Sustainable corrugated mailer box perfect for e-commerce shipping. Made from 100% recycled materials.', 'mailer', 0.85, '{kraft,white}', 10, '/images/products/eco-mailer.jpg', '{"100% Recyclable", "FSC Certified", "Custom Print Ready", "Easy Assembly"}', TRUE, 14, 50.00),
  ('premium-shipping-box', 'Premium Shipping Box', 'Heavy-duty shipping box with double-wall construction for maximum protection during transit.', 'shipping', 1.20, '{kraft,white,bleached}', 10, '/images/products/shipping-box.jpg', '{"Double Wall", "Impact Resistant", "Custom Sizes", "Stackable"}', TRUE, 12, 45.00),
  ('luxury-rigid-box', 'Luxury Rigid Box', 'Premium rigid box with magnetic closure, ideal for luxury products, electronics, and gift packaging.', 'rigid', 3.50, '{white,bleached}', 30, '/images/products/rigid-box.jpg', '{"Magnetic Closure", "Premium Feel", "Foil Stamping Ready", "Velvet Interior Option"}', FALSE, 21, 120.00),
  ('custom-paper-bag', 'Custom Paper Bag', 'Eco-friendly custom paper bags with twisted rope or ribbon handles for retail stores.', 'bags', 0.65, '{kraft,white}', 50, '/images/products/paper-bag.jpg', '{"Twisted Rope Handles", "Full Color Print", "Water-Based Inks", "Reinforced Bottom"}', TRUE, 10, 35.00),
  ('product-box', 'Product Box', 'Versatile product packaging box perfect for cosmetics, food, and consumer goods.', 'mailer', 0.95, '{kraft,white,bleached}', 20, '/images/products/product-box.jpg', '{"Tuck End Design", "Food Safe Option", "Custom Windows", "Embossing Ready"}', TRUE, 14, 55.00),
  ('poly-mailer', 'Poly Mailer Bag', 'Lightweight waterproof poly mailer for clothing and soft goods shipping.', 'bags', 0.35, '{white}', 100, '/images/products/poly-mailer.jpg', '{"Waterproof", "Tear Resistant", "Self-Seal Strip", "Lightweight"}', FALSE, 7, 25.00);

INSERT INTO product_variants (product_id, sku, name, min_length_mm, max_length_mm, min_width_mm, max_width_mm, min_depth_mm, max_depth_mm, preset_length_mm, preset_width_mm, preset_depth_mm, material_type, material_thickness_gsm, material_cost_per_sqm, finish_options) VALUES
  ((SELECT id FROM products WHERE slug='eco-mailer-box'), 'EMB-S-KR', 'Small Kraft Mailer', 100, 400, 80, 300, 30, 200, 200, 150, 80, 'kraft', 300, 2.20, '{matte,glossy}'),
  ((SELECT id FROM products WHERE slug='eco-mailer-box'), 'EMB-M-KR', 'Medium Kraft Mailer', 150, 500, 100, 400, 40, 250, 300, 220, 100, 'kraft', 350, 2.50, '{matte,glossy,foil}'),
  ((SELECT id FROM products WHERE slug='eco-mailer-box'), 'EMB-L-KR', 'Large Kraft Mailer', 200, 600, 150, 500, 50, 300, 400, 300, 150, 'kraft', 400, 2.80, '{matte,glossy,foil,spot_uv}'),
  ((SELECT id FROM products WHERE slug='eco-mailer-box'), 'EMB-S-WH', 'Small White Mailer', 100, 400, 80, 300, 30, 200, 200, 150, 80, 'white', 300, 2.60, '{matte,glossy,foil}'),
  ((SELECT id FROM products WHERE slug='eco-mailer-box'), 'EMB-M-WH', 'Medium White Mailer', 150, 500, 100, 400, 40, 250, 300, 220, 100, 'white', 350, 2.90, '{matte,glossy,foil,spot_uv}'),
  ((SELECT id FROM products WHERE slug='premium-shipping-box'), 'PSB-S-KR', 'Small Kraft Shipping', 150, 500, 100, 400, 50, 300, 250, 200, 100, 'kraft', 450, 3.00, '{matte}'),
  ((SELECT id FROM products WHERE slug='premium-shipping-box'), 'PSB-M-KR', 'Medium Kraft Shipping', 200, 600, 150, 500, 80, 400, 350, 280, 150, 'kraft', 500, 3.40, '{matte,glossy}'),
  ((SELECT id FROM products WHERE slug='premium-shipping-box'), 'PSB-L-WH', 'Large White Shipping', 250, 700, 200, 600, 100, 500, 450, 350, 200, 'white', 500, 3.80, '{matte,glossy,foil}'),
  ((SELECT id FROM products WHERE slug='luxury-rigid-box'), 'LRB-S-WH', 'Small White Rigid', 100, 300, 80, 250, 40, 150, 150, 120, 60, 'white', 1200, 8.50, '{matte,glossy,foil,spot_uv,embossed}'),
  ((SELECT id FROM products WHERE slug='luxury-rigid-box'), 'LRB-M-BL', 'Medium Bleached Rigid', 150, 400, 100, 350, 50, 200, 250, 180, 100, 'bleached', 1400, 10.20, '{matte,glossy,foil,spot_uv,embossed}'),
  ((SELECT id FROM products WHERE slug='custom-paper-bag'), 'CPB-S-KR', 'Small Kraft Bag', 100, 300, 60, 200, 30, 150, 180, 80, 60, 'kraft', 150, 1.80, '{matte,glossy}'),
  ((SELECT id FROM products WHERE slug='custom-paper-bag'), 'CPB-M-WH', 'Medium White Bag', 150, 400, 80, 300, 40, 200, 260, 120, 80, 'white', 170, 2.20, '{matte,glossy,foil}'),
  ((SELECT id FROM products WHERE slug='product-box'), 'PB-S-KR', 'Small Kraft Product Box', 80, 300, 60, 250, 30, 150, 150, 100, 50, 'kraft', 350, 2.40, '{matte,glossy}'),
  ((SELECT id FROM products WHERE slug='product-box'), 'PB-M-WH', 'Medium White Product Box', 100, 400, 80, 350, 40, 200, 220, 160, 80, 'white', 400, 2.80, '{matte,glossy,foil,spot_uv}'),
  ((SELECT id FROM products WHERE slug='poly-mailer'), 'PM-S-WH', 'Small White Poly Mailer', 150, 400, 100, 300, 0, 0, 250, 200, 0, 'white', 60, 0.80, '{matte,glossy}');
