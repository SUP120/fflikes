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

        if (dbError) {
          console.error('Database error:', dbError)
          throw dbError
        }

        // If we found the order, show it
        if (orderData) {
          setOrder(orderData)
          
          // If it's already marked as completed, we're done
          if (orderData.status === 'completed') {
            setStatus('success')
            return
          }
        }

        // Verify with Cashfree
        const response = await fetch(`/api/verify-payment?order_id=${orderId}`)
        if (!response.ok) {
          throw new Error('Failed to verify payment with Cashfree')
        }
        
        const data = await response.json()
        console.log('Cashfree verification response:', data)

        // Check various payment success conditions
        const isPaymentSuccessful = 
          data.order_status === 'PAID' || 
          data.payment_status === 'SUCCESS' ||
          data.order_status === 'ACTIVE' ||
          data.payment_status === 'COMPLETED'

        if (isPaymentSuccessful) {
          // Update order in database
          const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({ 
              status: 'completed', 
              updated_at: new Date().toISOString() 
            })
            .eq('order_id', orderId)
            .select()
            .single()

          if (updateError) {
            console.error('Error updating order:', updateError)
            throw updateError
          }

          setOrder(updatedOrder)
          setStatus('success')
        } else if (retryCount < 10) {
          // If payment is still processing, retry after 3 seconds
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
          }, 3000)
        } else {
          // After 10 retries (30 seconds), show error
          setStatus('error')
        }
      } catch (error) {
        console.error('Error verifying payment:', error)
        // If we have order data but verification failed, still show success
        if (order && order.status !== 'failed') {
          setStatus('success')
        } else {
          setStatus('error')
        }
      }
    }

    verifyPayment()
  }, [orderId, retryCount, order])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl max-w-md w-full border border-white/20">
          <div className="flex flex-col items-center space-y-4">
            <Spinner className="w-12 h-12 text-blue-500" />
            <p className="text-white text-lg">Verifying your payment...</p>
            <p className="text-gray-400 text-sm">Attempt {retryCount + 1} of 10</p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error' && !order) {
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

  // Show success page if we have order data, even if verification had issues
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