# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # development server on localhost:3000
npm run build    # production build
npm run lint     # ESLint (eslint-config-next/core-web-vitals + typescript)
```

No test suite is configured.

## Architecture

**Next.js 16 App Router** — This is a newer release with possible breaking changes from prior versions. Read `node_modules/next/dist/docs/` before touching routing, server actions, or `next/image`.

**Path alias:** `@/` maps to `src/`.

### Portal structure

Five audience-specific portals, each a standalone route:

| Route | Portal | Layout |
|---|---|---|
| `/` | Landing | Marketing page with sticky `Navbar` |
| `/auth` | Auth | Centered card (login / register / forgot states) |
| `/citizen` | Citizen mobile app | 390×844 iPhone frame, bottom-tab nav |
| `/business` | Business SPA | 240 px dark sidebar + main content area |
| `/admin` | Admin operations | 240 px dark sidebar + live feed, real-time updates |
| `/investors` | Investor deck | 240 px dark sidebar with scrollspy (18 sections) |

The Navbar component (`src/components/navigation/Navbar.tsx`) is only used on the landing page; all other portals render their own navigation inline.

### Styling conventions

All styling is done with **inline `style` props** — Tailwind is imported globally (`@import "tailwindcss"`) but is not the primary styling mechanism.

CSS custom properties are defined in `src/app/globals.css` and used everywhere:

| Variable | Value | Meaning |
|---|---|---|
| `--g` | `#2A7D52` | Primary green |
| `--g10` / `--g20` | tints | Green fills / borders |
| `--b` | `#1A5F7A` | Primary blue |
| `--b10` | tint | Blue fills |
| `--dark` | `#191D26` | Dark backgrounds, headings |
| `--text` | `#2C3040` | Body text |
| `--muted` | `#707688` | Secondary text |
| `--border` | `#DDE1EC` | Borders |
| `--bg` | `#F4F6FA` | Page background |
| `--white` | `#FFFFFF` | Card backgrounds |
| `--red` / `--amber` | status colors | Alerts |
| `--r` | `8px` | Default border-radius |

Font is **DM Sans** loaded via `next/font/google` in the root layout.

### Key dependencies

- **Leaflet** — interactive map on `/citizen`. Imported dynamically (`await import('leaflet')`) inside `useEffect` to avoid SSR. The map container `ref` must exist before calling `L.map()`.
- **Framer Motion** — available but not yet used in the current codebase.
- **Lucide React** — available but not yet used; inline SVG icons are used instead.

### Client / Server boundary

All portal pages and the Navbar are marked `'use client'`. The root layout (`src/app/layout.tsx`) and any future server components should remain server components. When adding Leaflet or other browser-only code always guard with `useEffect` and dynamic import.
