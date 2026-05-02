import type { Metadata, Viewport } from 'next'
import { Noto_Serif_TC } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const notoSerifTC = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-serif-tc',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '靜途 — 溫柔陪伴，走完最後一程',
  description: '靜途是台灣首個數位化殯葬服務整合平台，提供家屬情境引導、方案比較、業者媒合與家庭共決空間，讓每一段告別都充滿尊嚴與溫度。',
  keywords: ['殯葬服務', '身後事', '告別式', '靈骨塔', '火化', '台灣', '靜途'],
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#f5f0eb',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW" className={`${notoSerifTC.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
