import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import type { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side Supabase client with service role (bypass RLS)
export function createServiceClient() {
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Server-side Supabase client with tenant context for RLS
export async function createServerClient(tenantId?: string) {
  const headersList = await headers()
  const tenantSlug = headersList.get('x-tenant-slug')

  const client = createClient<Database>(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          // Set tenant context for RLS policies
          'x-tenant-id': tenantId || '',
        },
      },
    }
  )

  // If we have a tenant slug but not ID, resolve it
  if (tenantSlug && !tenantId) {
    const { data: tenant } = await createServiceClient()
      .from('tenants')
      .select('id')
      .eq('slug', tenantSlug)
      .single()

    if (tenant) {
      // Set the tenant context for RLS
      await client.rpc('set_config', {
        setting: 'app.current_tenant_id',
        value: tenant.id,
      })
    }
  }

  return client
}

// Get tenant by slug
export async function getTenantBySlug(slug: string) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching tenant:', error)
    return null
  }

  return data
}

// Get tenant by custom domain
export async function getTenantByDomain(domain: string) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('domain', domain)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching tenant by domain:', error)
    return null
  }

  return data
}
