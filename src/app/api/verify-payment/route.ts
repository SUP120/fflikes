import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('order_id')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // Verify with Cashfree
    const response = await fetch(
      `https://api.cashfree.com/pg/orders/${orderId}`,
      {
        headers: {
          'x-client-id': process.env.CASHFREE_APP_ID!,
          'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
          'x-api-version': '2022-09-01'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch order status from Cashfree')
    }

    const data = await response.json()
    console.log('Cashfree order status:', data)

    return NextResponse.json({
      order_status: data.order_status,
      payment_status: data.payment_status
    })

  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment status' },
      { status: 500 }
    )
  }
} 