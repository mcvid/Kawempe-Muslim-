-- HOTFIX: Remove the invalid check constraint that is causing order failures (Error 23514)
-- Run this ENTIRE file in your Supabase SQL Editor

-- 1. Drop the legacy/incorrect constraint on 'status'
-- The error specifically mentions "shop_orders_status_check1", so we drop that.
ALTER TABLE shop_orders DROP CONSTRAINT IF EXISTS shop_orders_status_check1;

-- 2. Drop the standard name just in case
ALTER TABLE shop_orders DROP CONSTRAINT IF EXISTS shop_orders_status_check;

-- 3. Add the CORRECT status constraint
-- Status should be: pending, processing, completed, cancelled
ALTER TABLE shop_orders ADD CONSTRAINT shop_orders_status_check 
    CHECK (status IN ('pending', 'processing', 'completed', 'cancelled'));

-- 4. Ensure payment_status constraint is also correct
ALTER TABLE shop_orders DROP CONSTRAINT IF EXISTS shop_orders_payment_status_check;
ALTER TABLE shop_orders ADD CONSTRAINT shop_orders_payment_status_check 
    CHECK (payment_status IN ('unpaid', 'paid'));

-- 5. Verify constraints (Select for confirmation output)
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'shop_orders'::regclass;
