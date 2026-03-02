# White-Label Sports Community Platform – Claude.md

## Project Overview

### Description

A scalable white-label SaaS platform for sports communities (gyms, coaches, studios). Each provider can run their own branded community with dedicated members, courses, and content. Multi-tenant architecture allows multiple gyms to operate independently within a single deployment.

### Key Goals

- Multi-tenant platform supporting unlimited gyms/studios
- White-label branding (colors, logo, custom domain)
- Course booking with Stripe Connect payments
- Member and coach management via Clerk
- CMS for customizable info pages
- Self-service gym onboarding

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), React Server Components |
| Styling | Tailwind CSS, CSS Variables for theming |
| Auth | Clerk (Multi-tenant user management) |
| Database | Supabase (PostgreSQL + RLS) |
| Payments | Stripe Connect |
| Email | Sendgrid |
| Storage | Supabase Storage |
| Hosting | Vercel |

---

## Project Structure

```
/kria-community
├── app/
│   ├── (public)/              # Public routes (landing, courses, schedule)
│   ├── (auth)/                # Clerk auth routes (sign-in, sign-up)
│   ├── (dashboard)/           # Protected member routes (profile, bookings)
│   ├── admin/                 # Admin routes (coach/admin only)
│   │   ├── courses/
│   │   ├── schedules/
│   │   ├── members/
│   │   ├── settings/
│   │   └── pages/             # CMS
│   ├── onboard/               # Gym onboarding flow
│   ├── api/
│   │   └── webhooks/          # Clerk & Stripe webhooks
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                    # Base UI components
│   ├── layout/                # Header, Footer, Sidebar
│   ├── forms/                 # Form components
│   ├── calendar/              # Calendar/schedule components
│   └── admin/                 # Admin-specific components
├── lib/
│   ├── supabase/              # Supabase client & types
│   ├── clerk/                 # Clerk utilities
│   ├── stripe/                # Stripe utilities
│   └── utils/                 # General utilities
├── types/                     # TypeScript types
├── hooks/                     # Custom React hooks
├── contexts/                  # React contexts (tenant, etc.)
├── public/
├── supabase/
│   └── migrations/
├── agent-os/                  # Agent OS standards
└── .claude/                   # Claude Code commands & agents
```

### File Naming

- **Components:** PascalCase (`Button.tsx`, `CourseCard.tsx`)
- **Files:** kebab-case (`course-service.ts`, `use-tenant.ts`)
- **Types:** PascalCase with `.types.ts` suffix

---

## Database Schema

### Core Tables

- `tenants` - Gyms/Studios with branding and Stripe Connect
- `users` - Clerk-synced users with tenant membership and roles
- `courses` - Course definitions per tenant
- `schedules` - Course schedule instances
- `bookings` - User bookings with payment status
- `pages` - CMS content per tenant

### Multi-Tenant Pattern

All tables have `tenant_id` column with RLS policies for isolation:

```sql
CREATE POLICY "tenant_isolation" ON {table}
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

---

## Development Guidelines

### Code Standards

- TypeScript strict mode
- ESLint + Prettier enforced
- Server Components by default, Client Components only when needed
- Tailwind CSS utility-first

### Best Practices

- All UI components responsive + accessible
- CSS Variables for dynamic tenant theming
- Server Actions for mutations where possible
- Edge-ready code (no Node.js-only APIs)

### Forbidden Practices

- No direct DOM manipulation
- No inline styles (except dynamic theming)
- No hardcoded tenant-specific values
- No bypassing RLS policies

---

## Tenant Resolution

Tenants are resolved via:

1. **Subdomain:** `{slug}.sportsplatform.com`
2. **Custom Domain:** Mapped in `tenants.domain`

Middleware extracts tenant and sets context for:
- Database queries (RLS)
- Theming (CSS variables)
- Clerk organization context

---

## Key Workflows

### Course Booking

1. User selects course/schedule
2. Stripe Checkout (connected to gym's Stripe account)
3. Webhook confirms payment → booking confirmed
4. Email notification sent

### Gym Onboarding

1. `/onboard` - Gym details form
2. Owner creates Clerk account
3. Branding setup (color, logo)
4. Stripe Connect onboarding
5. Redirect to admin dashboard

### Admin CMS

Content blocks in JSON format, rendered via components.

---

## Commands

```bash
pnpm dev              # Start development
pnpm build            # Production build
pnpm lint             # Lint check
pnpm typecheck        # TypeScript check
pnpm test             # Run tests
```

---

## Environment Variables

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Agent OS

This project uses Agent OS for development standards and workflows.

### Commands (via `/` in Claude Code)
- `/plan-product` - Product planning
- `/shape-spec` - Spec shaping
- `/write-spec` - Spec writing
- `/create-tasks` - Task creation
- `/implement-tasks` - Implementation

### Standards
Located in `agent-os/standards/` - follow these for consistent code quality.

---

## Open Questions

- [ ] Platform domain name for subdomains?
- [ ] Pricing model (per booking fee vs. monthly)?
- [ ] Default course types or fully customizable?
- [ ] Recurring schedule support?
- [ ] Multi-language (i18n)?

---

> This document guides Claude Code development of the White-Label Sports Community Platform.
