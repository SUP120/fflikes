'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function TrackProgress() {
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (error) throw error
      if (!data) {
        setError('Order not found. Please check the order ID and try again.')
        return
      }

      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
      setError('Failed to fetch order details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Track Your Progress</h1>
          <p className="text-gray-300">Enter your order ID to check the status of your likes</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-300 mb-2">
                Order ID
              </label>
              <input
                id="orderId"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your order ID"
                className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </div>
              ) : (
                'Check Progress'
              )}
            </button>
          </form>
        </div>

        {order && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Order Details</h3>
                <div className="mt-2 space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="text-lg font-medium text-white">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Package</p>
                    <p className="text-lg font-medium text-white">{order.package_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Amount</p>
                    <p className="text-lg font-medium text-white">₹{order.amount}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Progress Details</h3>
                <div className="mt-2 space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <span className={`inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full ${
                      order.status === 'completed'
                        ? 'bg-green-900/50 text-green-400 border border-green-700'
                        : order.status === 'pending'
                        ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700'
                        : 'bg-red-900/50 text-red-400 border border-red-700'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Progress</p>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-400 bg-blue-900/50 border border-blue-700">
                            {order.progress}% Complete
                          </span>
                        </div>
                      </div>
                      <div className="flex h-2 overflow-hidden bg-gray-700 rounded-full">
                        <div
                          style={{ width: `${order.progress}%` }}
                          className="flex flex-col justify-center overflow-hidden bg-blue-600 transition-all duration-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Order Date</p>
                    <p className="text-lg font-medium text-white">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {order.status === 'completed' && (
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mt-6">
                <p className="text-green-400">
                  Your order has been completed! All likes have been delivered to your account.
                </p>
              </div>
            )}

            {order.status === 'pending' && (
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mt-6">
                <p className="text-yellow-400">
                  Your order is being processed. We are currently delivering likes to your account.
                  Please check back later for updates.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 