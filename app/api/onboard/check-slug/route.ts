import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  // Validate slug format
  const slugRegex = /^[a-z0-9-]+$/
  if (!slugRegex.test(slug)) {
    return NextResponse.json({
      available: false,
      message: 'Slug can only contain lowercase letters, numbers, and hyphens',
    })
  }

  // Reserved slugs
  const reservedSlugs = [
    'admin',
    'api',
    'app',
    'auth',
    'dashboard',
    'login',
    'onboard',
    'sign-in',
    'sign-up',
    'www',
  ]

  if (reservedSlugs.includes(slug)) {
    return NextResponse.json({
      available: false,
      message: 'This URL is reserved',
    })
  }

  const supabase = createServiceClient()

  const { data: existingTenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', slug)
    .single()

  return NextResponse.json({
    available: !existingTenant,
    message: existingTenant ? 'This URL is already taken' : null,
  })
}
