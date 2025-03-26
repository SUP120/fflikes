'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { Order } from '@/lib/supabase'

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProgress = async (orderId: string, newProgress: number) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          progress: newProgress,
          status: newProgress === 100 ? 'completed' : 'processing'
        })
        .eq('order_id', orderId)

      if (error) throw error

      // Update local state
      setOrders(orders.map(order => 
        order.order_id === orderId 
          ? { ...order, progress: newProgress, status: newProgress === 100 ? 'completed' : 'processing' }
          : order
      ))

      toast.success('Order progress updated successfully')
    } catch (err) {
      toast.error('Failed to update order progress')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl mb-4">Error loading orders</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="mt-8">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="pb-4">Order ID</th>
              <th className="pb-4">Customer</th>
              <th className="pb-4">Package</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Progress</th>
              <th className="pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id} className="border-b border-gray-800">
                <td className="py-4">{order.order_id}</td>
                <td className="py-4">{order.customer_name}</td>
                <td className="py-4">{order.package_name}</td>
                <td className="py-4">₹{order.amount}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${order.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400">{order.progress || 0}%</span>
                  </div>
                </td>
                <td className="py-4">
                  <button
                    onClick={() => {
                      setSelectedOrder(order)
                      setProgress(order.progress || 0)
                    }}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Update Progress
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Progress Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Update Order Progress</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Progress (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>0%</span>
                  <span>{progress}%</span>
                  <span>100%</span>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleUpdateProgress(selectedOrder.order_id, progress)
                    setSelectedOrder(null)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrdersPage 