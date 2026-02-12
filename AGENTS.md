# AGENTS.md - Operational Guide

Keep this file under 60 lines. It's loaded every iteration.

## Tech Stack

- React + TypeScript + Vite
- react-router-dom (3 pages)
- vite-plugin-pwa (installable, offline)
- Plain CSS with custom properties (dark pub theme)
- localStorage for persistence (no backend)
- No testing framework, no state library, no CSS framework

## Build Commands

```bash
npm run dev            # Development server
npm run build          # Production build (TypeScript type-check + bundle)
npm run preview        # Preview production build
```

## Validation (run before committing)

```bash
npm run build          # This is the ONLY validation step. Must pass cleanly.
```

## Key Design Docs

- `PLAN.md` - Full project spec: data model, drinks database, project structure, styling, build phases
- `INTERVIEW.md` - UX decisions, design constraints, feature priorities
- `specs/` - JTBD specifications per feature area

## Project Conventions

- Two custom hooks (`useRound`, `useRegulars`) with React Context
- Smart dedup: same person + same drink increments quantity
- Dark pub theme: navy bg (#1a1a2e), red primary (#e94560), amber accent (#f5a623)
- Large touch targets (90px drink buttons), emoji-heavy
- Haptic feedback (30ms vibrate) on drink taps
- Summary page: extra-large text for pub readability
