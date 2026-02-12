# Summary & Bar Experience

## Overview

The screen you read from at the bar. Shows the round grouped by drink (for ordering) or by person (for handing out). Tap to tick off drinks as you order them.

## User Stories

- As the round-taker, I want to see all drinks grouped by type so I can read the order to the barman efficiently
- As the round-taker, I want to toggle to a by-person view so I know who gets what when handing out drinks
- As the round-taker, I want to tick off drinks as I order them so I don't lose track
- As the round-taker, I want to see a progress indicator so I know how many drinks are left to order
- As the round-taker, I want to mark a round as "Done" to archive it and start fresh

## Requirements

### By-Drink View (Default)
- [ ] Groups orders by drink: "3x Peroni (Dave x2, Chris), 1x Guinness (Tom)..."
- [ ] This is the default view when navigating to /summary
- [ ] Large, high-contrast text for reading in dim pub lighting
- [ ] Dark background matching pub theme

### By-Person View
- [ ] Toggle button to switch between by-drink and by-person
- [ ] Shows: "Dave: Peroni x2. Chris: Peroni, G&T. Tom: Guinness."
- [ ] Same large text, high contrast styling

### Tick-Off / Progress
- [ ] Tap any drink/order line to mark as ordered (strikethrough visual)
- [ ] Tap again to un-mark (toggle)
- [ ] Progress indicator: "7 of 12 ordered" or similar
- [ ] Ordered state persists (saved to localStorage)

### Done / Archive
- [ ] "Done" button at bottom of summary
- [ ] Archives the current round to history (sets completedAt timestamp)
- [ ] Navigates back to main screen with empty round
- [ ] Archived round available for "same again" lookups

## Acceptance Criteria

- [ ] Navigate to /summary shows by-drink grouped view
- [ ] Text is large and readable in dim lighting (extra-large font size)
- [ ] Toggle switches to by-person view
- [ ] Tapping a drink line adds strikethrough
- [ ] Progress counter updates as drinks are ticked off
- [ ] "Done" archives round, navigates to / with empty state
- [ ] Starting a new round after "Done", typing a name from previous round triggers "same again"

## Out of Scope

- Ordering flow (see ordering-flow.md)
- Payment tracking or splitting
- Sending the order digitally to a bar
