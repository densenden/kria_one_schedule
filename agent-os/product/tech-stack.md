# Tech Stack Documentation

## Architektur-Uebersicht

```
+-----------------------------------------------------------------------------------+
|                              CLIENT (Browser / Mobile)                             |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|                           EDGE LAYER (Vercel Edge)                                 |
|  +------------------+  +------------------+  +------------------+                  |
|  | Tenant Detection |  |   Rate Limiting  |  |  Edge Caching    |                 |
|  +------------------+  +------------------+  +------------------+                  |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|                           APPLICATION LAYER (Next.js)                              |
|  +------------------+  +------------------+  +------------------+                  |
|  | Server Components|  |   API Routes     |  |  Server Actions  |                 |
|  +------------------+  +------------------+  +------------------+                  |
+-----------------------------------------------------------------------------------+
                                        |
                    +-------------------+-------------------+
                    |                   |                   |
                    v                   v                   v
+------------------+   +------------------+   +------------------+
|      CLERK       |   |    SUPABASE      |   |     STRIPE       |
|  (Auth Provider) |   |   (Database)     |   |   (Payments)     |
+------------------+   +------------------+   +------------------+
```

---

## Core Technologies

### Framework: Next.js 14 (App Router)

**Warum Next.js?**
- Server Components fuer bessere Performance
- Built-in API Routes
- Vercel-optimiert fuer Edge Deployment
- React 18 Features (Suspense, Streaming)

**Konfiguration:**
```typescript
// next.config.js
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      { hostname: '*.supabase.co' },
      { hostname: 'img.clerk.com' },
    ],
  },
}
```

**Projekt-Struktur:**
```
app/
├── (public)/           # Oeffentliche Seiten (Landing, Courses, Schedule)
├── (auth)/             # Auth-Seiten (Sign-In, Sign-Up)
├── (dashboard)/        # Protected Member Routes
├── admin/              # Admin Panel (Coach/Admin only)
├── onboard/            # Gym Onboarding Flow
├── api/
│   └── webhooks/       # Clerk, Stripe Webhooks
├── layout.tsx          # Root Layout mit Providers
└── globals.css         # Global Styles + CSS Variables
```

---

### Styling: Tailwind CSS

**Warum Tailwind?**
- Utility-First fuer schnelle Entwicklung
- CSS Variables fuer Dynamic Theming
- Tree-shaking fuer kleine Bundles
- Konsistentes Design System

**Theme-Konfiguration:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        // ...
      },
    },
  },
}
```

**Dynamic Theming (per Tenant):**
```css
/* globals.css */
:root {
  --primary: #0891b2;           /* Default: Cyan */
  --primary-foreground: #ffffff;
  --background: #ffffff;
  --foreground: #0f172a;
  /* ... */
}

.dark {
  --background: #0f172a;
  --foreground: #f8fafc;
  /* ... */
}

/* Injected per tenant via Server Component */
[data-tenant="kria"] {
  --primary: #0891b2;
}
[data-tenant="gymx"] {
  --primary: #dc2626;
}
```

---

### UI Components: shadcn/ui

**Warum shadcn/ui?**
- Kopierbare Komponenten (kein Lock-in)
- Tailwind-basiert
- Accessible (Radix UI primitives)
- Leicht anpassbar

**Installierte Komponenten:**
```
components/ui/
├── button.tsx
├── card.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── form.tsx
├── input.tsx
├── calendar.tsx
├── select.tsx
├── sheet.tsx
├── table.tsx
├── tabs.tsx
├── toast.tsx
└── ...
```

**Verwendung:**
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CourseCard({ course }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Book Now</Button>
      </CardContent>
    </Card>
  )
}
```

---

## Authentication: Clerk

**Warum Clerk?**
- Multi-Tenant Support out-of-the-box
- Hosted UI Components
- Webhooks fuer User Sync
- Social Login, MFA, etc.

