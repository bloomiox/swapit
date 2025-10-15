import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { OnboardingProvider } from '@/contexts/OnboardingContext'
import { ToastProvider } from '@/components/ui/Toast'

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
        <AuthProvider>
          <ThemeProvider>
            <OnboardingProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </OnboardingProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}