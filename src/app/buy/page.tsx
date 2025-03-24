'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PACKAGE_DETAILS } from '@/lib/supabase'

declare global {
  interface Window {
    Cashfree: {
      new (config: { mode: 'production' | 'sandbox' }): {
        checkout: (config: {
          paymentSessionId: string;
          returnUrl: string;
        }) => Promise<void>;
      };
    };
  }
}

export default function BuyPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ff_uid: '',
    ff_nickname: '',
    package_type: ''
  })
  const router = useRouter()

  useEffect(() => {
    // Load Cashfree SDK
    const script = document.createElement('script')
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate package selection
      const selectedPackage = PACKAGE_DETAILS.find(pkg => pkg.id === formData.package_type)
      if (!selectedPackage) {
        throw new Error('Please select a package')
      }

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          package_type: selectedPackage.id
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Initialize Cashfree
      if (typeof window === 'undefined' || !window.Cashfree) {
        throw new Error('Payment gateway not loaded. Please try again.')
      }

      const cashfree = new window.Cashfree({
        mode: 'production'
      })

      // Redirect to Cashfree payment page
      await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        returnUrl: `${window.location.origin}/success?order_id=${data.order_id}`,
      })
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Package</h1>
          <p className="text-xl text-gray-300">Select a package that suits your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PACKAGE_DETAILS.map((details) => (
            <div
              key={details.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {details.name}
                </h3>
                <div className="text-5xl font-bold text-white mb-6">
                  ₹{details.price}
                </div>
                <ul className="space-y-3 mb-8 text-gray-100">
                  <li className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {details.likes} Likes
                  </li>
                  <li className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Instant Delivery
                  </li>
                  <li className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    24/7 Support
                  </li>
                </ul>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, package_type: details.id }))}
                  className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    formData.package_type === details.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Select Package
                </button>
              </div>
            </div>
          ))}
        </div>

        {formData.package_type && (
          <div className="mt-12 max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Enter Your Details</h2>
            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="ff_uid" className="block text-sm font-medium text-gray-300">
                  Free Fire UID
                </label>
                <input
                  type="text"
                  id="ff_uid"
                  name="ff_uid"
                  required
                  value={formData.ff_uid}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="ff_nickname" className="block text-sm font-medium text-gray-300">
                  Free Fire Nickname
                </label>
                <input
                  type="text"
                  id="ff_nickname"
                  name="ff_nickname"
                  required
                  value={formData.ff_nickname}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                }`}
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
} 