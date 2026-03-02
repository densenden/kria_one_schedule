import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    // For onboarding, we might not have a user yet
    // The user will be created after Clerk signup

    const body = await request.json()
    const { name, slug, email, phone, primary_color } = body

    // Validate required fields
    if (!name || !slug || !email) {
      return NextResponse.json(
        { error: 'Name, slug, and email are required' },
        { status: 400 }
      )
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Check if slug is taken
    const { data: existingTenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingTenant) {
      return NextResponse.json(
        { error: 'This URL is already taken' },
        { status: 409 }
      )
    }

    // Create tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        name,
        slug,
        email,
        phone: phone || null,
        primary_color: primary_color || '#0891b2',
      })
      .select()
      .single()

    if (tenantError) {
      console.error('Error creating tenant:', tenantError)
      return NextResponse.json(
        { error: 'Failed to create community' },
        { status: 500 }
      )
    }

    // If we have a Clerk user, create the owner user record
    if (userId) {
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          tenant_id: tenant.id,
          clerk_user_id: userId,
          email,
          role: 'owner',
        })

      if (userError) {
        console.error('Error creating owner user:', userError)
        // Don't fail the whole operation, user can be synced later
      }
    }

    return NextResponse.json({
      tenant,
      message: 'Community created successfully',
    })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
