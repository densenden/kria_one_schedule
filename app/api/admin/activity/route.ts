import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function GET() {
  try {
    // Create supabase client for user auth check
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role
    if (user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get recent activity
    const activities: any[] = []

    // Recent bookings
    const { data: recentBookings } = await supabaseAdmin
      .from('bookings')
      .select(`
        id,
        amount,
        created_at,
        profiles (full_name),
        course_schedules (
          courses (title)
        )
      `)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })
      .limit(10)

    if (recentBookings) {
      recentBookings.forEach(booking => {
        activities.push({
          id: `booking-${booking.id}`,
          type: 'booking',
          description: `${(booking.profiles as any)?.full_name || 'User'} booked ${(booking.course_schedules as any)?.courses?.title || 'a course'}`,
          timestamp: booking.created_at,
          amount: booking.amount
        })
      })
    }

    // Recent user registrations
    const { data: recentUsers } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    if (recentUsers) {
      recentUsers.forEach(user => {
        activities.push({
          id: `user-${user.id}`,
          type: 'user',
          description: `${user.full_name || 'New user'} joined KRIA`,
          timestamp: user.created_at
        })
      })
    }

    // Sort all activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({
      activities: activities.slice(0, 10)
    })
  } catch (error) {
    console.error('Admin activity error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}