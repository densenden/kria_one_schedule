# Product Roadmap

## Uebersicht

```
+-------------+     +-------------+     +-------------+     +-------------+
|   PHASE 1   | --> |   PHASE 2   | --> |   PHASE 3   | --> |   PHASE 4   |
|   Foundation|     |     MVP     |     |   Growth    |     |    Scale    |
|   (4 Wochen)|     |  (8 Wochen) |     | (12 Wochen) |     |  (ongoing)  |
+-------------+     +-------------+     +-------------+     +-------------+
```

---

## Phase 1: Foundation (Wochen 1-4)

**Ziel:** Technische Basis etablieren, Multi-Tenant-Architektur aufsetzen

### Milestone 1.1: Project Setup (Woche 1)

| Task | Status | Prioritaet |
|------|--------|------------|
| Repository Setup (Branch, CI/CD) | - | P0 |
| Next.js 14 mit App Router initialisieren | - | P0 |
| Tailwind CSS + CSS Variables konfigurieren | - | P0 |
| ESLint, Prettier, TypeScript strict mode | - | P0 |
| Supabase Projekt erstellen | - | P0 |
| Clerk Application erstellen | - | P0 |

### Milestone 1.2: Database Schema (Woche 2)

| Task | Status | Prioritaet |
|------|--------|------------|
| Multi-Tenant Schema (tenants, users, courses, schedules, bookings) | - | P0 |
| RLS Policies fuer Tenant-Isolation | - | P0 |
| Database Types generieren (Supabase CLI) | - | P0 |
| Seed Data fuer Development | - | P1 |
| Migration Scripts | - | P0 |

### Milestone 1.3: Auth Integration (Woche 3)

| Task | Status | Prioritaet |
|------|--------|------------|
| Clerk Middleware Setup | - | P0 |
| Tenant Detection (Subdomain/Domain) | - | P0 |
| User Sync Webhook (Clerk -> Supabase) | - | P0 |
| Protected Routes | - | P0 |
| Role-based Access Control (member, coach, admin, owner) | - | P0 |

### Milestone 1.4: Core Infrastructure (Woche 4)

| Task | Status | Prioritaet |
|------|--------|------------|
| Tenant Context Provider | - | P0 |
| Dynamic Theming (CSS Variables per Tenant) | - | P0 |
| Supabase Client mit Tenant-Kontext | - | P0 |
| Error Handling & Logging | - | P1 |
| Basic Layout Components (Header, Footer, Sidebar) | - | P0 |

**Deliverables Phase 1:**
- [ ] Laufende Entwicklungsumgebung
- [ ] Datenbank mit Multi-Tenant Schema
- [ ] Funktionierende Authentifizierung
- [ ] Tenant-basiertes Theming

---

## Phase 2: MVP (Wochen 5-12)

**Ziel:** Kernfunktionen implementieren, erste Beta-Buchungen ermoeglichen

### Milestone 2.1: Public Pages (Woche 5-6)

| Task | Status | Prioritaet |
|------|--------|------------|
| Landing Page (tenant-branded) | - | P0 |
| Course List Page (/courses) | - | P0 |
| Course Detail Page (/courses/[id]) | - | P0 |
| Schedule Calendar View (/schedule) | - | P0 |
| Responsive Design (Mobile-first) | - | P0 |

### Milestone 2.2: Booking Flow (Woche 7-8)

| Task | Status | Prioritaet |
|------|--------|------------|
| Schedule Selection UI | - | P0 |
| Booking Modal mit Teilnehmerinfo | - | P0 |
| Stripe Connect Setup | - | P0 |
| Checkout Flow (Stripe) | - | P0 |
| Booking Confirmation Page | - | P0 |
| Stripe Webhooks (payment_intent.succeeded, etc.) | - | P0 |
| Booking Status Updates | - | P0 |

### Milestone 2.3: Member Dashboard (Woche 9-10)

| Task | Status | Prioritaet |
|------|--------|------------|
| Profile Page (/profile) | - | P0 |
| Profile Edit (Avatar, Bio, Athlete Info) | - | P0 |
| My Bookings (/bookings) | - | P0 |
| Booking Cancellation | - | P1 |
| Teilnehmerliste in Kursen (wer nimmt teil) | - | P0 |

### Milestone 2.4: Admin Basics (Woche 11-12)

| Task | Status | Prioritaet |
|------|--------|------------|
| Admin Dashboard Overview (/admin) | - | P0 |
| Course CRUD (/admin/courses) | - | P0 |
| Schedule CRUD (/admin/schedules) | - | P0 |
| Member List (/admin/members) | - | P1 |
| Settings: Branding (/admin/settings) | - | P0 |

**Deliverables Phase 2:**
- [ ] Vollstaendiger Buchungsflow
- [ ] Zahlungsintegration (Stripe)
- [ ] Funktionales Admin-Panel (Basis)
- [ ] Member-Dashboard

---

## Phase 3: Growth (Wochen 13-24)

**Ziel:** Plattform ausbauen, Self-Service Onboarding, Premium Features

### Milestone 3.1: Gym Onboarding (Woche 13-15)

| Task | Status | Prioritaet |
|------|--------|------------|
| Onboarding Landing Page (/onboard) | - | P0 |
| Step 1: Gym Details (Name, Slug) | - | P0 |
| Step 2: Owner Account (Clerk Sign-Up) | - | P0 |
| Step 3: Branding Setup (Color, Logo Upload) | - | P0 |
| Step 4: Stripe Connect Onboarding | - | P0 |
| Step 5: First Course Setup | - | P1 |
| Subdomain Provisioning | - | P0 |

