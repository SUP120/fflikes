import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PACKAGE_DETAILS, PackageType } from '@/lib/supabase'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface OrderRequest {
  name: string
  email: string
  ff_uid: string
  ff_nickname: string
  package_type: PackageType
}

export async function POST(request: Request) {
  try {
    // Log all environment variables (except their values)
    console.log('Available environment variables:', {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      CASHFREE_APP_ID: !!process.env.CASHFREE_APP_ID,
      CASHFREE_SECRET_KEY: !!process.env.CASHFREE_SECRET_KEY,
      CASHFREE_WEBHOOK_URL: !!process.env.CASHFREE_WEBHOOK_URL
    })

    // Validate environment variables
    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
      console.error('Missing Cashfree credentials:', {
        hasAppId: !!process.env.CASHFREE_APP_ID,
        hasSecretKey: !!process.env.CASHFREE_SECRET_KEY
      })
      return NextResponse.json(
        { error: 'Payment gateway configuration error' },
        { status: 500 }
      )
    }

    const body = await request.json()
    console.log('Received order request:', {
      ...body,
      email: '***@***.com' // Hide email for privacy
    })

    const { name, email, ff_uid, ff_nickname, package_type } = body as OrderRequest

    // Type guard for package_type
    if (!isValidPackageType(package_type)) {
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

    const origin = request.headers.get('origin') || 'https://fflikes-seven.vercel.app'
    // Ensure HTTPS is used
    const returnUrl = origin.startsWith('http://') 
      ? origin.replace('http://', 'https://') 
      : origin
    const webhookUrl = process.env.CASHFREE_WEBHOOK_URL || `${returnUrl}/api/payment-webhook`

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
        return_url: `${returnUrl}/success?order_id=${orderId}`,
        notify_url: webhookUrl
      },
      order_tags: {
        type: package_type
      },
      order_expiry_time: expiryTime.toISOString()
    }

    console.log('Creating Cashfree order with payload:', {
      ...cashfreePayload,
      customer_details: {
        ...cashfreePayload.customer_details,
        customer_email: '***@***.com' // Hide email for privacy
      }
    })

    console.log('Using Cashfree credentials:', {
      appId: process.env.CASHFREE_APP_ID,
      secretKeyLength: process.env.CASHFREE_SECRET_KEY?.length,
      webhookUrl
    })

    const response = await fetch(
      'https://api.cashfree.com/pg/orders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.CASHFREE_APP_ID,
          'x-client-secret': process.env.CASHFREE_SECRET_KEY,
          'x-api-version': '2022-09-01'
        },
        body: JSON.stringify(cashfreePayload)
      }
    )

    const cashfreeData = await response.json()
    console.log('Cashfree response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers),
      data: cashfreeData
    })

    if (!response.ok) {
      console.error('Cashfree error:', {
        status: response.status,
        statusText: response.statusText,
        data: cashfreeData
      })
      
      // Delete the order from database if Cashfree order creation fails
      await supabase
        .from('orders')
        .delete()
        .eq('order_id', orderId)

      return NextResponse.json(
        { error: cashfreeData.message || 'Failed to create payment' },
        { status: response.status }
      )
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

// Type guard function
function isValidPackageType(value: unknown): value is PackageType {
  return typeof value === 'string' && value in PACKAGE_DETAILS
} 