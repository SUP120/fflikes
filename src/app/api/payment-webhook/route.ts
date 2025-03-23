import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    console.log('Received webhook payload:', payload)

    // Verify webhook signature
    const signature = request.headers.get('x-webhook-signature')
    if (!signature) {
      console.error('Missing webhook signature')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify webhook signature
    const data = JSON.stringify(payload)
    const expectedSignature = crypto
      .createHmac('sha256', process.env.CASHFREE_SECRET_KEY!)
      .update(data)
      .digest('hex')

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const orderId = payload.order_id
    const paymentStatus = payload.payment_status?.toLowerCase()

    // Update order status in database
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: paymentStatus === 'paid' ? 'completed' : 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId)

    if (updateError) {
      console.error('Error updating order:', updateError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    console.log('Order updated successfully:', orderId)
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 