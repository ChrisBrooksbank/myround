# MyRound - Pub Drink Order PWA

## Context
You have a terrible memory and need a fast way to take drink orders when people are shouting across the room, then review the full order at the bar without forgetting anyone. This PWA lives on your phone, works offline, and remembers your regulars.

## Tech Stack
- **React + TypeScript + Vite** (fast dev, small bundle)
- **vite-plugin-pwa** (installable, offline)
- **react-router-dom** (3 pages)
- **Plain CSS** with custom properties (dark pub theme, no framework)
- **localStorage** for persistence (no backend)
- No testing framework, no state library, no CSS framework

## Core UX: "Shout Across the Room" Flow
1. Type a name (or tap a regular's quick-add button)
2. Tap a drink → order added instantly, name clears, ready for next person
3. Same person + same drink = quantity increments (no duplicates)
4. Regulars = one tap adds name + their usual drink
5. Summary screen grouped by drink (for ordering) and by person (for handing out)

## Three Screens

### `/` - RoundPage (main screen, speed-optimized)
- Regulars quick-add bar at top (one-tap ordering)
- Name input with auto-focus and auto-clear after each order
- Category tabs: Pints | Wine | Spirits | Soft | Shots
- Big tappable drink buttons (90px, emoji + label)
- Live order list at bottom with delete and quantity controls

### `/summary` - SummaryPage (at the bar)
- **By drink**: "3x Lager (Dave x2, Chris), 1x Guinness (Tom)..." - what you say to the barman
- **By person**: who gets what - for handing out drinks
- Large high-contrast text, dark background (readable in dim pub)
- "Done" button archives round and clears

### `/regulars` - RegularsPage
- Add/edit/delete regulars (name + usual drink)
- Create groups ("Friday Crew", "Work Lot")
- Groups pre-fill everyone's usuals on the main screen

## Data Model (`src/types.ts`)
```typescript
interface Drink { id, name, shortName, emoji, category }
type DrinkCategory = 'pints' | 'wine' | 'spirits' | 'soft' | 'shots'
interface OrderLine { id, drinkId, personName, quantity }
interface Round { id, createdAt, orders: OrderLine[] }
interface Regular { id, name, usualDrinkId }
interface RegularGroup { id, name, memberIds: string[] }
```

## UK Drinks List (~30 drinks)
- **Pints**: Lager, Bitter, Guinness, Cider, IPA, Half Lager, Half Cider
- **Wine**: Red, White, Rosé, Prosecco
- **Spirits**: G&T, Vodka Coke, Rum & Coke, JD & Coke, Whisky, Vodka Lemonade, Double G&T
- **Soft**: Coke, Diet Coke, Lemonade, OJ, Lime & Soda, Water, Tonic
- **Shots**: Sambuca, Tequila, Jägerbomb, Baby Guinness

## Project Structure
```
src/
  types.ts                    # All TypeScript interfaces
  data/drinks.ts              # UK drinks catalogue
  lib/storage.ts              # Thin localStorage wrapper
  hooks/useRound.ts           # Round state + context + persistence
  hooks/useRegulars.ts        # Regulars/groups state + context + persistence
  components/
    Header.tsx                # Nav bar with round count badge
    DrinkButton.tsx           # Single drink button (emoji + label)
    DrinkGrid.tsx             # Category tabs + grid of DrinkButtons
    NameInput.tsx             # Text input for person name
    OrderItem.tsx             # Single order line (name, drink, qty, delete)
    OrderList.tsx             # List of OrderItems
    RegularsPicker.tsx        # Quick-add buttons for saved regulars
    RegularEditor.tsx         # Add/edit/delete regulars + groups
    SummaryView.tsx           # Formatted order summary
    ReloadPrompt.tsx          # PWA update toast
  pages/
    RoundPage.tsx             # Main ordering screen
    SummaryPage.tsx           # Bar review screen
    RegularsPage.tsx          # Manage regulars
  App.tsx                     # Router + context providers
  index.css                   # Theme variables, reset, global styles
  App.css                     # Layout and component styles
```

## Styling: Dark Pub Theme
- Dark navy background (`#1a1a2e`), warm red primary (`#e94560`), amber accent (`#f5a623`)
- Category colors: Pints=amber, Wine=red, Spirits=purple, Soft=cyan, Shots=orange
- Large touch targets, emoji-heavy, subtle press animations
- Haptic feedback (30ms vibrate) on drink taps
- Summary page: extra-large text for pub readability

## State Management
- Two custom hooks (`useRound`, `useRegulars`) with `useState` + `useEffect` for localStorage sync
- Two React contexts (one per hook) provided in `App.tsx` - no external library
- Smart dedup: same person + same drink increments quantity

## Build Order

### Phase 1: Scaffold
- `npm create vite@latest` with react-ts template
- Install `react-router-dom`, `vite-plugin-pwa`, `workbox-window`
- Create `types.ts`, `drinks.ts`, `storage.ts`

### Phase 2: Core Ordering Screen
- Build hooks (`useRound.ts`, `useRegulars.ts`) with contexts
- Build components: Header, DrinkButton, DrinkGrid, NameInput, OrderItem, OrderList
- Build RoundPage, wire up App.tsx with router + contexts
- Write CSS (index.css + App.css)

### Phase 3: Summary Screen
- Build SummaryView + SummaryPage (by-drink and by-person views)

### Phase 4: Regulars
- Build RegularsPicker (quick-add bar on RoundPage)
- Build RegularEditor + RegularsPage

### Phase 5: PWA
- Configure vite-plugin-pwa in vite.config.ts
- Add icons to public/
- Build ReloadPrompt component

### Phase 6: Polish
- Animations (button press scale, order slide-in)
- Haptic feedback
- Test installability + offline

## Verification
1. `npm run dev` - app loads, can add orders by typing name + tapping drink
2. Tap a drink without a name → name input shakes/focuses (no empty orders)
3. Add same person + same drink twice → quantity increments to 2
4. Navigate to `/summary` → orders grouped by drink and by person
5. "Done" clears round, navigate back → empty round
6. Add a regular in `/regulars` → appears as quick-add button on main screen
7. Tap regular quick-add → order added with one tap
8. `npm run build` → check PWA manifest in build output
9. Refresh after build → app works offline (service worker caches assets)
