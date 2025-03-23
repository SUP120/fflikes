'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PACKAGE_DETAILS, PackageType } from '@/lib/supabase'

declare global {
  interface Window {
    Cashfree: any
  }
}

export default function BuyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ff_uid: '',
    ff_nickname: '',
    package_type: '' as PackageType,
    agree_terms: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Initialize Cashfree payment
      const cashfree = new window.Cashfree({ mode: "production" })
      await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        returnUrl: `${window.location.origin}/success?order_id=${data.order_id}`
      })
    } catch (error) {
      console.error('Payment error:', error)
      setError('Failed to process payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Choose Your Package</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Instant Package */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 transform hover:scale-105 transition-transform duration-200">
            <h2 className="text-2xl font-bold mb-4">{PACKAGE_DETAILS.instant.name}</h2>
            <div className="text-5xl font-bold mb-4">₹{PACKAGE_DETAILS.instant.amount}</div>
            <ul className="space-y-2 mb-6">
              <li>✨ {PACKAGE_DETAILS.instant.likes_count} Likes</li>
              <li>⚡ Instant Delivery</li>
              <li>🔒 Safe & Secure</li>
            </ul>
            <button
              onClick={() => setFormData(prev => ({ ...prev, package_type: 'instant' }))}
              className="w-full bg-white text-purple-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-200"
            >
              Select Package
            </button>
          </div>

          {/* Standard Package */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 transform hover:scale-105 transition-transform duration-200">
            <h2 className="text-2xl font-bold mb-4">{PACKAGE_DETAILS.standard.name}</h2>
            <div className="text-5xl font-bold mb-4">₹{PACKAGE_DETAILS.standard.amount}</div>
            <ul className="space-y-2 mb-6">
              <li>✨ {PACKAGE_DETAILS.standard.likes_count} Likes</li>
              <li>⚡ 24hr Delivery</li>
              <li>🔒 Safe & Secure</li>
            </ul>
            <button
              onClick={() => setFormData(prev => ({ ...prev, package_type: 'standard' }))}
              className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-200"
            >
              Select Package
            </button>
          </div>

          {/* Premium Package */}
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl p-6 transform hover:scale-105 transition-transform duration-200">
            <h2 className="text-2xl font-bold mb-4">{PACKAGE_DETAILS.premium.name}</h2>
            <div className="text-5xl font-bold mb-4">₹{PACKAGE_DETAILS.premium.amount}</div>
            <ul className="space-y-2 mb-6">
              <li>✨ {PACKAGE_DETAILS.premium.likes_count} Likes</li>
              <li>⚡ 24hr Delivery</li>
              <li>🔒 Safe & Secure</li>
              <li>👑 Priority Support</li>
            </ul>
            <button
              onClick={() => setFormData(prev => ({ ...prev, package_type: 'premium' }))}
              className="w-full bg-white text-yellow-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-200"
            >
              Select Package
            </button>
          </div>
        </div>

        {formData.package_type && (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white/10 backdrop-blur-lg p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Enter Your Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-600 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-600 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Free Fire UID</label>
                <input
                  type="text"
                  required
                  value={formData.ff_uid}
                  onChange={e => setFormData(prev => ({ ...prev, ff_uid: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-600 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Free Fire Nickname</label>
                <input
                  type="text"
                  required
                  value={formData.ff_nickname}
                  onChange={e => setFormData(prev => ({ ...prev, ff_nickname: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-gray-600 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  required
                  checked={formData.agree_terms}
                  onChange={e => setFormData(prev => ({ ...prev, agree_terms: e.target.checked }))}
                  className="h-4 w-4 text-primary border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm">
                  I agree to the terms and conditions and understand that this service is used at my own risk
                </label>
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Pay ₹${PACKAGE_DETAILS[formData.package_type]?.amount || 0}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
} 