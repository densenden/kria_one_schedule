'use client'

import { useContext } from 'react'
import { TenantContext } from '@/contexts/TenantContext'
import type { Tenant } from '@/types/database.types'
import type { TenantSettings } from '@/types/tenant.types'

interface UseTenantReturn {
  tenant: Tenant | null
  isLoading: boolean
  error: string | null
  settings: TenantSettings
  primaryColor: string
  logoUrl: string | null
}

const defaultSettings: TenantSettings = {
  currency: 'EUR',
  timezone: 'Europe/Berlin',
  booking_lead_time_hours: 2,
  cancellation_hours: 24,
  show_participant_count: true,
  require_payment: true,
}

export function useTenant(): UseTenantReturn {
  const context = useContext(TenantContext)

  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }

  const { tenant, isLoading, error } = context

  const settings: TenantSettings = tenant?.settings
    ? { ...defaultSettings, ...(tenant.settings as Partial<TenantSettings>) }
    : defaultSettings

  return {
    tenant,
    isLoading,
    error,
    settings,
    primaryColor: tenant?.primary_color || '#0891b2',
    logoUrl: tenant?.logo_url || null,
  }
}
