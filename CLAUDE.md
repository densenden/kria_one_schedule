# KRIA Training Community Tool – Claude.md

## Projektübersicht

### Kurze Beschreibung

Die KRIA Training App ist eine moderne, bewusst gestaltete Buchungs- und Community-Plattform für Sportangebote (z. B. Schwimmen, Functional Training, Animal Movement). Nutzer können sich anmelden, Profile mit Athleteninfos pflegen, Kurse im Kalender buchen und einsehen, wer teilnimmt. Das Design ist achtsam-minimalistisch, hell, viel Weißraum mit cyan- und ultramarinfarbenen Akzenten. Dark Mode verfügbar.

### Hauptziele

- Intuitive Buchung von Sportkursen
- Moderne Kalenderdarstellung mit Vorschau und animierten Modals
- Aufbau einer Community mit Profilen und Teilnehmerübersicht
- Integration mit Medusa.js (Produktmanagement) und Stripe Checkout
- App-optimiertes UI mit Fokus auf mobile Nutzung

### Technologie-Stack

- **Frontend:** React Native (Web + iOS + Android), Tailwind (via Nativewind)
- **Backend:** Supabase (DB, Auth, Storage)
- **Commerce:** Medusa.js (Produkte = Kurse)
- **Zahlung:** Stripe
- **E-Mail:** Sendgrid für Transaktionsmails

---

## Projektstruktur

### Verzeichnisstruktur

```
/kria-app
  /components         # Wiederverwendbare UI-Komponenten
  /screens            # Views & Routen (z. B. CalendarScreen, ProfileScreen)
  /assets
    /images           # PNGs, z. B. bg_course1.png, bg_course2.png
  /lib                # API-Wrapper für Supabase, Medusa, Stripe
  /styles             # Global styles (z. B. Colors, Spacing)
  /contexts           # Global State (z. B. AuthContext)
  /utils              # Hilfsfunktionen
```

### Wichtige Dateien

- `App.tsx` – Einstiegspunkt der App
- `calendar.config.ts` – Slot-Definitionen & Darstellungskonfiguration
- `tailwind.config.js` – Farben (weiß, cyan, ultramarin), Dark Mode

### Konventionen

- **Component Naming:** PascalCase
- **File Naming:** kebab-case.tsx
- **Slot Formatierung:** `Weekday HH:MM–HH:MM`
- **Assets:** PNG-Dateien als quadratische Hintergründe (`bg_course1.png`, `bg_movement2.png`)

---

## Entwicklungsrichtlinien

### Code-Standards

- TypeScript only
- ESLint + Prettier enforced
- Tailwind für UI mit Utility-First-Prinzip

### Best Practices

- Alle UI-Komponenten sind responsive + barrierefrei
- Modals (z. B. Kursinfo) nutzen glassmorphism (blur, transparency)
- Kalendereinträge nutzen animierte Hover- oder Tap-Effekte

### Verbotene Praktiken

- Kein direktes DOM-Manipulieren
- Keine Inline-Styles, außer bei dynamischem Styling

---

## Aufgaben und Workflows

### Häufige Aufgaben

- ♦ Kurse in Medusa als Produkte erstellen
- ♦ Kurstermine in Supabase speichern mit Bezug auf Produkt
- ♦ Teilnehmerdaten verwalten

### Spezielle Anweisungen

- Kalenderansicht nutzt eine Raster-Darstellung mit Vorschau
- Kursdetailseite erscheint als Modal (75% Bildschirm, zentriert, weiß + Schatten)
- Admin kann Slots via UI belegen

### Testing-Anforderungen

- E2E via Detox
- Unit-Tests für Komponenten
- Testdaten via Mock-Datenbanken

---

## Kontextinformationen

### Geschäftslogik

- Kursbuchung = Checkout mit Stripe = Platzreservierung
- „Teilnehmer“ sehen sich gegenseitig (wenn öffentlich)
- Nur bezahlte Buchungen werden angezeigt

### Externe Abhängigkeiten

- Medusa REST API (Produkte = Kurse)
- Supabase: Auth, Realtime, Storage
- Sendgrid für Transaktions-E-Mails

### Bekannte Probleme

- Stripe Webhooks noch nicht verbunden mit Supabase-Status
- Medusa-Produktvarianten noch nicht verlinkt mit Zeit-Slots

---

## Beispiele

### UI: Kalender (Minimal)

- weiße Kacheln mit cyan border
- Tagesübersicht mit Bewegungstyp-Vorschau
- Tap öffnet Modal (glassy, mit PNG-Hintergrund)

### Code-Beispiel: Slot-Komponente

```tsx
<CalendarSlot
  title="Animal Movement"
  time="18:00–19:00"
  location="Turnhalle 1"
  type="Conditioning"
  image="/assets/images/bg_movement1.png"
/>
```

### Kommandos

```bash
pnpm dev             # Lokale Entwicklung starten
pnpm build           # Build erzeugen
pnpm test            # Tests ausführen
```

---

## PNG-Hintergründe (Austauschbar)

- `bg_course1.png`
- `bg_movement1.png`
- `bg_fitness1.png`
- `bg_swimming1.png`
- `bg_conditioning1.png`

Diese sollten quadratisch, hochauflösend (min. 1080x1080) und stilistisch im selben Look gehalten sein. Am besten mit Blur-Overlay kombinierbar.

---

## Offene Fragen

- Sollen öffentliche Profile DSGVO-konform bestätigt werden?
- Wie granular sollen Admins Kurs-Varianten definieren können (z. B. Level, Intensität)?
- Sollen wiederkehrende Kurse (Serien) unterstützt werden?
- Soll die App in mehreren Sprachen starten? (i18n)
- Wünschst du Animationen mit Framer Motion oder rein Native?

---

> Dieses Dokument ist Grundlage für Claude Code zur Weiterentwicklung der App. Es beschreibt alle UX- und Backend-relevanten Bereiche für das KRIA Training Tool.

