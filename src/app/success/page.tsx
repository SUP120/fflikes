'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Spinner } from '@/components/ui/spinner'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [retryCount, setRetryCount] = useState(0)
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (!orderId) {
      setStatus('error')
      return
    }

    const verifyPayment = async () => {
      try {
        // First check our database
        const { data: orderData, error: dbError } = await supabase
          .from('orders')
          .select('*')
          .eq('order_id', orderId)
          .single()

        if (dbError) throw dbError

        if (orderData.status === 'completed') {
          setOrder(orderData)
          setStatus('success')
          return
        }

        // If not completed, verify with Cashfree
        const response = await fetch(`/api/verify-payment?order_id=${orderId}`)
        const data = await response.json()

        if (data.order_status === 'PAID' || data.payment_status === 'SUCCESS') {
          // Update order in database
          const { data: updatedOrder } = await supabase
            .from('orders')
            .update({ status: 'completed', updated_at: new Date().toISOString() })
            .eq('order_id', orderId)
            .select()
            .single()

          setOrder(updatedOrder)
          setStatus('success')
        } else if (retryCount < 10) {
          // Retry after 3 seconds
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
          }, 3000)
        } else {
          setStatus('error')
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        if (retryCount < 10) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
          }, 3000)
        } else {
          setStatus('error')
        }
      }
    }

    verifyPayment()
  }, [orderId, retryCount])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Spinner className="w-8 h-8 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
        <p className="text-gray-600 text-center">
          Please wait while we verify your payment...
          <br />
          Attempt {retryCount + 1} of 10
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 p-6 rounded-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Payment Verification Failed</h1>
          <p className="text-gray-700 mb-4">
            We couldn't verify your payment at this moment. If you completed the payment, don't worry - 
            your order will be processed automatically.
          </p>
          <p className="text-sm text-gray-600">
            Order ID: {orderId}
            <br />
            Please contact support if you need assistance.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-green-100 p-6 rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-800 text-center mb-4">
          Payment Successful!
        </h1>
        <div className="bg-white p-4 rounded-lg mb-4">
          <h2 className="font-semibold mb-2">Order Details</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Order ID:</span> {order?.order_id}</p>
            <p><span className="font-medium">Package:</span> {order?.package_type}</p>
            <p><span className="font-medium">Amount:</span> ₹{order?.amount}</p>
            <p><span className="font-medium">Free Fire UID:</span> {order?.ff_uid}</p>
          </div>
        </div>
        <p className="text-center text-gray-700 text-sm">
          Your likes will be delivered within {order?.package_type === 'instant' ? 'a few minutes' : '24 hours'}.
          <br />
          Thank you for choosing FF Paid Likes!
        </p>
      </div>
    </div>
  )
} 