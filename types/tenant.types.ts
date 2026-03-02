import type { Tenant, User } from './database.types'

export interface TenantSettings {
  currency: string
  timezone: string
  booking_lead_time_hours: number
  cancellation_hours: number
  show_participant_count: boolean
  require_payment: boolean
}

export interface TenantBranding {
  primaryColor: string
  secondaryColor: string
  logoUrl: string | null
  faviconUrl: string | null
}

export interface TenantContext {
  tenant: Tenant | null
  isLoading: boolean
  error: string | null
}

export interface TenantWithSettings extends Tenant {
  parsedSettings: TenantSettings
}

export interface CurrentUser extends User {
  tenant: Tenant
  isAdmin: boolean
  isCoach: boolean
  isOwner: boolean
}

export interface TenantResolution {
  type: 'subdomain' | 'domain' | 'slug'
  value: string
  tenant: Tenant | null
}
