'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSignUp } from '@clerk/nextjs'

type Step = 'details' | 'account' | 'branding' | 'complete'

interface FormData {
  // Step 1: Gym Details
  gymName: string
  slug: string
  email: string
  phone: string

  // Step 2: Owner Account (handled by Clerk)

  // Step 3: Branding
  primaryColor: string
  logoFile: File | null
}

export function OnboardingForm() {
  const router = useRouter()
  const { signUp, isLoaded: clerkLoaded } = useSignUp()

  const [step, setStep] = useState<Step>('details')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    gymName: '',
    slug: '',
    email: '',
    phone: '',
    primaryColor: '#0891b2',
    logoFile: null,
  })

  // Auto-generate slug from gym name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 30)
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate slug availability
    try {
      const response = await fetch(`/api/onboard/check-slug?slug=${formData.slug}`)
      const data = await response.json()

      if (!data.available) {
        setError('This URL is already taken. Please choose another.')
        return
      }

      setStep('account')
    } catch {
      setError('Failed to check availability. Please try again.')
    }
  }

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('branding')
  }

  const handleBrandingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Create tenant
      const response = await fetch('/api/onboard/create-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.gymName,
          slug: formData.slug,
          email: formData.email,
          phone: formData.phone,
          primary_color: formData.primaryColor,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create community')
      }

      const { tenant } = await response.json()

      // Upload logo if provided
      if (formData.logoFile) {
        const logoFormData = new FormData()
        logoFormData.append('file', formData.logoFile)
        logoFormData.append('tenantId', tenant.id)

        await fetch('/api/onboard/upload-logo', {
          method: 'POST',
          body: logoFormData,
        })
      }

      setStep('complete')

      // Redirect to admin after short delay
      setTimeout(() => {
        router.push(`/admin?tenant=${formData.slug}`)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  // Step indicators
  const steps = [
    { id: 'details', label: 'Community Details', number: 1 },
    { id: 'account', label: 'Your Account', number: 2 },
    { id: 'branding', label: 'Branding', number: 3 },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  return (
    <div>
      {/* Progress Steps */}
      {step !== 'complete' && (
        <div className="flex justify-between mb-8">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStepIndex
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s.number}
              </div>
              <span
                className={`ml-2 text-sm ${
                  index <= currentStepIndex ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {s.label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-4 ${
                    index < currentStepIndex ? 'bg-cyan-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Step 1: Community Details */}
      {step === 'details' && (
        <form onSubmit={handleDetailsSubmit} className="space-y-6">
          <div>
            <label htmlFor="gymName" className="block text-sm font-medium text-gray-700 mb-1">
              Community Name
            </label>
            <input
              type="text"
              id="gymName"
              value={formData.gymName}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  gymName: e.target.value,
                  slug: generateSlug(e.target.value),
                })
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="e.g., KRIA Training"
              required
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Your URL
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 text-sm">https://</span>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent mx-1"
                placeholder="kria-training"
                pattern="[a-z0-9-]+"
                required
              />
              <span className="text-gray-500 text-sm">.sportsplatform.com</span>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="info@your-gym.com"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (optional)
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="+49 123 456789"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Continue
          </button>
        </form>
      )}

      {/* Step 2: Account */}
      {step === 'account' && (
        <form onSubmit={handleAccountSubmit} className="space-y-6">
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Create your owner account or sign in to continue.
            </p>
            {/* Clerk SignUp component would go here */}
            <p className="text-sm text-gray-500">
              (Clerk authentication integration)
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep('details')}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Branding */}
      {step === 'branding' && (
        <form onSubmit={handleBrandingSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Color
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="w-16 h-16 rounded-lg border border-gray-300 cursor-pointer"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  pattern="^#[0-9A-Fa-f]{6}$"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This will be your brand color throughout the platform.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo (optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setFormData({ ...formData, logoFile: file })
                  }
                }}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="cursor-pointer text-cyan-600 hover:text-cyan-700"
              >
                {formData.logoFile ? (
                  <span>{formData.logoFile.name}</span>
                ) : (
                  <span>Click to upload your logo</span>
                )}
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Square image, at least 256x256px
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep('account')}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Community'}
            </button>
          </div>
        </form>
      )}

      {/* Step 4: Complete */}
      {step === 'complete' && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Community is Ready!
          </h2>
          <p className="text-gray-600 mb-6">
            Redirecting you to your admin dashboard...
          </p>
          <div className="animate-spin w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full mx-auto" />
        </div>
      )}
    </div>
  )
}