**Setup:**
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getTenantByHost } from '@/lib/tenant'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/schedule(.*)',
  '/courses(.*)',
  '/onboard(.*)',
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const tenant = await getTenantByHost(req.headers.get('host'))

  if (!tenant && !req.nextUrl.pathname.startsWith('/onboard')) {
    return NextResponse.redirect(new URL('/onboard', req.url))
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth()
    const role = sessionClaims?.metadata?.role
    if (!['coach', 'admin', 'owner'].includes(role)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
})
```

**User Sync Webhook:**
```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const payload = await req.json()
  const headers = {
    'svix-id': req.headers.get('svix-id'),
    'svix-timestamp': req.headers.get('svix-timestamp'),
    'svix-signature': req.headers.get('svix-signature'),
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
  const evt = wh.verify(JSON.stringify(payload), headers) as WebhookEvent

  if (evt.type === 'user.created') {
    const supabase = createClient()
    await supabase.from('users').insert({
      clerk_user_id: evt.data.id,
      email: evt.data.email_addresses[0]?.email_address,
      full_name: `${evt.data.first_name} ${evt.data.last_name}`,
      avatar_url: evt.data.image_url,
      tenant_id: evt.data.public_metadata?.tenant_id,
      role: evt.data.public_metadata?.role || 'member',
    })
  }

  return new Response('OK', { status: 200 })
}
```

---

## Database: Supabase (PostgreSQL)

**Warum Supabase?**
- PostgreSQL mit Row Level Security
- Real-time Subscriptions
- Storage fuer Dateien
- Generated Types

**Client Setup:**
```typescript
// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
```

**RLS Policies (Tenant Isolation):**
```sql
-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see courses from their tenant
CREATE POLICY "tenant_courses_select" ON courses
  FOR SELECT
  USING (tenant_id = (
    SELECT tenant_id FROM users
    WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- Policy: Only admins can insert/update courses
CREATE POLICY "admin_courses_insert" ON courses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE clerk_user_id = auth.jwt()->>'sub'
        AND tenant_id = courses.tenant_id
        AND role IN ('admin', 'owner')
    )
  );
```

**Type Generation:**
```bash
# Generate TypeScript types from database
npx supabase gen types typescript --project-id $PROJECT_ID > types/database.ts
```

---

## Payments: Stripe Connect

**Warum Stripe Connect?**
- Jedes Gym hat eigenes Stripe Account
- Platform Fee automatisch abgezogen
- Onboarding Flow included
- Compliance (PCI-DSS) gehandelt

**Connect Onboarding:**
```typescript
// lib/stripe/connect.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createConnectAccount(tenant: Tenant) {
  const account = await stripe.accounts.create({
    type: 'standard',
    country: 'DE',
    email: tenant.owner_email,
    metadata: { tenant_id: tenant.id },
  })

  return account
}

export async function createAccountLink(accountId: string, tenantSlug: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `https://${tenantSlug}.sportsplatform.com/admin/settings?stripe=refresh`,
    return_url: `https://${tenantSlug}.sportsplatform.com/admin/settings?stripe=success`,
    type: 'account_onboarding',
  })

  return accountLink.url
}
```

**Checkout mit Connect:**
```typescript
// lib/stripe/checkout.ts
export async function createCheckoutSession(
  tenant: Tenant,
  schedule: Schedule,
  user: User
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: schedule.course.currency,
          product_data: {
            name: schedule.course.title,
            description: `${formatDate(schedule.start_time)} - ${schedule.location}`,
          },
          unit_amount: schedule.course.price * 100, // Cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${baseUrl}/bookings?success=true`,
    cancel_url: `${baseUrl}/schedule?cancelled=true`,
    payment_intent_data: {
      application_fee_amount: Math.round(schedule.course.price * 100 * 0.05), // 5% Platform Fee
      transfer_data: {
        destination: tenant.stripe_account_id,
      },
    },
    metadata: {
      tenant_id: tenant.id,
      schedule_id: schedule.id,
      user_id: user.id,
    },
  })

  return session
}
```

**Webhook Handler:**
```typescript
// app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  const supabase = createClient()

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      await supabase.from('bookings').update({
        status: 'confirmed',
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
      }).eq('id', session.metadata.booking_id)
      break

    case 'payment_intent.payment_failed':
      // Handle failed payment
      break
  }

  return new Response('OK', { status: 200 })
}
```

---

## Email: Sendgrid

**Verwendung:**
- Buchungsbestaetigungen
- Erinnerungen
- Passwort-Reset (via Clerk)
- Admin Notifications

**Setup:**
```typescript
// lib/email/sendgrid.ts
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendBookingConfirmation(
  booking: Booking,
  tenant: Tenant
) {
  await sgMail.send({
    to: booking.user.email,
    from: {
      email: `noreply@${tenant.slug}.sportsplatform.com`,
      name: tenant.name,
    },
    templateId: 'd-booking-confirmation-template-id',
    dynamicTemplateData: {
      course_title: booking.schedule.course.title,
      date: formatDate(booking.schedule.start_time),
      location: booking.schedule.location,
      tenant_name: tenant.name,
      tenant_logo: tenant.logo_url,
    },
  })
}
```

---

## State Management

### Server State: TanStack Query

```typescript
// hooks/use-courses.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCourses, createCourse } from '@/lib/api/courses'

