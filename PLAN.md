# MyRound - Pub Drink Order PWA

## Context
You have a terrible memory and need a fast way to take drink orders when people are shouting across the room (8-15 people, big table chaos), then review the full order at the bar without forgetting anyone. You literally read from your phone at the bar. This PWA lives on your phone, works offline, and remembers your regulars.

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
4. Regulars = tap shows favourite drink picker (2-3 options)
5. "Same again" = typing a name from the last round suggests their previous drink
6. Summary screen grouped by drink (for ordering at bar) and by person (for handing out)
7. Tick off drinks on summary as you order them

## Three Screens

### `/` - RoundPage (main screen, speed-optimized)
- Regulars quick-add bar at top (tap → favourite drink picker)
- Name input with auto-focus, auto-clear, and "same again" suggestion
- Category tabs: Pints | Wine | Spirits | Cocktails | Soft | Shots | 0%
- Subcategory pills within each tab (e.g. Pints > Lager | Ale | IPA | Stout | Cider)
- Big tappable drink buttons (90px, emoji + label)
- "Other..." button for custom/free-text drinks
- Live order list at bottom with delete and quantity controls

### `/summary` - SummaryPage (at the bar)
- **By drink** (default): "3x Peroni (Dave x2, Chris), 1x Guinness (Tom)..." - what you say to the barman
- **By person** (toggle): who gets what - for handing out drinks
- **Tick-off**: tap each drink to strikethrough as you order it, with progress indicator
- Large high-contrast text, dark background (readable in dim pub)
- "Done" button archives round to history and clears

### `/regulars` - RegularsPage
- Add/edit/delete regulars (name + 2-3 favourite drinks)
- Create groups ("Friday Crew", "Work Lot") - nice-to-have, lower priority
- Groups pre-fill everyone's usuals on the main screen

## Data Model (`src/types.ts`)
```typescript
interface Drink { id: string; name: string; shortName: string; emoji: string; category: DrinkCategory; subcategory: string }
type DrinkCategory = 'pints' | 'wine' | 'spirits' | 'cocktails' | 'soft' | 'shots' | 'zero'
interface OrderLine { id: string; drinkId: string; personName: string; quantity: number; customDrinkName?: string; ordered?: boolean }
interface Round { id: string; createdAt: string; completedAt?: string; orders: OrderLine[] }
interface Regular { id: string; name: string; favouriteDrinkIds: string[] }
interface RegularGroup { id: string; name: string; memberIds: string[] }
```

## UK Drinks Database (~80-100 drinks with subcategories)

### Pints
- **Lager**: Peroni, Estrella, Birra Moretti, Carling, Fosters, Heineken, San Miguel, Madri, Prawns (generic Lager)
- **Ale**: Doom Bar, London Pride, Hobgoblin, Old Speckled Hen, Bombardier (generic Bitter)
- **IPA**: Punk IPA, Neck Oil, Elvis Juice, Lagunitas, Greene King IPA (generic IPA)
- **Stout**: Guinness, Murphy's (generic Stout)
- **Cider**: Strongbow, Thatchers Gold, Thatchers Haze, Magners, Aspall, Old Rosie (generic Cider)
- **Half**: Half Lager, Half Cider, Half Bitter

### Wine
- **Red**: Red Wine, Merlot, Shiraz, Pinot Noir, Malbec
- **White**: White Wine, Pinot Grigio, Sauvignon Blanc, Chardonnay
- **Rose**: Rose Wine
- **Sparkling**: Prosecco, Champagne

### Spirits
- G&T, Double G&T, Vodka Coke, Vodka Lemonade, Rum & Coke, JD & Coke, Whisky, Brandy, Amaretto, Southern Comfort & Lemonade

### Cocktails
- Espresso Martini, Aperol Spritz, Mojito, Pornstar Martini, Margarita, Long Island Iced Tea, Pina Colada, Cosmopolitan, Old Fashioned, Negroni

### Soft
- Coke, Diet Coke, Lemonade, OJ, Lime & Soda, Water, Tonic Water, Appletiser, J2O

