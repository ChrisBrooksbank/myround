# Ordering Flow

## Overview

The core "shout across the room" ordering experience: type a name, tap a drink, order added instantly. Optimised for speed in noisy pub chaos with 8-15 people.

## User Stories

- As the round-taker, I want to type a name and tap a drink so that the order is captured instantly
- As the round-taker, I want the name field to auto-clear after adding a drink so I'm ready for the next person
- As the round-taker, I want same-person same-drink orders to auto-increment quantity so there are no duplicates
- As the round-taker, I want to see a live order list at the bottom so I know what's been added
- As the round-taker, I want to enter a custom drink when it's not on the list
- As the round-taker, I want "same again" suggestions when typing a name from a previous round

## Requirements

### Name Input
- [ ] Auto-focused text input at top of ordering screen
- [ ] Auto-clears after a drink is tapped (ready for next person)
- [ ] If no name entered and a drink is tapped, input shakes/highlights (no empty orders allowed)
- [ ] "Same again" suggestion: when typing a name that appeared in the last completed round, show their previous drink as a tappable suggestion

### Drink Selection
- [ ] Category tabs: Pints | Wine | Spirits | Cocktails | Soft | Shots | 0%
- [ ] Subcategory pills within each category (e.g. Pints > Lager | Ale | IPA | Stout | Cider | Half)
- [ ] Big tappable drink buttons (90px, emoji + label)
- [ ] Tapping a drink adds an order for the current name
- [ ] "Other..." button in each category for custom/free-text drinks
- [ ] Custom drink modal/input: type drink name, confirm, adds to order

### Order Deduplication
- [ ] Same person + same drink = quantity increments (not a duplicate line)
- [ ] Custom drinks with the same name for the same person also deduplicate

### Live Order List
- [ ] Displayed at bottom of the ordering screen
- [ ] Shows: person name, drink name, quantity (if >1)
- [ ] Delete button to remove an order line
- [ ] Quantity +/- controls on each order line

### Round Management
- [ ] Each round has a unique ID and creation timestamp
- [ ] Orders persist in localStorage while round is active
- [ ] Navigate to summary without losing data

## Acceptance Criteria

- [ ] Type "Dave" + tap "Peroni" = order line "Dave - Peroni" appears
- [ ] Name field clears and re-focuses after adding
- [ ] Tap "Peroni" again for Dave = quantity shows 2 (no duplicate line)
- [ ] Tap drink with empty name = name input shakes, no order added
- [ ] "Other..." opens custom input, typing "Craft IPA" adds it
- [ ] Order list shows all orders with delete and quantity controls
- [ ] Refreshing the page preserves the current round (localStorage)

## Out of Scope

- Summary/bar view (see summary-and-bar.md)
- Regulars quick-add (see regulars-and-groups.md)
- Drink database contents (see drinks-database.md)
- PWA/offline (see pwa-and-polish.md)
