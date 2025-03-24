'use client'

import Link from 'next/link'
import { PACKAGE_DETAILS } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 overflow-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/80 to-gray-900"></div>
          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-blue-500/30 blur-xl"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  opacity: 0.2 + Math.random() * 0.3,
                  animation: `float ${Math.random() * 10 + 15}s infinite linear`,
                  animationDelay: `${Math.random() * 5}s`,
                  transform: `translateY(${scrollY * 0.2}px)`
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30">
                <span className="animate-pulse inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                <span className="text-blue-300 font-medium">Free Fire's #1 Likes Service</span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-8 leading-tight">
              <span className="animate-text bg-gradient-to-r from-blue-500 via-purple-400 to-blue-300 bg-clip-text text-transparent">Boost</span> Your Free Fire Profile
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Get instant likes on your Free Fire profile and stand out from the crowd with our premium service
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/buy"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
              >
                Get Started
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 backdrop-blur-sm border border-white/10"
              >
                View Pricing
              </Link>
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-3xl md:text-4xl font-bold text-white">25K+</div>
                <div className="text-gray-400 text-sm mt-1">Happy Users</div>
              </div>
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-3xl md:text-4xl font-bold text-white">10M+</div>
                <div className="text-gray-400 text-sm mt-1">Likes Delivered</div>
              </div>
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-3xl md:text-4xl font-bold text-white">99%</div>
                <div className="text-gray-400 text-sm mt-1">Success Rate</div>
              </div>
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-3xl md:text-4xl font-bold text-white">24/7</div>
                <div className="text-gray-400 text-sm mt-1">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        {/* Background decorations */}
        <div className="absolute left-0 top-1/4 w-64 h-64 bg-blue-600/20 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl opacity-20"></div>
        
        <div className="text-center mb-16 relative">
          <span className="inline-block px-3 py-1 bg-blue-900/50 rounded-full text-blue-300 text-sm font-medium mb-4">Premium Features</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Why Choose <span className="text-blue-500">FFLikes</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We provide the fastest and most reliable service for boosting your Free Fire profile
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-blue-500/10 rounded-xl w-16 h-16 flex items-center justify-center mb-6 text-blue-400 group-hover:bg-blue-500/20 transition-all duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">Instant Delivery</h3>
            <p className="text-gray-300">
              Our advanced system ensures your likes are delivered within minutes after payment confirmation
            </p>
          </div>

          <div className="group bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-green-500/10 rounded-xl w-16 h-16 flex items-center justify-center mb-6 text-green-400 group-hover:bg-green-500/20 transition-all duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">100% Safe & Secure</h3>
            <p className="text-gray-300">
              Your account is completely safe with our premium service - we use only legitimate methods
            </p>
          </div>

          <div className="group bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-purple-500/10 rounded-xl w-16 h-16 flex items-center justify-center mb-6 text-purple-400 group-hover:bg-purple-500/20 transition-all duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">Premium Support</h3>
            <p className="text-gray-300">
              Our dedicated team is available 24/7 to help you with any questions or issues you may have
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <div className="flex items-start">
              <div className="mr-6 bg-blue-500/20 rounded-lg p-3">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Fast Processing</h3>
                <p className="text-gray-300">
                  Our automated system processes your order immediately, with no delays or waiting periods
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <div className="flex items-start">
              <div className="mr-6 bg-green-500/20 rounded-lg p-3">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Secure Payment</h3>
                <p className="text-gray-300">
                  Industry-standard payment processing with Cashfree ensures your payment data is always protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        {/* Background decorations */}
        <div className="absolute left-1/4 bottom-0 w-72 h-72 bg-blue-600/30 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute right-1/4 top-0 w-80 h-80 bg-purple-600/30 rounded-full filter blur-3xl opacity-20"></div>
        
        <div className="text-center mb-16 relative">
          <span className="inline-block px-3 py-1 bg-blue-900/50 rounded-full text-blue-300 text-sm font-medium mb-4">Best Value</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Choose Your <span className="text-blue-500">Package</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select a package that suits your needs and get started in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {PACKAGE_DETAILS.map((pkg, index) => {
            const isPopular = index === 1; // Middle package is typically the most popular
            return (
              <div
                key={pkg.id}
                className={`relative group ${isPopular ? 'md:-mt-4 md:mb-4' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-5 inset-x-0 flex justify-center">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-sm font-bold py-1 px-4 rounded-full shadow-lg animate-pulse">
                      Most Popular
                    </span>
                  </div>
                )}
                <div 
                  className={`bg-gradient-to-b ${isPopular 
                    ? 'from-blue-900/40 to-blue-800/20 border-blue-500/50' 
                    : 'from-white/10 to-white/5 hover:border-blue-500/30'
                  } backdrop-blur-lg rounded-2xl p-8 border border-white/20 transition-all duration-500 h-full flex flex-col group-hover:transform group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-blue-900/20`}
                >
                  <div className="text-center mb-8">
                    <h3 className={`text-2xl font-bold ${isPopular ? 'text-blue-400' : 'text-white'} mb-2`}>
                      {pkg.name}
                    </h3>
                    <div className="flex items-center justify-center">
                      <span className="text-gray-400 text-lg line-through mr-2">
                        ₹{Math.round(pkg.price * 1.2)}
                      </span>
                      <span className="text-5xl font-bold text-white">
                        ₹{pkg.price}
                      </span>
                    </div>
                    <p className="text-gray-400 mt-2">One-time payment</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8 text-gray-100 flex-grow">
                    <li className="flex items-center">
                      <div className="bg-green-500/20 p-1 rounded-full mr-3">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-lg"><span className="font-bold text-white">{pkg.likes}</span> Likes</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-green-500/20 p-1 rounded-full mr-3">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{pkg.type === 'instant' ? 'Instant Delivery' : 'Delivery in 24h'}</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-green-500/20 p-1 rounded-full mr-3">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>100% Safe Process</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-green-500/20 p-1 rounded-full mr-3">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>24/7 Support</span>
                    </li>
                  </ul>
                  
                  <Link
                    href={`/buy?package=${pkg.id}`}
                    className={`block w-full px-6 py-3 text-center font-medium rounded-lg transition-all duration-300 ${
                      isPopular 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40' 
                        : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/10 hover:border-blue-500/30'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Money-back guarantee */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center py-2 px-4 rounded-full bg-green-500/10 border border-green-500/20">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-green-400 font-medium">100% Money-Back Guarantee</span>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div className="absolute left-0 top-1/3 w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl opacity-20"></div>
        
        <div className="text-center mb-16 relative">
          <span className="inline-block px-3 py-1 bg-blue-900/50 rounded-full text-blue-300 text-sm font-medium mb-4">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            What Our <span className="text-blue-500">Gamers</span> Say
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of satisfied Free Fire players who have boosted their profiles
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                R
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-white">Rahul S.</h4>
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              "The service was super fast! Got my 1500 likes within minutes of payment. Will definitely use again!"
            </p>
            <div className="text-sm text-blue-400">Verified Purchase</div>
          </div>
          
          <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-white">Ankit T.</h4>
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              "I was skeptical at first, but this service is legit! My Free Fire profile looks amazing now with all those likes."
            </p>
            <div className="text-sm text-blue-400">Verified Purchase</div>
          </div>
          
          <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                P
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-white">Priya M.</h4>
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              "Customer support was amazing when I had questions. The likes were delivered as promised. 5 stars!"
            </p>
            <div className="text-sm text-blue-400">Verified Purchase</div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-16">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <div className="absolute inset-0 bg-[url('/cta-pattern.jpg')] mix-blend-overlay opacity-10"></div>
          
          <div className="relative px-8 py-16 md:py-20 flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 max-w-3xl">
              Ready to Boost Your Free Fire Profile?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl">
              Join thousands of gamers who have already enhanced their profile with our premium likes service
            </p>
            <Link
              href="/buy"
              className="inline-flex items-center bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105"
            >
              Get Started Now
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/70 backdrop-blur-lg border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-16">
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">FF</span>
                </div>
                <h3 className="text-xl font-bold text-white">FF Paid Likes</h3>
              </div>
              <p className="text-gray-400 mb-6">
                We provide the best service for boosting your Free Fire profile with instant likes delivery. Our platform is secure, fast, and reliable.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-blue-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-blue-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-red-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-indigo-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.668-.069 4.948-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/buy" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    Buy Likes
                  </Link>
                </li>
                <li>
                  <Link href="/track" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    Track Order
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refunds" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Us
                  </Link>
                </li>
                <li className="flex items-center text-gray-400">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:support@FFLikes@gmail.com" className="hover:text-white transition-colors">
                    support@FFLikes@gmail.com
                  </a>
                </li>
                <li className="flex items-center text-gray-400">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>24/7 Customer Support</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} FFLikes. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Free Fire is a registered trademark. This site is not affiliated with Garena or Free Fire.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 