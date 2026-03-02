import { createServiceClient } from '@/lib/supabase/server'
import type { User } from '@clerk/nextjs/server'

interface SyncUserParams {
  clerkUser: User
  tenantId: string
}

// Sync Clerk user to our database
export async function syncUserToDatabase({ clerkUser, tenantId }: SyncUserParams) {
  const supabase = createServiceClient()

  const userData = {
    id: clerkUser.id,
    tenant_id: tenantId,
    clerk_user_id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    full_name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
    avatar_url: clerkUser.imageUrl || null,
    phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
    last_login_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('users')
    .upsert(userData, {
      onConflict: 'clerk_user_id',
    })
    .select()
    .single()

  if (error) {
    console.error('Error syncing user:', error)
    throw error
  }

  return data
}

// Get user from database by Clerk ID
export async function getUserByClerkId(clerkUserId: string) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('users')
    .select('*, tenants(*)')
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return data
}

// Update user role
export async function updateUserRole(
  userId: string,
  role: 'member' | 'coach' | 'admin' | 'owner'
) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user role:', error)
    throw error
  }

  return data
}
