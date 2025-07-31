import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    let query = supabaseAdmin
      .from('courses')
      .select(`
        *,
        instructor:profiles!courses_instructor_id_fkey(
          id,
          full_name,
          username,
          avatar_url
        )
      `)

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ courses: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}