export function useCourses(tenantId: string) {
  return useQuery({
    queryKey: ['courses', tenantId],
    queryFn: () => getCourses(tenantId),
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCourse,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.tenantId] })
    },
  })
}
```

### Client State: Zustand (wenn noetig)

```typescript
// stores/booking-store.ts
import { create } from 'zustand'

interface BookingStore {
  selectedSchedule: Schedule | null
  setSelectedSchedule: (schedule: Schedule | null) => void
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useBookingStore = create<BookingStore>((set) => ({
  selectedSchedule: null,
  setSelectedSchedule: (schedule) => set({ selectedSchedule: schedule }),
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false, selectedSchedule: null }),
}))
```

---

## Testing

### Unit Tests: Vitest

```typescript
// __tests__/lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { formatPrice, getTenantFromHost } from '@/lib/utils'

describe('formatPrice', () => {
  it('formats EUR correctly', () => {
    expect(formatPrice(19.99, 'EUR')).toBe('19,99 EUR')
  })
})

describe('getTenantFromHost', () => {
  it('extracts subdomain', () => {
    expect(getTenantFromHost('kria.sportsplatform.com')).toBe('kria')
  })
})
```

### E2E Tests: Playwright

```typescript
// e2e/booking.spec.ts
import { test, expect } from '@playwright/test'

test('user can book a course', async ({ page }) => {
  await page.goto('https://kria.sportsplatform.com')
  await page.click('text=Schedule')
  await page.click('[data-testid="schedule-item"]')
  await page.click('text=Book Now')

  // Stripe Checkout redirect
  await expect(page).toHaveURL(/checkout.stripe.com/)
})
```

---

## Deployment: Vercel

**Konfiguration:**
```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

**Environment Variables:**
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Sendgrid
SENDGRID_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Development Workflow

### Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Production build
pnpm start                  # Start production server
pnpm lint                   # Run ESLint
pnpm type-check             # TypeScript check

# Database
pnpm db:generate            # Generate types from Supabase
pnpm db:migrate             # Run migrations
pnpm db:seed                # Seed development data
pnpm db:reset               # Reset and reseed

# Testing
pnpm test                   # Run unit tests
pnpm test:e2e               # Run E2E tests
pnpm test:coverage          # Generate coverage report
```

### Git Hooks (Husky)

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## Security Considerations

| Concern | Solution |
|---------|----------|
| **SQL Injection** | Parameterized queries via Supabase client |
| **XSS** | React auto-escaping, CSP headers |
| **CSRF** | Clerk session tokens, SameSite cookies |
| **Auth Bypass** | Clerk middleware, RLS policies |
| **Data Leakage** | Tenant isolation via RLS |
| **Secrets** | Environment variables, never committed |
| **Rate Limiting** | Vercel Edge, Clerk built-in |

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LCP** | < 2.5s | Vercel Analytics |
| **FID** | < 100ms | Vercel Analytics |
| **CLS** | < 0.1 | Vercel Analytics |
| **TTFB** | < 200ms | Vercel Analytics |
| **Bundle Size** | < 200kb JS | Webpack analyzer |
| **API Response** | < 500ms P95 | Custom logging |

---

> Dieses Dokument beschreibt den aktuellen Tech Stack. Updates bei Major-Versionsaenderungen erforderlich.
