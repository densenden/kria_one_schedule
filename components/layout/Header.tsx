'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import {
  Home,
  Calendar,
  BookOpen,
  Menu,
  X
} from 'lucide-react'
import { useTenant } from '@/contexts/TenantContext'
import { MobileNav } from './MobileNav'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const publicNavItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/schedule', label: 'Schedule', icon: Calendar },
  { href: '/courses', label: 'Courses', icon: BookOpen },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { tenant, isLoading } = useTenant()

  const logoUrl = tenant?.logo_url || '/assets/logos/KRIAWort-Bildmarke_unterzeile_indigo.svg'
  const tenantName = tenant?.name || 'Sports Community'

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              {isLoading ? (
                <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ) : (
                <Image
                  src={logoUrl}
                  alt={tenantName}
                  width={120}
                  height={40}
                  className="w-auto h-8 sm:h-10"
                  priority
                />
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {publicNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-tenant/10 text-tenant'
                        : 'text-gray-600 dark:text-gray-300 hover:text-tenant hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Right Side: Auth Buttons */}
            <div className="flex items-center gap-3">
              {/* Desktop Auth */}
              <div className="hidden md:flex items-center gap-3">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="btn-outline text-sm">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-tenant transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-tenant transition-colors"
                  >
                    My Bookings
                  </Link>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: 'w-9 h-9',
                      },
                    }}
                  />
                </SignedIn>
              </div>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={publicNavItems}
      />
    </>
  )
}
