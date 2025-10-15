import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'

export const metadata: Metadata = {
  title: 'SwapIt - Swap. Share. Sustain.',
  description: 'Join the circular economy! Exchange items you no longer need and discover amazing finds from your community.',
  keywords: ['swap', 'exchange', 'sustainable', 'circular economy', 'community', 'items'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}