### Milestone 3.2: Advanced Admin (Woche 16-18)

| Task | Status | Prioritaet |
|------|--------|------------|
| CMS: Page Editor (/admin/pages) | - | P1 |
| Custom Domain Setup UI | - | P1 |
| Coach Management (assign coaches) | - | P0 |
| Booking Analytics (Charts, Reports) | - | P1 |
| Email Templates Customization | - | P2 |
| Export Functions (CSV, PDF) | - | P2 |

### Milestone 3.3: Enhanced Booking (Woche 19-21)

| Task | Status | Prioritaet |
|------|--------|------------|
| Recurring Schedules (weekly patterns) | - | P0 |
| Waitlist Functionality | - | P1 |
| Class Pack / Credit System | - | P2 |
| Cancellation Policies | - | P1 |
| Automated Reminders (Email) | - | P0 |
| Calendar Sync (iCal, Google) | - | P1 |

### Milestone 3.4: Community Features (Woche 22-24)

| Task | Status | Prioritaet |
|------|--------|------------|
| Member Directory (opt-in) | - | P1 |
| Coach Profiles | - | P0 |
| Activity Feed (wer hat gebucht) | - | P2 |
| Achievements / Badges | - | P3 |
| Referral System | - | P2 |

**Deliverables Phase 3:**
- [ ] Self-Service Gym Onboarding
- [ ] Erweiterte Admin-Funktionen
- [ ] Recurring Schedules
- [ ] Community Features (Basis)

---

## Phase 4: Scale (Woche 25+)

**Ziel:** Skalierung, Enterprise Features, Internationalisierung

### Enterprise Features

| Feature | Beschreibung | Prioritaet |
|---------|--------------|------------|
| Multi-Location Support | Ein Tenant, mehrere Standorte | P1 |
| API Access | REST/GraphQL fuer Integrationen | P1 |
| SSO (Enterprise Auth) | SAML, LDAP fuer Corporates | P2 |
| White-Label Email Domain | Emails von eigener Domain | P2 |
| Advanced Analytics | BI Dashboard, Custom Reports | P2 |
| Audit Logs | Compliance-relevante Protokolle | P2 |

### Mobile Apps

| Feature | Beschreibung | Prioritaet |
|---------|--------------|------------|
| React Native Shell | Native App mit WebView Core | P1 |
| Push Notifications | Buchungs-Reminders, Updates | P1 |
| Offline Capability | Cached Schedule View | P2 |
| Native Calendar Integration | iOS/Android Calendar Sync | P1 |

### Internationalisierung

| Feature | Beschreibung | Prioritaet |
|---------|--------------|------------|
| i18n Framework (next-intl) | Multi-Language Support | P1 |
| Languages: DE, EN, FR, ES | Erste Sprachen | P1 |
| Multi-Currency | USD, EUR, CHF, GBP | P1 |
| Timezone Handling | Globale Nutzer | P1 |
| Regional Compliance | DSGVO, CCPA, etc. | P0 |

### Platform Improvements

| Feature | Beschreibung | Prioritaet |
|---------|--------------|------------|
| Performance Optimization | < 1s LCP | P1 |
| CDN / Edge Caching | Globale Verteilung | P1 |
| Auto-Scaling | Traffic Spikes | P1 |
| Disaster Recovery | Backup & Restore | P0 |
| Penetration Testing | Security Audit | P0 |

---

## Risiken & Mitigations

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Stripe Connect Komplexitaet | Hoch | Hoch | Fruehe PoC, Stripe Support nutzen |
| Multi-Tenant Performance | Mittel | Hoch | Connection Pooling, RLS Optimierung |
| Clerk Rate Limits | Niedrig | Mittel | Caching, Webhook-basierte Sync |
| Feature Creep | Hoch | Mittel | Strenge Roadmap-Disziplin |
| Konkurrenz kopiert | Mittel | Mittel | Schnelle Iteration, Community-Fokus |

---

## Release-Strategie

### MVP Release (Woche 12)

```
Soft Launch:
- 3-5 handverlesene Beta-Partner
- Intensive Feedback-Schleifen
- Weekly Releases

Erfolgs-Kriterien:
- [ ] 100+ erfolgreiche Buchungen
- [ ] NPS > 30
- [ ] < 5 Critical Bugs
```

### Public Launch (Woche 24)

```
Marketing Push:
- Landing Page fuer Platform
- Content Marketing (Blog, Social)
- Partner Announcements

Erfolgs-Kriterien:
- [ ] 20+ aktive Tenants
- [ ] Positive Press Coverage
- [ ] Stable Revenue Stream
```

---

## Team & Ressourcen

### Erforderliche Rollen

| Rolle | Phase 1-2 | Phase 3-4 |
|-------|-----------|-----------|
| Full-Stack Developer | 1 | 2 |
| UI/UX Designer | 0.5 | 1 |
| DevOps | 0.25 | 0.5 |
| Product Manager | 0.5 | 1 |
| Customer Success | 0 | 1 |

### Externe Services

- Vercel Pro Plan
- Supabase Pro Plan
- Clerk Pro Plan
- Stripe (Pay-as-you-go)
- Sendgrid (Volume-based)

---

> Dieses Dokument wird monatlich aktualisiert. Prioritaeten koennen sich basierend auf Kundenfeedback aendern.
