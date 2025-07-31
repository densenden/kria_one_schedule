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

    // Get stats using admin client
    const [
      { count: totalUsers },
      { count: totalCourses },
      { count: totalBookings },
      { data: revenue }
    ] = await Promise.all([
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('courses').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
      supabaseAdmin.from('bookings').select('amount').eq('status', 'confirmed')
    ])

    const totalRevenue = revenue?.reduce((sum, booking) => sum + (booking.amount || 0), 0) || 0

    // Get this month stats
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const [
      { count: thisMonthBookings },
      { data: thisMonthRevenue }
    ] = await Promise.all([
      supabaseAdmin
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'confirmed')
        .gte('created_at', startOfMonth.toISOString()),
      supabaseAdmin
        .from('bookings')
        .select('amount')
        .eq('status', 'confirmed')
        .gte('created_at', startOfMonth.toISOString())
    ])

    const thisMonthRevenueTotal = thisMonthRevenue?.reduce((sum, booking) => sum + (booking.amount || 0), 0) || 0

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalCourses: totalCourses || 0,
      totalBookings: totalBookings || 0,
      totalRevenue,
      thisMonthBookings: thisMonthBookings || 0,
      thisMonthRevenue: thisMonthRevenueTotal
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}