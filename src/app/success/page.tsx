'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'

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
          const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({ status: 'completed', updated_at: new Date().toISOString() })
            .eq('order_id', orderId)
            .select()
            .single()

          if (updateError) throw updateError

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
        console.error('Error verifying payment:', error)
        setStatus('error')
      }
    }

    verifyPayment()
  }, [orderId, retryCount])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl max-w-md w-full border border-white/20">
          <div className="flex flex-col items-center space-y-4">
            <Spinner className="w-12 h-12 text-blue-500" />
            <p className="text-white text-lg">Verifying your payment...</p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl max-w-md w-full border border-white/20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">
              Payment Verification Failed
            </h1>
            <p className="text-gray-300 mb-6">
              We couldn't verify your payment. If you believe this is an error, please contact support.
            </p>
            <div className="space-x-4">
              <Link
                href="/contact"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/buy"
                className="inline-block px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Try Again
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl max-w-md w-full border border-white/20">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-green-400">Your order has been confirmed</p>
          </div>

          <div className="bg-black/30 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Order Details</h2>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-400">Order ID:</span>
                <span className="text-white font-medium">{order?.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Package:</span>
                <span className="text-white font-medium">{order?.package_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="text-white font-medium">₹{order?.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Free Fire UID:</span>
                <span className="text-white font-medium">{order?.ff_uid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Nickname:</span>
                <span className="text-white font-medium">{order?.ff_nickname}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 mb-6">
            <p className="text-blue-300">
              Your likes will be delivered within {order?.package_type === 'instant' ? 'a few minutes' : '24 hours'}.
            </p>
          </div>

          <p className="text-gray-400 text-sm">
            Thank you for choosing FF Paid Likes!
          </p>

          <div className="mt-8 space-x-4">
            <Link
              href="/track"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Track Progress
            </Link>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 