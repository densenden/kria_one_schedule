import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from') || new Date().toISOString()
    const to = searchParams.get('to') || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    const courseId = searchParams.get('courseId')

    const { data, error } = await supabaseAdmin
      .rpc('get_upcoming_schedules', {
        from_date: from,
        to_date: to,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    let schedules = data || []
    
    if (courseId) {
      schedules = schedules.filter((s: any) => s.course_id === courseId)
    }

    return NextResponse.json({ schedules })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}