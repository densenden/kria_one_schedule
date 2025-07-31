'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-ultramarine-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Oops! Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            We're sorry, but something unexpected happened. Our team has been notified and is working to fix the issue.
          </p>
          
          {error && process.env.NODE_ENV === 'development' && (
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Error details (dev mode)
              </summary>
              <pre className="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded overflow-auto max-h-32">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              onClick={reset}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}