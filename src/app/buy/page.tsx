'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PACKAGE_DETAILS, PackageType } from '@/lib/supabase'

export default function BuyPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
            mode: 'production' // use 'production' for live
          })

          const paymentConfig = {
            paymentSessionId: data.payment_session_id,
            returnUrl: window.location.origin + `/success?order_id=${data.order_id}`,
            style: {
              backgroundColor: '#ffffff',
              color: '#11385b',
              theme: 'light', // dark
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Buy FF Likes Package
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Fill in your details and choose a package
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
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

          <div className="space-y-4">
            {Object.entries(PACKAGE_DETAILS).map(([type, details]) => (
              <button
                key={type}
                type="button"
                onClick={() => handlePayment(type as PackageType)}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  'Processing...'
                ) : (
                  `Buy ${details.likes_count} Likes for ₹${details.amount}`
                )}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  )
} 