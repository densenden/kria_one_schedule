import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/onboard(.*)',
  '/schedule(.*)',
  '/courses(.*)',
  '/api/webhooks/(.*)',
])

// Routes that require admin/owner role
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims } = await auth()

  // Extract tenant from subdomain or custom domain
  const tenant = getTenantFromRequest(req)

  // Set tenant context in headers for downstream use
  const requestHeaders = new Headers(req.headers)
  if (tenant.slug) {
    requestHeaders.set('x-tenant-slug', tenant.slug)
  }
  if (tenant.domain) {
    requestHeaders.set('x-tenant-domain', tenant.domain)
  }

  // Protect non-public routes
  if (!isPublicRoute(req)) {
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Admin routes require admin/owner role
  if (isAdminRoute(req) && userId) {
    const userRole = sessionClaims?.metadata?.role as string | undefined
    if (!userRole || !['admin', 'owner', 'coach'].includes(userRole)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
})

// Extract tenant information from request
function getTenantFromRequest(req: NextRequest): {
  slug: string | null
  domain: string | null
  type: 'subdomain' | 'domain' | null
} {
  const host = req.headers.get('host') || ''

  // Check for custom domain (not a subdomain of the platform)
  const platformDomains = [
    'localhost',
    'localhost:3000',
    'sportsplatform.com',
    'vercel.app',
  ]

  const isCustomDomain = !platformDomains.some(
    (domain) => host === domain || host.endsWith(`.${domain}`)
  )

  if (isCustomDomain) {
    return {
      slug: null,
      domain: host,
      type: 'domain',
    }
  }

  // Extract subdomain
  const parts = host.split('.')
  if (parts.length >= 2 && !['www', 'app'].includes(parts[0])) {
    // Handle localhost:port case
    if (host.includes('localhost')) {
      // For local dev, use query param or cookie for tenant
      const tenantFromQuery = req.nextUrl.searchParams.get('tenant')
      return {
        slug: tenantFromQuery,
        domain: null,
        type: tenantFromQuery ? 'subdomain' : null,
      }
    }

    return {
      slug: parts[0],
      domain: null,
      type: 'subdomain',
    }
  }

  return {
    slug: null,
    domain: null,
    type: null,
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
