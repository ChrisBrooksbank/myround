# Implementation Plan

## Status

- Planning iterations: 1
- Build iterations: 1
- Last updated: 2026-02-12

## Phase 1: Project Scaffold

- [x] Initialize Vite + React + TypeScript project with npm create vite (spec: pwa-and-polish.md)
- [x] Install dependencies: react-router-dom, vite-plugin-pwa, workbox-window (spec: pwa-and-polish.md)
- [x] Create src/types.ts with all TypeScript interfaces (spec: ordering-flow.md, summary-and-bar.md, regulars-and-groups.md)
- [x] Create src/data/drinks.ts with ~80-100 UK pub drinks across 7 categories (spec: drinks-database.md)
- [x] Create src/lib/storage.ts with localStorage wrapper for rounds, regulars, groups, and history (spec: ordering-flow.md, regulars-and-groups.md)

## Phase 2: Core Ordering Screen

- [x] Create src/hooks/useRound.ts with round state, dedup logic, history persistence (spec: ordering-flow.md)
- [x] Create src/hooks/useRegulars.ts with regulars/groups state and persistence (spec: regulars-and-groups.md)
- [x] Create src/components/Header.tsx with navigation and round count badge (spec: ordering-flow.md)
- [x] Create src/components/DrinkButton.tsx with emoji, label, and press animation (spec: drinks-database.md)
- [x] Create src/components/DrinkGrid.tsx with category tabs, subcategory pills, drink grid, and "Other" button (spec: ordering-flow.md, drinks-database.md)
- [x] Create src/components/NameInput.tsx with auto-focus, auto-clear, and "same again" suggestion (spec: ordering-flow.md)
- [x] Create src/components/OrderItem.tsx with person name, drink, quantity controls, and delete button (spec: ordering-flow.md)
- [x] Create src/components/OrderList.tsx rendering all current order items (spec: ordering-flow.md)
- [x] Create src/pages/RoundPage.tsx integrating all ordering components (spec: ordering-flow.md)
- [x] Create src/index.css with CSS custom properties for dark pub theme (spec: pwa-and-polish.md)
- [x] Create src/App.css with component styles, touch targets, category colors (spec: pwa-and-polish.md)
- [ ] Create src/App.tsx with router and context providers (spec: ordering-flow.md)

## Phase 3: Summary Screen

- [ ] Create src/components/SummaryView.tsx with by-drink and by-person views (spec: summary-and-bar.md)
- [ ] Add tick-off functionality with strikethrough on tap and ordered state tracking (spec: summary-and-bar.md)
- [ ] Add progress indicator showing completed vs total drinks (spec: summary-and-bar.md)
- [ ] Create src/pages/SummaryPage.tsx with view toggle and "Done" button (spec: summary-and-bar.md)
- [ ] Implement "Done" button to archive round (set completedAt) and navigate back (spec: summary-and-bar.md)
- [ ] Style summary page with extra-large text for pub readability (spec: pwa-and-polish.md, summary-and-bar.md)

## Phase 4: Regulars & Groups

- [ ] Create src/components/RegularsPicker.tsx with quick-add buttons at top of RoundPage (spec: regulars-and-groups.md)
- [ ] Add favorite drink picker popover shown on regular tap (2-3 drinks per regular) (spec: regulars-and-groups.md)
- [ ] Create src/components/RegularEditor.tsx for adding/editing/deleting regulars (spec: regulars-and-groups.md)
- [ ] Add multiple favorite drinks selector (array of 2-3 drinkIds) to editor (spec: regulars-and-groups.md)
- [ ] Create src/pages/RegularsPage.tsx with regular list and editor (spec: regulars-and-groups.md)
- [ ] Add groups feature: create/edit/delete groups with member selection (spec: regulars-and-groups.md)
- [ ] Add group quick-add button to pre-fill round with members' first favorites (spec: regulars-and-groups.md)

## Phase 5: PWA Configuration

- [ ] Configure vite-plugin-pwa in vite.config.ts with workbox strategies (spec: pwa-and-polish.md)
- [ ] Create public/manifest.json with app metadata, theme colors, icons (spec: pwa-and-polish.md)
- [ ] Add public/icon-192.png and public/icon-512.png (spec: pwa-and-polish.md)
- [ ] Create src/components/ReloadPrompt.tsx for PWA update notifications (spec: pwa-and-polish.md)
- [ ] Add ReloadPrompt to App.tsx (spec: pwa-and-polish.md)
- [ ] Test installability and offline functionality (spec: pwa-and-polish.md)

