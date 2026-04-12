# CLAUDE.md

## Project Overview

My Round — a mobile-first PWA for managing pub drink orders. Save regulars and their favourites, build rounds by tapping, and review order history.

**Live:** https://myround.netlify.app

## Tech Stack

- Vite + React + TypeScript
- react-router-dom (client-side routing)
- vite-plugin-pwa + Workbox (PWA / service worker)
- Deployed on Netlify

## Development Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint
```

## Architecture

- `src/components/` — React components
- `src/pages/` — Route pages (round builder, regulars, history)
- `src/store/` or `src/context/` — State management
- `public/` — PWA manifest and icons

## Design Principles

Mobile-first. This is used at a pub bar — UI needs to work quickly with one hand, large touch targets, readable in poor lighting. Keep interactions minimal and fast.

## Deployment

Deployed on Netlify via `netlify.toml`. Auto-deploys from main branch.
