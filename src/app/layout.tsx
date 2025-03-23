import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'FF Paid Likes - Get Free Fire Profile Likes',
  description: 'Buy Free Fire Profile likes at the best prices. Instant delivery and secure transactions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        {children}
      </body>
    </html>
  )
} 