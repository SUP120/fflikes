import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-black/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            FF Paid Likes
          </h1>
          <div className="space-x-4">
            <Link href="#features" className="btn-outline">
              Features
            </Link>
            <Link href="#pricing" className="btn-primary">
              View Plans
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Boost Your Free Fire Profile
            <span className="block mt-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              With Instant Likes
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Get authentic Free Fire profile likes instantly. Choose from our various packages and enhance your gaming profile today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link href="#pricing" className="btn-primary">
              View Packages
            </Link>
            <Link href="#features" className="btn-outline">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Instant Delivery',
                description: 'Get your likes delivered instantly after successful payment.',
                icon: '⚡'
              },
              {
                title: 'Secure Payment',
                description: 'Your transactions are protected with industry-standard security.',
                icon: '🔒'
              },
              {
                title: '24/7 Support',
                description: 'Our support team is always ready to help you.',
                icon: '💬'
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-xl bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all duration-200">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-black/30">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Choose Your Package</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-primary/50 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">Standard Package</h3>
              <div className="text-5xl font-bold mb-6">
                ₹500
                <span className="text-xl text-gray-400">/one-time</span>
              </div>
              <ul className="text-left space-y-4 mb-8">
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  700 Profile Likes
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  Instant Delivery
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  24/7 Support
                </li>
              </ul>
              <Link href="/buy?package=standard" className="btn-primary w-full">
                Buy Now
              </Link>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-primary/50 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">Premium Package</h3>
              <div className="text-5xl font-bold mb-6">
                ₹1000
                <span className="text-xl text-gray-400">/one-time</span>
              </div>
              <ul className="text-left space-y-4 mb-8">
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  1500 Profile Likes
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  Instant Delivery
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  Priority Support
                </li>
              </ul>
              <Link href="/buy?package=premium" className="btn-primary w-full">
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: '1. Choose Package',
                description: 'Select the package that best suits your needs.',
                icon: '🎯'
              },
              {
                title: '2. Enter Details',
                description: 'Provide your Free Fire UID and verify your profile.',
                icon: '📝'
              },
              {
                title: '3. Get Likes',
                description: 'After payment, receive your likes instantly.',
                icon: '✨'
              }
            ].map((step, index) => (
              <div key={index} className="p-6 rounded-xl bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all duration-200">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Need Help?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Contact our support team at{' '}
            <a href="mailto:support@FFLikes@gmail.com" className="text-primary hover:text-secondary">
              support@FFLikes@gmail.com
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-8 px-4">
        <div className="container mx-auto text-center text-gray-400">
          <p>© 2024 FF Paid Likes. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
} 