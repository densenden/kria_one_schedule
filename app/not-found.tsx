'use client'

import Link from 'next/link'
import { Search, Home, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-ultramarine-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you might have entered the wrong URL.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                className="flex items-center gap-2 w-full"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Looking for something specific?
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/courses" className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">
                Browse Training Courses
              </Link>
              <Link href="/schedule" className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">
                View Training Schedule
              </Link>
              <Link href="/community" className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">
                Join the Community
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}