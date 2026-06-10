import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'

import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Web App Engineer Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AnalyticsTracker />
        {children}
        </body>
    </html>
  )
}

