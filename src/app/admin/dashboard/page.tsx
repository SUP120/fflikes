'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Order = {
  id: string
  created_at: string
  customer_email: string
  ff_uid: string
  package_name: string
  amount: number
  status: string
  progress: number
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchOrders()
  }, [router])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (orderId: string, progress: number) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ progress })
        .eq('id', orderId)

      if (error) throw error
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, progress } : order
      ))
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const handleLogout = () => {
    Cookies.remove('admin_token')
    router.push('/admin/login')
  }

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter
    const matchesSearch = searchTerm === '' || 
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.ff_uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } transition-colors`}
              >
                All Orders
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg ${
                  filter === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } transition-colors`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg ${
                  filter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } transition-colors`}
              >
                Pending
              </button>
            </div>
            <input
              type="text"
              placeholder="Search by email, FF UID, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">FF UID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.customer_email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.ff_uid}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.package_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">₹{order.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'completed'
                            ? 'bg-green-900/50 text-green-400 border border-green-700'
                            : order.status === 'pending'
                            ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700'
                            : 'bg-red-900/50 text-red-400 border border-red-700'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 transition-all duration-300"
                              style={{ width: `${order.progress}%` }}
                            ></div>
                          </div>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={order.progress}
                            onChange={(e) => updateProgress(order.id, parseInt(e.target.value))}
                            className="w-16 px-2 py-1 bg-black/30 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 