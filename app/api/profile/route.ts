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

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
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

    const updates = await request.json()

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}