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

export interface Order {
  id: string
  created_at: string
  order_id: string
  name: string
  email: string
  ff_uid: string
  ff_nickname: string
  package_type: string
  amount: number
  likes_count: number
  status: 'pending' | 'completed' | 'failed'
  progress: number
}

// SQL query to add progress column (run this in Supabase SQL editor):
/*
ALTER TABLE orders
ADD COLUMN progress integer DEFAULT 0 NOT NULL;
*/ 