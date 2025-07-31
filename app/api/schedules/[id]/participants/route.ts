import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const scheduleId = params.id

    const { data: participants, error } = await supabaseAdmin
      .from('course_participants')
      .select(`
        booking_id,
        is_visible,
        user:profiles!course_participants_user_id_fkey(
          id,
          username,
          full_name,
          avatar_url,
          is_public
        )
      `)
      .eq('schedule_id', scheduleId)
      .eq('is_visible', true)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Filter out participants with non-public profiles
    const publicParticipants = participants?.filter((p: any) => p.user?.is_public) || []

    return NextResponse.json({ participants: publicParticipants })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}