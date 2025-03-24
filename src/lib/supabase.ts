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

export interface Package {
  name: string
  amount: number
  likes_count: number
  description: string
}

export const PACKAGE_DETAILS = [
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
] as const;

export interface Order {
  id: string
  created_at: string
  updated_at: string
  order_id: string
  name: string
  email: string
  ff_uid: string
  ff_nickname: string
  package_type: PackageType
  amount: number
  likes_count: number
  status: 'pending' | 'completed' | 'failed'
}

// SQL query to add progress column (run this in Supabase SQL editor):
/*
ALTER TABLE orders
ADD COLUMN progress integer DEFAULT 0 NOT NULL;
*/ 