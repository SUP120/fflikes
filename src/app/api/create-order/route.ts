import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PACKAGE_DETAILS, PackageType } from '@/lib/supabase'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type OrderRequest = {
  name: string
  email: string
  ff_uid: string
  ff_nickname: string
  package_type: PackageType
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, ff_uid, ff_nickname, package_type } = body as OrderRequest

    // Validate package type
    if (!PACKAGE_DETAILS[package_type]) {
      return NextResponse.json({ error: 'Invalid package type' }, { status: 400 })
    }

    const amount = PACKAGE_DETAILS[package_type].amount
    const likes_count = PACKAGE_DETAILS[package_type].likes_count

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`

    // Create order in database
    const { error: dbError } = await supabase
      .from('orders')
      .insert({
        order_id: orderId,
        name,
        email,
        ff_uid,
        ff_nickname,
        package_type,
        amount,
        likes_count,
        status: 'pending'
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Calculate expiry time (30 minutes from now)
    const expiryTime = new Date()
    expiryTime.setMinutes(expiryTime.getMinutes() + 30)

    // Create order with Cashfree
    const cashfreePayload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: ff_uid,
        customer_name: name,
        customer_email: email,
        customer_phone: "9999999999"
      },
      order_meta: {
        return_url: `${request.headers.get('origin')}/success?order_id=${orderId}`,
        notify_url: process.env.CASHFREE_WEBHOOK_URL
      },
      order_tags: {
        type: package_type
      },
      order_expiry_time: expiryTime.toISOString()
    }

    console.log('Creating Cashfree order with payload:', cashfreePayload)

    const response = await fetch(
      'https://api.cashfree.com/pg/orders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.CASHFREE_APP_ID!,
          'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
          'x-api-version': '2022-09-01'
        },
        body: JSON.stringify(cashfreePayload)
      }
    )

    const cashfreeData = await response.json()
    console.log('Cashfree response:', cashfreeData)

    if (!response.ok) {
      console.error('Cashfree error:', cashfreeData)
      throw new Error(cashfreeData.message || 'Failed to create Cashfree order')
    }

    return NextResponse.json({
      order_id: cashfreeData.order_id,
      payment_session_id: cashfreeData.payment_session_id
    })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 