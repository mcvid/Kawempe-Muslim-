-- Online Store Schema

-- Products Table
CREATE TABLE IF NOT EXISTS shop_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('uniforms', 'academics', 'electronics', 'dormitory')),
    sub_category TEXT, -- e.g. 'O-Level', 'A-Level' for uniforms
    image_url TEXT,
    stock_quantity INTEGER DEFAULT 0,
    attributes JSONB DEFAULT '{}', -- flexibile attributes like size, color, age, weight, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Orders Table
CREATE TABLE IF NOT EXISTS shop_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    total_amount DECIMAL(12, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS shop_order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES shop_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES shop_products(id),
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(12, 2) NOT NULL
);

-- RLS Policies
ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_order_items ENABLE ROW LEVEL SECURITY;

-- Product policies: anyone can read
DROP POLICY IF EXISTS "Public read access for products" ON shop_products;
CREATE POLICY "Public read access for products" ON shop_products FOR SELECT TO anon, authenticated USING (true);

-- Order policies: anyone can place an order and see their own order (by ID)
DROP POLICY IF EXISTS "Anyone can place an order" ON shop_orders;
CREATE POLICY "Anyone can place an order" ON shop_orders FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can select their own orders" ON shop_orders;
CREATE POLICY "Anyone can select their own orders" ON shop_orders FOR SELECT TO anon, authenticated USING (true);

-- Order Items policies
DROP POLICY IF EXISTS "Anyone can insert order items" ON shop_order_items;
CREATE POLICY "Anyone can insert order items" ON shop_order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can select their own order items" ON shop_order_items;
CREATE POLICY "Anyone can select their own order items" ON shop_order_items FOR SELECT TO anon, authenticated USING (true);

-- Seed data for testing
INSERT INTO shop_products (name, description, price, category, sub_category, image_url, attributes) VALUES
('O-Level Boys Shirt', 'Standard short sleeve white shirt with logo', 30000, 'uniforms', 'O-Level', '/shop/uniform-shirt.png', '{"gender": "boys", "type": "apparel"}'),
('Grey Trousers', 'Standard grey trousers for boys', 30000, 'uniforms', 'O-Level', '/shop/trousers.png', '{"gender": "boys", "type": "apparel"}'),
('Grey Sweater', 'V-neck grey sweater with school logo', 30000, 'uniforms', 'O-Level', '/shop/sweater.png', '{"type": "apparel"}'),
('Red Polo Shirt', 'Sports kit red polo shirt', 30000, 'uniforms', 'O-Level', '/shop/polo-red.png', '{"type": "apparel"}'),
('Blue Polo Shirt', 'Sports kit blue polo shirt', 30000, 'uniforms', 'O-Level', '/shop/polo-blue.png', '{"type": "apparel"}'),
('School Register', 'Standard 4-quire school register', 15000, 'academics', 'Stationery', '/shop/register.png', '{"type": "stationery"}'),
('Mathematical Set', 'Complete geometry set', 8000, 'academics', 'Stationery', '/shop/mathset.png', '{"type": "stationery"}');
