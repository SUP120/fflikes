'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PACKAGE_DETAILS, PackageType } from '@/lib/supabase'

export default function BuyPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null)
  const router = useRouter()

  const handlePayment = async (packageType: PackageType) => {
    try {
      setLoading(true)
      setError(null)

      // Get form data
      const form = document.querySelector('form') as HTMLFormElement
      const formData = new FormData(form)
      
      // Create order
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          ff_uid: formData.get('ff_uid'),
          ff_nickname: formData.get('ff_nickname'),
          package_type: packageType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Load Cashfree SDK
      const script = document.createElement('script')
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
      script.onload = async () => {
        try {
          const cashfree = new (window as any).Cashfree({
            mode: 'production'
          })

          const paymentConfig = {
            paymentSessionId: data.payment_session_id,
            returnUrl: window.location.origin + `/success?order_id=${data.order_id}`,
            style: {
              backgroundColor: '#ffffff',
              color: '#11385b',
              theme: 'light',
              errorColor: '#ff0000',
              themeColor: '#0074D4'
            }
          }

          await cashfree.checkout(paymentConfig)
        } catch (err: any) {
          console.error('Payment error:', err)
          setError(err.message || 'Failed to initialize payment')
          setLoading(false)
        }
      }

      script.onerror = () => {
        setError('Failed to load payment gateway')
        setLoading(false)
      }

      document.body.appendChild(script)

    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Choose Your FF Likes Package
          </h1>
          <p className="text-xl text-gray-300">
            Select the perfect package to boost your Free Fire profile
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {Object.entries(PACKAGE_DETAILS).map(([type, details]) => (
            <div
              key={type}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${
                type === 'premium'
                  ? 'from-yellow-500 to-amber-700 border-2 border-yellow-400 shadow-yellow-400/20'
                  : type === 'standard'
                  ? 'from-blue-600 to-blue-800 border-2 border-blue-400 shadow-blue-400/20'
                  : 'from-purple-600 to-purple-800 border-2 border-purple-400 shadow-purple-400/20'
              } p-8 shadow-xl transform hover:scale-105 transition-all duration-300`}
            >
              {type === 'premium' && (
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                    BEST VALUE
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-4 capitalize">
                {type} Package
              </h3>
              <div className="text-5xl font-bold text-white mb-6">
                ₹{details.amount}
              </div>
              <ul className="space-y-3 mb-8 text-gray-100">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {details.likes_count} Likes
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {type === 'instant' ? 'Instant Delivery' : '24hr Delivery'}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Safe & Secure
                </li>
                {type === 'premium' && (
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Priority Support
                  </li>
                )}
              </ul>
              <button
                onClick={() => setSelectedPackage(type as PackageType)}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  type === 'premium'
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-black'
                    : 'bg-white hover:bg-gray-100 text-gray-900'
                }`}
              >
                Select Package
              </button>
            </div>
          ))}
        </div>

        {selectedPackage && (
          <div className="max-w-md mx-auto">
            <form className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Enter Your Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="ff_uid" className="block text-sm font-medium text-gray-700">
                    Free Fire UID
                  </label>
                  <input
                    type="text"
                    name="ff_uid"
                    id="ff_uid"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="ff_nickname" className="block text-sm font-medium text-gray-700">
                    Free Fire Nickname
                  </label>
                  <input
                    type="text"
                    name="ff_nickname"
                    id="ff_nickname"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Error
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handlePayment(selectedPackage)}
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white text-lg font-semibold ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    `Pay ₹${PACKAGE_DETAILS[selectedPackage].amount}`
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
} 