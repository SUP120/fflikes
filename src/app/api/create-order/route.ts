import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PACKAGE_DETAILS } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY
const CASHFREE_API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.cashfree.com/pg/orders'
  : 'https://sandbox.cashfree.com/pg/orders'

export async function POST(req: NextRequest) {
  try {
    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      throw new Error('Missing Cashfree credentials')
    }

    const body = await req.json()
    const { name, email, ff_uid, ff_nickname, package_type } = body

    // Validate required fields
    if (!name || !email || !ff_uid || !ff_nickname || !package_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate package type
    const selectedPackage = PACKAGE_DETAILS.find(pkg => pkg.id === package_type)
    if (!selectedPackage) {
      return NextResponse.json(
        { error: 'Invalid package type' },
        { status: 400 }
      )
    }

    const amount = selectedPackage.price
    const likes_count = selectedPackage.likes

    // Generate unique order ID
    const order_id = `FF${Date.now()}${Math.floor(Math.random() * 1000)}`

    // Create order in Supabase
    const { error: dbError } = await supabase
      .from('orders')
      .insert({
        order_id,
        name,
        email,
        ff_uid,
        ff_nickname,
        package_type,
        amount,
        likes_count,
        status: 'pending',
        progress: 0
      })

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to create order')
    }

    // Create order in Cashfree
    const cashfreeOrder = {
      order_id,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: ff_uid,
        customer_email: email,
        customer_phone: '9999999999' // Required by Cashfree but not collected
      },
      order_meta: {
        return_url: `${req.nextUrl.origin}/success?order_id=${order_id}`
      }
    }

    const response = await fetch(CASHFREE_API_URL, {
      method: 'POST',
      headers: {
        'x-api-version': '2022-09-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cashfreeOrder)
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Cashfree error:', data)
      throw new Error('Failed to create payment')
    }

    return NextResponse.json({
      payment_session_id: data.payment_session_id,
      order_id
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
} 