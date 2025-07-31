'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Calendar, 
  BookOpen, 
  User, 
  Users, 
  Menu, 
  X, 
  LogOut,
  Home,
  Settings
} from 'lucide-react'
import { Button } from './Button'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '../../lib/contexts/AuthContext'
import toast from 'react-hot-toast'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/courses', label: 'Courses', icon: BookOpen },
    { href: '/schedule', label: 'Schedule', icon: Calendar },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  if (!user) {
    return (
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            KRIA
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/courses">
              <Button variant="ghost">Browse Courses</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="primary">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              KRIA
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300'
                        : 'text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* User Menu */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  )}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {profile?.full_name || 'User'}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {profile?.username ? `@${profile.username}` : user.email}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="space-y-2">
                <div className="px-3 py-2 flex justify-center">
                  <ThemeToggle />
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300'
                          : 'text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  )
}