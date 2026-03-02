'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut
} from '@clerk/nextjs'
import { X, User, Calendar as CalendarIcon, LogOut } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  navItems: NavItem[]
}

export function MobileNav({ isOpen, onClose, navItems }: MobileNavProps) {
  const pathname = usePathname()
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on route change
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Handle click outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        aria-hidden="true"
      />

      {/* Slide-over Panel */}
      <div
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl animate-slide-in-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-auto">
          {/* Main Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium
                    transition-all duration-200
                    ${isActive
                      ? 'bg-tenant/10 text-tenant'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            {/* Authenticated User Links */}
            <SignedIn>
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
                <Link
                  href="/profile"
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium
                    transition-all duration-200
                    ${pathname === '/profile'
                      ? 'bg-tenant/10 text-tenant'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium
                    transition-all duration-200
                    ${pathname === '/dashboard'
                      ? 'bg-tenant/10 text-tenant'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <CalendarIcon className="h-5 w-5" />
                  <span>My Bookings</span>
                </Link>
              </div>
            </SignedIn>
          </nav>

          {/* Footer Actions */}
          <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="w-full btn-primary py-3 text-base"
                >
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <SignOutButton>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </SignOutButton>
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  )
}
