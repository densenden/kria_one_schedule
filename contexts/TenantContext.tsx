'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Tenant } from '@/types/database.types'
import type { TenantContext as TenantContextType, TenantSettings } from '@/types/tenant.types'

const TenantContext = createContext<TenantContextType | undefined>(undefined)

interface TenantProviderProps {
  children: ReactNode
  initialTenant?: Tenant | null
}

export function TenantProvider({ children, initialTenant = null }: TenantProviderProps) {
  const [tenant, setTenant] = useState<Tenant | null>(initialTenant)
  const [isLoading, setIsLoading] = useState(!initialTenant)
  const [error, setError] = useState<string | null>(null)

  // Apply tenant branding via CSS variables
  useEffect(() => {
    if (tenant) {
      document.documentElement.style.setProperty('--primary', tenant.primary_color)
      document.documentElement.style.setProperty('--secondary', tenant.secondary_color)

      // Update favicon if set
      if (tenant.favicon_url) {
        const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
        if (favicon) {
          favicon.href = tenant.favicon_url
        }
      }
    }
  }, [tenant])

  return (
    <TenantContext.Provider value={{ tenant, isLoading, error }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

// Parse tenant settings from JSON
export function parseTenantSettings(settings: unknown): TenantSettings {
  const defaults: TenantSettings = {
    currency: 'EUR',
    timezone: 'Europe/Berlin',
    booking_lead_time_hours: 2,
    cancellation_hours: 24,
    show_participant_count: true,
    require_payment: true,
  }

  if (!settings || typeof settings !== 'object') {
    return defaults
  }

  return { ...defaults, ...(settings as Partial<TenantSettings>) }
}
