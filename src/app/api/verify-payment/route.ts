import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY
const CASHFREE_API_URL = 'https://api.cashfree.com/pg/orders'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('order_id')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // First check our database
    const { data: orderData, error: dbError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
    }

    // If order is already marked as completed, return success
    if (orderData.status === 'completed') {
      return NextResponse.json({
        order_status: 'PAID',
        payment_status: 'SUCCESS',
        order_details: orderData
      })
    }

    // Verify with Cashfree
    const response = await fetch(
      `${CASHFREE_API_URL}/${orderId}`,
      {
        headers: {
          'x-client-id': CASHFREE_APP_ID!,
          'x-client-secret': CASHFREE_SECRET_KEY!,
          'x-api-version': '2022-09-01'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch order status from Cashfree')
    }

    const data = await response.json()
    console.log('Cashfree order status:', data)

    // If payment is successful, update order in database
    if (data.order_status === 'PAID' || data.payment_status === 'SUCCESS') {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          progress: 'success',
          payment_status: data.payment_status,
          payment_details: data,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId)

      if (updateError) {
        console.error('Error updating order:', updateError)
        throw updateError
      }
    }

    return NextResponse.json({
      order_status: data.order_status,
      payment_status: data.payment_status,
      order_details: data
    })

  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment status' },
      { status: 500 }
    )
  }
} 