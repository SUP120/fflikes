'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all')

  useEffect(() => {
    loadOrders()
  }, [filter])

  const loadOrders = async () => {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId)

      if (error) throw error
      loadOrders()
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-black/20 border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <button
              onClick={() => loadOrders()}
              className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-3 text-left">Order ID</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">FF UID</th>
                  <th className="px-6 py-3 text-left">Package</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-800 hover:bg-white/5">
                    <td className="px-6 py-4 font-mono text-sm">{order.order_id}</td>
                    <td className="px-6 py-4">{new Date(order.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div>{order.name}</div>
                      <div className="text-sm text-gray-400">{order.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{order.ff_uid}</div>
                      <div className="text-sm text-gray-400">{order.ff_nickname}</div>
                    </td>
                    <td className="px-6 py-4">{order.package_type}</td>
                    <td className="px-6 py-4">₹{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                        order.status === 'failed' ? 'bg-red-500/20 text-red-500' :
                        'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
                        className="bg-black/20 border border-gray-700 rounded-lg px-2 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
} 