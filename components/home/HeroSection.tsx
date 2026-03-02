'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Tenant } from '@/types/database.types'

interface HeroSectionProps {
  tenant: Tenant | null
}

export function HeroSection({ tenant }: HeroSectionProps) {
  const tenantName = tenant?.name || 'Your Fitness Community'
  const tenantLogo = tenant?.logo_url

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-tenant/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-tenant/5 rounded-full blur-3xl" />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Logo */}
          {tenantLogo && (
            <div className="mb-8 animate-slide-up">
              <Image
                src={tenantLogo}
                alt={tenantName}
                width={180}
                height={180}
                className="mx-auto"
                priority
              />
            </div>
          )}

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Willkommen bei{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(135deg, var(--tenant-primary), var(--tenant-secondary, var(--tenant-primary)))'
              }}
            >
              {tenantName}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Entdecke unsere Kurse, buche flexibel online und werde Teil unserer aktiven Community.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/courses">
              <Button
                variant="primary"
                size="lg"
                className="group w-full sm:w-auto btn-primary"
              >
                Kurse entdecken
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/schedule">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto btn-outline"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Zum Stundenplan
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Einfache Online-Buchung</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Flexible Stornierung</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Sichere Zahlung</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
