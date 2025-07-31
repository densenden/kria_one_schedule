import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

// For now, use anon key for server-side operations until service role key is set
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)