## Phase 6: Polish & Refinement

- [ ] Add button press animations with scale transform (spec: pwa-and-polish.md)
- [ ] Add order slide-in animations when items are added (spec: pwa-and-polish.md)
- [ ] Implement haptic feedback (30ms vibrate) on drink button taps (spec: pwa-and-polish.md)
- [ ] Add name input shake/focus animation when drink tapped without name (spec: ordering-flow.md)
- [ ] Test and refine "same again" suggestion logic across multiple rounds (spec: ordering-flow.md)
- [ ] Test mobile responsiveness for 360-428px viewport widths (spec: pwa-and-polish.md)
- [ ] Verify 90px minimum touch targets across all interactive elements (spec: pwa-and-polish.md)
- [ ] Test category color coding across all 7 categories (spec: drinks-database.md, pwa-and-polish.md)

## Verification Checklist

- [ ] App loads with full drinks database visible (spec: drinks-database.md)
- [ ] Type name + tap drink = order added, name auto-clears (spec: ordering-flow.md)
- [ ] Tap drink without name = name input shakes/focuses (spec: ordering-flow.md)
- [ ] Same person + same drink = quantity increments (dedup works) (spec: ordering-flow.md)
- [ ] "Other" button = custom drink text input works (spec: ordering-flow.md)
- [ ] Navigate to /summary = by-drink view default, can toggle to by-person (spec: summary-and-bar.md)
- [ ] Tap drinks on summary to tick off with strikethrough and progress update (spec: summary-and-bar.md)
- [ ] "Done" button archives round, navigates back to empty round (spec: summary-and-bar.md)
- [ ] Type name from previous round = "same again" suggestion appears (spec: ordering-flow.md)
- [ ] Add regular with 2-3 favorites in /regulars (spec: regulars-and-groups.md)
- [ ] Tap regular quick-add = favorite picker shown (spec: regulars-and-groups.md)
- [ ] npm run build = check PWA manifest in build output (spec: pwa-and-polish.md)
- [ ] Refresh after build = app works offline (spec: pwa-and-polish.md)

## Completed

<!-- Completed tasks move here with [x] -->

## Notes

### Architectural Decisions

**State Management:**
- Two custom hooks (useRound, useRegulars) with useState + useEffect
- Two React contexts for sharing state across components
- No external state library (Redux, Zustand)
- localStorage sync on every state change

**Deduplication Logic:**
- Key: `${personName.toLowerCase()}-${drinkId}` for standard drinks
- Key: `${personName.toLowerCase()}-custom-${customDrinkName.toLowerCase()}` for custom drinks
- If match found, increment quantity instead of adding new OrderLine

**Round History:**
- completedAt timestamp marks archived rounds
- History stored in separate localStorage key
- Used for "same again" per-person suggestions
- Recent rounds checked by personName match

**Regulars with Multiple Favorites:**
- favouriteDrinkIds: string[] (2-3 items recommended)
- Tapping regular shows picker only if >1 favorite
- Single favorite = instant order addition (no picker)

**Navigation Structure:**
- / = RoundPage (main ordering)
- /summary = SummaryPage (bar review)
- /regulars = RegularsPage (manage favorites)
- Header visible on all pages with round count badge

**Category & Subcategory System:**
- 7 top-level categories: Pints, Wine, Spirits, Cocktails, Soft, Shots, 0%
- Pints has subcategories: Lager, Ale, IPA, Stout, Cider, Half
- Wine has subcategories: Red, White, Rose, Sparkling
- Other categories are flat (no subcategories)
- Each category has assigned color for visual coding

**PWA Strategy:**
- vite-plugin-pwa with workbox
- Offline-first: cache all assets after first load
- manifest.json for installability
- ReloadPrompt for update notifications
- Service worker registered in main.tsx

**Styling Approach:**
- CSS custom properties in index.css for theming
- Component-specific styles in App.css
- No CSS-in-JS, no styled-components
- Mobile-first: 360-428px viewport
- Dark theme optimized for low-light environments
