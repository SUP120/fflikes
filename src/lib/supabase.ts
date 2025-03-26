import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type User = {
  id: string
  email: string
  created_at: string
}

export type AuthError = {
  message: string
}

export type PackageType = 'standard' | 'premium' | 'instant'

export type Package = {
  id: string
  name: string
  description: string
  price: number
  likes: number
  type: 'standard' | 'premium' | 'instant'
}

export const PACKAGE_DETAILS: Package[] = [
  {
    id: 'test',
    name: 'Test Package',
    description: 'Test package for 1 like',
    price: 1,
    likes: 1,
    type: 'instant',
  },
  {
    id: 'standard',
    name: 'Standard Package',
    description: '700 Likes for your Free Fire Profile',
    price: 500,
    likes: 700,
    type: 'standard',
  },
  {
    id: 'premium',
    name: 'Premium Package',
    description: '1500 Likes for your Free Fire Profile',
    price: 1000,
    likes: 1500,
    type: 'premium',
  },
] as const

export type Order = {
  order_id: string
  customer_name: string
  customer_email: string
  package_name: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  payment_status: 'success' | 'failed' | 'pending'
  created_at: string
  updated_at: string
}

// SQL queries to update orders table (run these in Supabase SQL editor):
/*
-- Add payment_status column
ALTER TABLE orders
ADD COLUMN payment_status text DEFAULT 'pending' NOT NULL;

-- Add progress column if not exists
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS progress integer DEFAULT 0 NOT NULL;

-- Add updated_at column if not exists
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Update existing orders to have default values
UPDATE orders
SET payment_status = 'pending' WHERE payment_status IS NULL,
    progress = 0 WHERE progress IS NULL,
    updated_at = timezone('utc'::text, now()) WHERE updated_at IS NULL;
*/ 