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

export const PACKAGE_DETAILS: Record<PackageType, Package> = {
  standard: {
    name: 'Standard Package',
    amount: 500,
    likes_count: 700,
    description: 'Get 700 likes on your Free Fire profile'
  },
  premium: {
    name: 'Premium Package',
    amount: 1000,
    likes_count: 1500,
    description: 'Get 1500 likes on your Free Fire profile'
  },
  instant: {
    name: 'Instant Package',
    amount: 50,
    likes_count: 19,
    description: 'Get 19 instant likes on your Free Fire profile'
  }
} as const

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