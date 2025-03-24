import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PACKAGE_DETAILS } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY
// Always use production mode since we have production credentials
const CASHFREE_API_URL = 'https://api.cashfree.com/pg/orders'

export async function POST(req: NextRequest) {
  try {
    // Validate Cashfree credentials
    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      console.error('Missing Cashfree credentials')
      return NextResponse.json(
        { error: 'Payment gateway configuration error' },
        { status: 500 }
      )
    }

    // Parse and validate request body
    let body
    try {
      body = await req.json()
    } catch (e) {
      console.error('Invalid request body:', e)
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { name, email, ff_uid, ff_nickname, package_type } = body

    // Validate required fields
    if (!name || !email || !ff_uid || !ff_nickname || !package_type) {
      console.error('Missing required fields:', { name, email, ff_uid, ff_nickname, package_type })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate package type
    const selectedPackage = PACKAGE_DETAILS.find(pkg => pkg.id === package_type)
    if (!selectedPackage) {
      console.error('Invalid package type:', package_type)
      return NextResponse.json(
        { error: 'Invalid package type' },
        { status: 400 }
      )
    }

    const amount = selectedPackage.price
    const likes_count = selectedPackage.likes

    // Generate unique order ID
    const order_id = `FF${Date.now()}${Math.floor(Math.random() * 1000)}`

    console.log('Creating order in Supabase:', {
      order_id,
      name,
      email,
      ff_uid,
      ff_nickname,
      package_type: selectedPackage.id,
      amount,
      likes_count
    })

    // Create order in Supabase
    const { data: orderData, error: dbError } = await supabase
      .from('orders')
      .insert({
        order_id,
        name,
        email,
        ff_uid,
        ff_nickname,
        package_type: selectedPackage.id,
        amount,
        likes_count,
        status: 'pending',
        progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to create order in database' },
        { status: 500 }
      )
    }

    // Create order in Cashfree
    const cashfreeOrder = {
      order_id,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: ff_uid,
        customer_name: name,
        customer_email: email,
        customer_phone: '9999999999'
      },
      order_meta: {
        return_url: `${req.nextUrl.origin}/success?order_id=${order_id}`,
        notify_url: `${req.nextUrl.origin}/api/payment-webhook`
      }
    }

    console.log('Creating order in Cashfree:', cashfreeOrder)

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
      // Delete the order from Supabase since Cashfree order creation failed
      await supabase
        .from('orders')
        .delete()
        .eq('order_id', order_id)
      
      return NextResponse.json(
        { error: data.message || 'Failed to create payment' },
        { status: response.status }
      )
    }

    console.log('Order created successfully:', {
      order_id,
      payment_session_id: data.payment_session_id
    })

    return NextResponse.json({
      payment_session_id: data.payment_session_id,
      order_id
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    )
  }
} 