### Shots
- Sambuca, Tequila, Jagerbomb, Baby Guinness, Fireball

### 0% / Low Alcohol
- Peroni 0.0, Guinness 0.0, Heineken 0.0, Erdinger Alkoholfrei, Lucky Saint, Nosecco, Becks Blue

## Project Structure
```
src/
  types.ts                    # All TypeScript interfaces
  data/drinks.ts              # Expanded UK drinks database (~80-100 drinks, subcategories)
  lib/storage.ts              # localStorage wrapper (rounds, regulars, history)
  hooks/useRound.ts           # Round state + context + persistence + history
  hooks/useRegulars.ts        # Regulars/groups state + context + persistence
  components/
    Header.tsx                # Nav bar with round count badge
    DrinkButton.tsx           # Single drink button (emoji + label)
    DrinkGrid.tsx             # Category tabs + subcategory pills + grid + "Other" button
    NameInput.tsx             # Text input with "same again" suggestion
    OrderItem.tsx             # Single order line (name, drink, qty, delete)
    OrderList.tsx             # List of OrderItems
    RegularsPicker.tsx        # Quick-add buttons showing favourite drink picker
    RegularEditor.tsx         # Add/edit/delete regulars + groups
    SummaryView.tsx           # Tick-off summary, by-drink default, by-person toggle
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
- Category colors: Pints=amber, Wine=red, Spirits=purple, Cocktails=pink, Soft=cyan, Shots=orange, 0%=green
- Large touch targets, emoji-heavy, subtle press animations
- Haptic feedback (30ms vibrate) on drink taps
- Summary page: extra-large text for pub readability
- Polished enough to share with mates - should feel like a real product

## State Management
- Two custom hooks (`useRound`, `useRegulars`) with `useState` + `useEffect` for localStorage sync
- Two React contexts (one per hook) provided in `App.tsx` - no external library
- Smart dedup: same person + same drink increments quantity
- Round history persisted for "same again" and pattern tracking

## Build Order

### Phase 1: Scaffold
- `npm create vite@latest` with react-ts template
- Install `react-router-dom`, `vite-plugin-pwa`, `workbox-window`
- Create `types.ts` with updated data model
- Create expanded `drinks.ts` database (~80-100 drinks, subcategories)
- Create `storage.ts` with round history support

### Phase 2: Core Ordering Screen
- Build hooks (`useRound.ts` with history, `useRegulars.ts` with multiple favourites)
- Build components: Header, DrinkButton, DrinkGrid (subcategories + "Other" button), NameInput (with "same again" prompt), OrderItem, OrderList
- Build RoundPage, wire up App.tsx with router + contexts
- Write CSS (index.css + App.css)

### Phase 3: Summary Screen
- Build SummaryView with tick-off, by-drink default, by-person toggle
- Build SummaryPage with "Done" (archives to history)

### Phase 4: Regulars
- Build RegularsPicker (favourite drink picker on tap)
- Build RegularEditor (multiple favourites)
- Build RegularsPage (groups as nice-to-have)

### Phase 5: PWA
- Configure vite-plugin-pwa in vite.config.ts
- Add icons to public/
- Build ReloadPrompt component

### Phase 6: Polish
- Animations (button press scale, order slide-in)
- Haptic feedback
- "Same again" flow refinement
- Test installability + offline

## Verification
1. `npm run dev` - app loads, full drink database visible with subcategories
2. Type name + tap drink = order added, name clears
3. Tap a drink without a name → name input shakes/focuses (no empty orders)
4. Same person + same drink twice → quantity increments to 2
5. "Other" button = custom drink text input works
6. Navigate to `/summary` → by-drink view default, can toggle to by-person
7. Tap drinks on summary to tick them off (strikethrough + progress)
8. "Done" archives round to history, navigate back → empty round
9. Type a name from previous round = "same again" suggestion appears
10. Add a regular in `/regulars` with 2-3 favourite drinks
11. Tap regular quick-add on main screen → favourite picker shown
12. `npm run build` → check PWA manifest in build output
13. Refresh after build → app works offline (service worker caches assets)
