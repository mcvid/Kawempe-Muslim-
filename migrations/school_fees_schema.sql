-- School Fees System Database Schema (Refined for Self-Purchase Requirements)
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- FEE STRUCTURES TABLE
-- Stores fee amounts and requirement lists for each grade
-- =====================================================
DROP TABLE IF EXISTS fee_items CASCADE;
DROP TABLE IF EXISTS fee_addons CASCADE;
DROP TABLE IF EXISTS fee_structures CASCADE;

CREATE TABLE fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade TEXT NOT NULL, -- 'S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6'
    boarding_type TEXT NOT NULL, -- 'day', 'boarding'
    academic_year TEXT NOT NULL, -- e.g., '2026-2027'
    tuition BIGINT NOT NULL DEFAULT 0, -- Core tuition amount (UGX)
    functional_fees BIGINT NOT NULL DEFAULT 0, -- Library, ICT, PTA, Development
    requirements_list TEXT DEFAULT '', -- List of items students buy on their own (Separator: comma or newline)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(grade, boarding_type, academic_year)
);

-- Index for faster queries
CREATE INDEX idx_fee_structures_grade ON fee_structures(grade);
CREATE INDEX idx_fee_structures_active ON fee_structures(is_active);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read fee_structures" ON fee_structures FOR SELECT USING (true);

-- Authenticated users can manage
CREATE POLICY "Authenticated can manage fee_structures" ON fee_structures FOR ALL TO authenticated USING (true);

-- =====================================================
-- SEED DATA: Default fee structures for 2026-2027
-- =====================================================

-- Day Scholar fees
INSERT INTO fee_structures (grade, boarding_type, academic_year, tuition, functional_fees, requirements_list) VALUES
    ('S.1', 'day', '2026-2027', 450000, 150000, '2 Reams of Paper, 1 Scrubbing Brush, 2 Rolls of Toilet Paper, 1 Squeegee'),
    ('S.2', 'day', '2026-2027', 450000, 120000, '2 Reams of Paper, 1 Soft Broom, 2 Rolls of Toilet Paper'),
    ('S.3', 'day', '2026-2027', 480000, 130000, '2 Reams of Paper, 1 Hard Broom, 2 Rolls of Toilet Paper'),
    ('S.4', 'day', '2026-2027', 500000, 180000, '3 Reams of Paper, 1 Scrubbing Brush, 2 Rolls of Toilet Paper'),
    ('S.5', 'day', '2026-2027', 600000, 200000, '3 Reams (Graph & Plain), 1 Soft Broom, 4 Rolls of Toilet Paper'),
    ('S.6', 'day', '2026-2027', 650000, 220000, '3 Reams (Graph & Plain), 1 Scrubbing Brush, 4 Rolls of Toilet Paper');

-- Boarding fees
INSERT INTO fee_structures (grade, boarding_type, academic_year, tuition, functional_fees, requirements_list) VALUES
    ('S.1', 'boarding', '2026-2027', 950000, 150000, '2 Reams of Paper, 1 Scrubbing Brush, 2 Rolls of Toilet Paper, 1 Squeegee, 1 Basin'),
    ('S.2', 'boarding', '2026-2027', 950000, 120000, '2 Reams of Paper, 1 Soft Broom, 2 Rolls of Toilet Paper, 1 Jelly'),
    ('S.3', 'boarding', '2026-2027', 980000, 130000, '2 Reams of Paper, 1 Hard Broom, 2 Rolls of Toilet Paper'),
    ('S.4', 'boarding', '2026-2027', 1050000, 180000, '3 Reams of Paper, 1 Scrubbing Brush, 2 Rolls of Toilet Paper'),
    ('S.5', 'boarding', '2026-2027', 1200000, 200000, '3 Reams (Graph & Plain), 1 Soft Broom, 4 Rolls of Toilet Paper'),
    ('S.6', 'boarding', '2026-2027', 1300000, 220000, '3 Reams (Graph & Plain), 1 Scrubbing Brush, 4 Rolls of Toilet Paper');
