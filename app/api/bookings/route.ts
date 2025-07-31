import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { headers } from 'next/headers'

async function getUser(token: string) {
  const { data: { user }, error } = await supabase.auth.getUser(token)
  return { user, error }
}

export async function GET(request: Request) {
  try {
    const headersList = headers()
    const token = headersList.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { user, error: authError } = await getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        schedule:course_schedules!bookings_schedule_id_fkey(
          *,
          course:courses!course_schedules_course_id_fkey(
            *,
            instructor:profiles!courses_instructor_id_fkey(
              id,
              full_name,
              username
            )
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const token = headersList.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { user, error: authError } = await getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { scheduleId } = await request.json()

    // Check if user can book
    const { data: canBook } = await supabase
      .rpc('can_user_book_schedule' as any, {
        p_user_id: user.id,
        p_schedule_id: scheduleId
      })

    if (!canBook) {
      return NextResponse.json(
        { error: 'Cannot book this schedule. It may be full or you already have a booking.' },
        { status: 400 }
      )
    }

    // Forward to checkout creation
    const checkoutResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/create-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduleId,
        userId: user.id,
      }),
    })

    const checkoutData = await checkoutResponse.json()

    if (!checkoutResponse.ok) {
      return NextResponse.json(checkoutData, { status: checkoutResponse.status })
    }

    return NextResponse.json(checkoutData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}