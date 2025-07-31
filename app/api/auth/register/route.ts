import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: Request) {
  try {
    const { email, password, fullName, username } = await request.json()

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Update profile with username
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ username, full_name: fullName })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error('Profile update error:', profileError)
      }
    }

    return NextResponse.json({
      user: authData.user,
      session: authData.session,
      message: 'Registration successful! Please check your email to verify your account.',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}