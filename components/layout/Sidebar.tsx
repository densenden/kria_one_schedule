'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react'
import { SignOutButton } from '@clerk/nextjs'
import { useTenant } from '@/contexts/TenantContext'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const adminNavItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin/schedules', label: 'Schedules', icon: Calendar },
  { href: '/admin/members', label: 'Members', icon: Users },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  defaultCollapsed?: boolean
}

export function Sidebar({ defaultCollapsed = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const pathname = usePathname()
  const { tenant } = useTenant()

  const logoUrl = tenant?.logo_url || '/assets/logos/KRIAWort-Bildmarke_unterzeile_indigo.svg'
  const tenantName = tenant?.name || 'Admin'

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full z-40
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/admin" className="flex items-center overflow-hidden">
            {isCollapsed ? (
              <div className="w-8 h-8 bg-tenant rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {tenantName.charAt(0).toUpperCase()}
                </span>
              </div>
            ) : (
              <Image
                src={logoUrl}
                alt={tenantName}
                width={120}
                height={32}
                className="w-auto h-8"
              />
            )}
          </Link>

          {/* Collapse Toggle - hidden on mobile */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {adminNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-tenant/10 text-tenant'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                  }
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-tenant' : ''}`} />
                {!isCollapsed && <span>{item.label}</span>}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer Section */}
        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
          {/* Back to Site */}
          <Link
            href="/"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800
              transition-colors mb-2
            `}
            title={isCollapsed ? 'Back to Site' : undefined}
          >
            <ChevronLeft className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Back to Site</span>}
          </Link>

          {/* Sign Out */}
          <SignOutButton>
            <button
              type="button"
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20
                hover:text-red-600 dark:hover:text-red-400 transition-colors
              `}
              title={isCollapsed ? 'Sign Out' : undefined}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </SignOutButton>
        </div>
      </div>
    </aside>
  )
}
