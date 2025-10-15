'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function AuthError() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'An authentication error occurred'

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-800 mb-2">Authentication Error</h1>
          <p className="text-red-600 mb-6">{message}</p>
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full">
                Return to Home
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" className="w-full">
                Try Again
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}