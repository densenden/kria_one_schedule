import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Check courses
    const { data: courses, error: coursesError } = await supabaseAdmin
      .from('courses')
      .select('*')
    
    // Check schedules directly
    const { data: schedules, error: schedulesError } = await supabaseAdmin
      .from('course_schedules')
      .select('*')
    
    // Check profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*')
    
    // Try the function
    const { data: functionData, error: functionError } = await supabaseAdmin
      .rpc('get_upcoming_schedules')
    
    return NextResponse.json({
      courses: {
        count: courses?.length || 0,
        data: courses,
        error: coursesError?.message
      },
      schedules: {
        count: schedules?.length || 0,
        data: schedules,
        error: schedulesError?.message
      },
      profiles: {
        count: profiles?.length || 0,
        data: profiles,
        error: profilesError?.message
      },
      function: {
        count: functionData?.length || 0,
        data: functionData,
        error: functionError?.message
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Debug failed', details: error }, { status: 500 })
  }
}