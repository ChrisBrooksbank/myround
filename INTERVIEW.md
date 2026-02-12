# Interview Notes: MyRound Product Discovery

## Date: 2026-02-12
## Interviewee: Chris (product owner / primary user)

---

### Round 1: The Real Scenario

**Q: How does a typical round-taking go?**
- **A: Big table chaos** - 8-15 people shouting across a big table or beer garden, trying to remember it all at once
- Not a calm one-by-one scenario. This is noisy, fast, high-pressure.
- **Design implication**: Speed of input is absolutely critical. Every tap counts. Auto-clear, auto-focus, minimal friction.

**Q: Do people stick to their drink or switch mid-session?**
- **A: People switch mid-session** - after a few rounds people change what they're drinking. The "usual" is just a starting point.
- **Design implication**: Regulars feature should offer favourites as suggestions, not assumptions. The app can't just auto-order the same thing every time.

**Q: What happens at the bar?**
- **A: Read from phone at bar** - literally holding the phone up and reading the list to the barman.
- Wetherspoons is a common venue - but even at Spoons, Chris goes to the bar rather than using the Spoons app.
- **Design implication**: Summary screen is the most critical screen for readability. Large text, high contrast, dark background for dim pubs. The "by-drink" view is what you'd actually read out loud to a barman.

---

### Round 2: UX Priorities & Edge Cases

**Q: How should "same again" / second rounds work?**
- **A: Per-person "same again"** - when typing a name that was in the last round, offer to auto-fill their previous drink.
- Not a whole-round "same again" button (people switch drinks).
- **Design implication**: Need round history stored. When user types a name, check if that name appears in recent rounds and suggest their last drink. This is a per-person interaction, not a bulk action.

**Q: What about drinks not on the list?**
- **A: Must have custom/free-text drink** - the fixed list won't cover everything. Craft beers, specific cocktails, etc.
- **Design implication**: Add an "Other..." button to the drink grid that opens a simple text input. Custom drinks still need to be associated with a person and have quantity tracking.

**Q: Should completed rounds be saved or disposable?**
- **A: Keep history** - save completed rounds for looking back, "same again" functionality, and seeing patterns.
- **Design implication**: `completedAt` field on Round. History stored in localStorage. Powers the "same again" suggestion. Could show simple history view later.

---

### Round 3: Regulars, Groups & Audience

**Q: Should regulars have one usual or multiple favourites?**
- **A: Multiple favourites** - each regular should have 2-3 favourite drinks. Tapping their name shows a quick picker of their favourites.
- **Design implication**: `favouriteDrinkIds: string[]` array on Regular type (was single `usualDrinkId`). Quick-add button tap shows a small popover/picker with their favourites rather than instantly adding one drink.

**Q: How important are groups?**
- **A: Nice to have, not critical** - would use them eventually but individual regulars are more important first.
- **Design implication**: Still implement groups but spend less time on polish. Individual regulars are the priority. Groups can be simpler.

**Q: Personal tool or shareable product?**
- **A: Might share it** - if it's good, would tell mates. Should look polished and be self-explanatory.
- **Design implication**: Needs to be intuitive without instructions. Polished visual design. Not just a developer tool - needs to feel like a real product. First-time UX matters.

---

### Round 4: Summary Screen & Bar Experience

**Q: By-drink or by-person as default summary view?**
- **A: By-drink first** - "I order by drink type: 3 lagers, 2 G&Ts..." This is what you say to the barman.
- By-person is secondary - used for handing out drinks after ordering.
- **Design implication**: By-drink is the default tab/view on the summary page. By-person is accessible but secondary.

**Q: Should drinks be tick-off-able on the summary?**
- **A: Yes - tick off as I order** - tap each drink to mark it as ordered. Essential for big rounds.
- **Design implication**: `ordered: boolean` field on OrderLine. Tap to toggle strikethrough. Visual distinction between ordered and pending. Maybe a progress indicator ("7 of 12 ordered").

**Q: Visual theme preference?**
- **A: Dark pub theme is perfect** - dark background, warm colours, exactly what's wanted for dim pub reading.
- **Design implication**: Proceed with dark navy (#1a1a2e), red primary (#e94560), amber accent (#f5a623) as planned.

---

### Round 5: Feature Priorities & Drinks Database

**Q: Additional features from competitor research?**
- **A: Pre-build round before pub** - start building the round at home or in the taxi.
- **Design implication**: The app works without being "at the pub" - no location awareness needed. Just open it and start adding orders anytime.

**Q: Are the 5 drink categories right?**
- **A: Add Cocktails AND a much bigger database** - expects brand-level beers (Peroni, Estrella, Birra Moretti, Punk IPA, Neck Oil, Doom Bar etc.) not just "Lager". The original ~30 drinks is far too few.
- **Design implication**: Major expansion. ~80-100 drinks. New "Cocktails" category. Need subcategories for navigation.

**Q: Priority order for v1?**
- **A: Ship everything, no cuts** - the plan is lean enough, build it all.
- **Design implication**: No descoping. All features in the plan get built.

---

### Round 6: Drinks Database Deep Dive

**Q: How specific should the drinks database be?**
- **A: Brand-level for beers** - Peroni, Estrella, Birra Moretti, Neck Oil, Doom Bar, London Pride, Punk IPA, etc. Plus generic fallbacks.
- **Design implication**: Need ~15-20 beers/ciders by brand, plus generic options. Research common English pub taps.

**Q: How to navigate a bigger drink list?**
- **A: Subcategories** - e.g. Pints > Lager | Ale | Stout | Cider. Wine > Red | White | Rose | Sparkling. Nested navigation.
- **Design implication**: Two-level navigation: category tabs at top, subcategory pills below. Grid shows drinks for selected subcategory.

**Q: Any missing drink categories?**
- **A: Both cocktails AND 0% options** - Cocktails are huge (Espresso Martini, Aperol Spritz, etc.) and 0% is growing fast (Peroni 0.0, Guinness 0.0, etc.).
- **Design implication**: 7 categories total: Pints | Wine | Spirits | Cocktails | Soft | Shots | 0%

---

### Bonus: Wetherspoons Context

**Q: Does being a regular Spoons-goer change anything?**
- **A: Still goes to the bar at Spoons** - doesn't use the Spoons app for ordering, still queues up.
- **Design implication**: MyRound is bar-focused, not table-ordering. The summary screen is designed for reading out to a barman, not for digital submission. This is about human-to-human ordering with a memory aid.

---

## Summary of Plan Changes Required

| Area | Original Plan | Updated After Interview |
|---|---|---|
| Drinks database | ~30 generic drinks | ~80-100 brand-level drinks |
| Categories | 5 (Pints, Wine, Spirits, Soft, Shots) | 7 (+Cocktails, +0%) |
| Navigation | Single-level category tabs | Two-level: category + subcategory |
| Regular's drink | Single `usualDrinkId` | Array `favouriteDrinkIds` |
| Regular quick-add | One tap = instant order | One tap = favourite picker |
| Same again | Not in plan | Per-person suggestion from history |
| Custom drinks | Not in plan | "Other..." free-text button |
| Round history | Disposable (clear on done) | Persisted to localStorage |
| Summary tick-off | Read-only list | Tap to strikethrough/tick |
| Summary default | No default specified | By-drink first |
| Groups | Core feature | Nice-to-have (still build) |
| Pre-build round | Not in plan | Supported (no location needed) |
| Audience | Personal tool | Shareable - polished UX matters |
