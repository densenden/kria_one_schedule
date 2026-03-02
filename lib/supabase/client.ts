import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client (for browser use)
export function createBrowserClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Singleton for client-side
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    throw new Error('getSupabaseClient should only be used on the client side')
  }

  if (!browserClient) {
    browserClient = createBrowserClient()
  }

  return browserClient
}
