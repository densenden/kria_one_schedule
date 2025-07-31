'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { useAuth } from '../../lib/contexts/AuthContext'
import toast from 'react-hot-toast'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Welcome back!')
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-ultramarine-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <p className="text-gray-600 mt-2">Sign in to your KRIA account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              className="w-full"
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-cyan-600 hover:text-cyan-500 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">Test credentials:</p>
              <p className="text-xs text-gray-600">
                Email: alice@example.com<br />
                Password: password123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}