# UI Improvements - MyRound PWA

> Expert UI/UX review based on Playwright screenshots (Chromium) across all pages, states, and viewport sizes, plus full CSS code review.
>
> **Priority key:** P0 = Critical (broken UX), P1 = High (significantly hurts usability/beauty), P2 = Medium (polish), P3 = Low (nice-to-have)

---

## 1. Layout & Visual Structure

### 1.1 Drink grid not rendering as a grid — P0
**Page:** Round Page (all categories)
**What:** Drinks appear as an inline horizontal flow rather than a tappable grid of cards. The `drink-button` elements are rendered without visible card boundaries, shadows, or grid structure. The emoji + label layout is barely visible.
**Expected:** A clear grid of drink "tiles" — bordered cards with emoji prominently displayed and label beneath, arranged in rows of 3-4 on mobile.
**Fix:** Verify `display: grid` on `.drink-grid` is actually applied. The `minmax(90px, 1fr)` grid may need explicit `width: 100%` on the container. Add `box-shadow` or visible `background-color` contrast to `.drink-button` to make each tile distinct from the dark background.

### 1.2 Order items render flat — missing card treatment — P0
**Page:** Round Page (Current Order section)
**What:** Order items (Alice/Peroni, Bob/Guinness, etc.) appear as plain text lines with tiny `-2+` controls and a trash emoji. No card boundaries, no visual separation between items.
**Expected:** Each order should be a clearly defined card with a subtle background, proper padding, the person's name and drink on separate lines, and well-sized +/- buttons.
**Fix:** `.order-item` has the CSS for this (`background-color`, `border-radius`, `border`, `padding`). Check that the class is being applied. The `gap` and `padding` values in the CSS look correct — this may be a specificity or class-name mismatch issue.

### 1.3 Category tabs run together — no visual separation — P1
**Page:** Round Page
**What:** "PintsWineSpiritsCocktailsSoftShots0%" renders as one continuous string of text with no spacing, borders, or pill shapes.
**Expected:** Each category should be a distinct pill/chip with border, padding, and the active category highlighted in its accent colour.
**Fix:** Same as above — `.category-tab` has proper CSS defined but isn't rendering. Debug whether class names match between JSX and CSS.

### 1.4 Subcategory pills run together — P1
**Page:** Round Page (Pints → Lager/Ale/IPA/Stout/Cider/Half)
**What:** "LagerAleIPAStoutCiderHalf" renders with no spacing or pill styling.
**Expected:** Rounded pill buttons with the active one highlighted in primary colour.

### 1.5 Nav tabs lack spacing — P1
**Page:** All pages (Header)
**What:** "OrderSummary7Regulars" runs together as a single coloured string. The badge count (7) has no pill background.
**Expected:** Three distinct nav items with spacing, and the badge count in a coloured pill.

### 1.6 Modals render inline instead of overlaying — P1
**Page:** Regulars Page (Add Regular, Edit Regular, Create Group modals)
**What:** Modals appear pushed below the page content rather than as a centered overlay. The modal content scrolls into view at the bottom of a full-page screenshot.
**Expected:** Modals should overlay the page with a dark backdrop, centred on screen.
**Fix:** `.modal-overlay` uses `position: fixed` which should work. Check if the modal is rendered outside the scrollable container. May need a React portal to render modals at the document root.

---

## 2. Visual Design & Beauty

### 2.1 Add subtle glassmorphism to cards — P2
**What:** The current card style (`.order-section`, `.regular-card`, `.summary-item`) uses flat solid backgrounds with thin borders. This looks functional but not beautiful.
**Suggestion:** Add a subtle glass effect:
```css
background: rgba(22, 33, 62, 0.7);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.08);
```

### 2.2 Add gradient accent to header — P2
**What:** The header is a flat `#16213e` block.
**Suggestion:** A subtle gradient bottom border or a thin accent line:
```css
.header {
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(90deg, var(--color-primary), var(--color-accent)) 1;
}
```

### 2.3 Drink button hover/tap state — enhance feedback — P2
**What:** Drink buttons have `translateY(-2px)` on hover and `scale(0.95)` on active. These are subtle.
**Suggestion:** Add a coloured glow on hover matched to category:
```css
.drink-button:hover {
  box-shadow: 0 0 20px rgba(var(--category-rgb), 0.2);
}
```

### 2.4 Category tab active state — add filled background — P2
**What:** Active category tabs only change border/text colour. The tab doesn't feel "selected."
**Suggestion:** Add a subtle tinted background for the active state:
```css
.category-tab.active {
  background-color: rgba(var(--category-rgb), 0.12);
}
```

### 2.5 Progress bar — add gradient and animation — P2
**Page:** Summary Page
**What:** The progress bar is a flat green fill.
**Suggestion:** Make it more visually rewarding:
```css
.summary-progress-fill {
  background: linear-gradient(90deg, var(--color-success), #58d68d);
  box-shadow: 0 0 8px rgba(46, 204, 113, 0.4);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 2.6 Empty states — add illustrations or large emoji — P2
**Page:** Summary (empty), Regulars (empty), Order List (hidden)
**What:** Empty states show plain text. These are missed opportunities for delight.
**Suggestion:** Add a large centred emoji and more styled text:
- Order list empty: Show a subtle `🍺 Start adding drinks!` prompt
- Summary empty: `📋 No drinks in this round yet`
- Regulars empty: `👥 Add your mates for quick ordering`

### 2.7 Add a pulsing dot to active nav item — P3
**What:** Active nav link uses colour change only.
**Suggestion:** Add a small animated dot below the active tab for stronger visual anchoring.

### 2.8 Rounded emoji display — P3
**What:** Drink emojis sit directly on the card background.
**Suggestion:** Wrap each emoji in a subtle circular container with a category-tinted background for a more polished look.

---

## 3. Usability & Speed

### 3.1 Search/filter drinks — P1
**What:** 126 drinks across 7 categories with no search. Users must know which category a drink belongs to.
**Fix:** Add a search input above the drink grid that filters across all categories. Show matching drinks instantly as you type (2+ chars).

### 3.2 Recently ordered drinks — P1
**What:** No way to quickly reorder a popular drink. Users must navigate categories each time.
**Suggestion:** Add a "Recent" pseudo-category (or a row above the grid) showing the last 5-8 unique drinks ordered, pulled from round history.

### 3.3 Order list — show when empty with helper text — P1
**Page:** Round Page
**What:** The Current Order section is completely hidden when empty. New users don't know where orders will appear.
**Fix:** Always show the "Current Order" section with an empty state message like "Tap a drink to start the round."

### 3.4 Name input — "Same Again" is too subtle — P2
**What:** The "Same again?" suggestion only appears after typing 2+ characters of a known name. A user typing fast will miss it.
**Fix:** Show it more prominently — perhaps as a chip row below the input showing recent names, each with their last drink.

### 3.5 Undo for order removal — P2
**What:** Deleting an order is instant and permanent. No undo.
**Fix:** Show a toast notification "Removed Alice's Peroni" with an "Undo" button (auto-dismiss after 3s).

### 3.6 Swipe to delete on order items — P2
**What:** Delete requires tapping a small trash button.
**Suggestion:** Add swipe-left-to-delete gesture for faster order management (keep the button too for accessibility).

### 3.7 Batch add from regulars — needs feedback — P2
**What:** Tapping a group button (e.g. "Friday Crew") adds drinks instantly but gives no clear visual feedback of what was added.
**Fix:** Show a brief toast: "Added 3 drinks for Friday Crew" with the list.

### 3.8 Summary page — tap target for tick-off is too small — P2
**Page:** Summary Page
**What:** The entire summary card is tappable, but there's no obvious checkbox or toggle UI. Users don't know to tap it.
**Fix:** Add a visible checkbox or circle on the left of each summary item. Show a checkmark when ordered.

### 3.9 Summary — show individual quantities clearer — P2
**Page:** Summary Page (By Drink view)
**What:** "2xPeroni" runs together. The quantity prefix is the same colour/weight as the drink name.
**Fix:** Style the quantity badge distinctly — perhaps in a coloured circle or with a different font weight/colour.

---

## 4. Responsive & Mobile

### 4.1 No landscape orientation handling — P2
**What:** All layouts assume portrait. In landscape, the drink grid area gets squished to almost nothing because header + name input + category tabs consume most vertical space.
**Fix:** In landscape mode, consider a two-column layout (drink selection on left, current order on right) or collapse the header to a single-line compact mode.

### 4.2 Tablet (768px+) — wasted space — P2
**Page:** All pages at 768px
**What:** The 428px `max-width` means the app is a narrow column on tablets with huge dark margins.
**Fix:** Either increase the max-width at tablet breakpoints or add a subtle background pattern/illustration in the margins. Consider a 2-column layout at tablet: drink grid + order list side by side.

### 4.3 Small phone (360px) — regulars picker clips — P2
**Page:** Round Page at 360px
**What:** The regulars picker horizontal scroll works but the last item may be partially hidden with no visual affordance that it scrolls.
**Fix:** Add a fade-out gradient on the trailing edge to hint at scrollability:
```css
.regulars-picker::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 32px;
  background: linear-gradient(to right, transparent, var(--color-bg-primary));
  pointer-events: none;
}
```

### 4.4 PWA install prompt — none exists — P2
**What:** The app relies on the browser's default install banner which is easy to miss.
**Fix:** Add a custom "Add to Home Screen" prompt after the user has used the app 2-3 times.

---

## 5. Accessibility

### 5.1 No modal focus trap — P1
**What:** When a modal opens, focus can tab to elements behind the overlay. This is confusing for keyboard and screen reader users.
**Fix:** Implement focus trapping within modals. On open, focus the first interactive element. On close, restore focus to the trigger.

### 5.2 No aria-live regions for dynamic updates — P1
**What:** When a drink is added to the order, there's no screen reader announcement. The order list just silently updates.
**Fix:** Add `aria-live="polite"` to the order list container, or announce additions via a visually-hidden live region.

### 5.3 No reduced-motion support — P2
**What:** Animations play regardless of user preference. Users with vestibular disorders may find shake/slide animations uncomfortable.
**Fix:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5.4 No skip-to-content link — P2
**What:** Keyboard users must tab through all nav links before reaching page content.
**Fix:** Add a visually-hidden skip link as the first focusable element: `<a href="#main" class="visually-hidden">Skip to content</a>`.

### 5.5 Disabled buttons give no explanation — P2
**What:** The "Add" button on the regular editor is disabled when invalid, but there's no tooltip or message explaining why.
**Fix:** Add helper text below the button: "Enter a name and select at least 1 drink" (shown when button is disabled).

---

## 6. Animations & Delight

### 6.1 Drink selection animation — P2
**What:** Drinks just get added to the order list with a slideIn. The drink button itself has no "selected" animation.
**Suggestion:** Add a brief "pop" animation on the drink button when tapped:
```css
@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
```

### 6.2 Order completion celebration — P3
**Page:** Summary Page
**What:** When all drinks are marked as ordered (100% progress), nothing special happens.
**Suggestion:** Add a subtle confetti burst or a green checkmark animation when the round is complete.

### 6.3 Page transitions — P3
**What:** Page navigation is instant with no transition.
**Suggestion:** Add subtle crossfade transitions between pages (100-200ms).

### 6.4 Counter animation — P3
**What:** The badge count on the Summary tab updates instantly.
**Suggestion:** Add a brief scale bounce when the count changes to draw attention.

---

## 7. Polish & Consistency

### 7.1 Button class consolidation — P2
**What:** Multiple button patterns: `.modal-button`, `.editor-button-secondary`, `.add-regular-button`, `.add-group-button`, `.done-button`, `.quantity-button`, etc. These duplicate similar styling.
**Fix:** Create a base `.btn` class with size modifiers (`.btn-sm`, `.btn-lg`) and colour variants (`.btn-primary`, `.btn-danger`, `.btn-secondary`, `.btn-accent`).

### 7.2 Consistent border widths — P3
**What:** Mix of `1px` and `2px` borders across components. Cards use `2px`, order items use `1px`, chips use `1px`.
**Fix:** Standardise on `1px` for contained elements and `2px` for top-level cards and interactive controls.

### 7.3 Shadow usage is inconsistent — P3
**What:** Shadow custom properties are defined (`--shadow-sm`, `--shadow-md`, `--shadow-lg`) but rarely used in component CSS. Most cards are flat.
**Fix:** Apply `--shadow-sm` to cards, `--shadow-md` to modals, and `--shadow-lg` to the floating reload prompt. This adds depth and visual hierarchy.

### 7.4 Colour hardcoding — P3
**What:** Some colours are hardcoded instead of using CSS variables (e.g., `.editor-delete-button` uses `#e74c3c` directly, `.done-button:hover` uses `#27ae60`).
**Fix:** Replace with `var(--color-danger)` and `var(--color-success)` equivalents.

---

## 8. Missing Features for Delight

### 8.1 Light/dark theme toggle — P3
**What:** Only dark theme exists. The CSS variable architecture would make a light theme straightforward.
**Suggestion:** Add a theme toggle (moon/sun icon) in the header. Define a `[data-theme="light"]` override set for the CSS custom properties.

### 8.2 Drink count badge on individual drink buttons — P3
**What:** Once a drink is in the order, there's no indication on the grid that it's already ordered.
**Suggestion:** Show a small count badge on the drink button if that drink is already in the current round.

### 8.3 Haptic feedback fallback — P3
**What:** `navigator.vibrate(30)` is used for haptic feedback but silently fails when not supported.
**Suggestion:** Add a brief visual pulse (border flash or scale) as a fallback when vibration isn't available.

---

## Summary of Priorities

| Priority | Count | Description |
|----------|-------|-------------|
| **P0** | 2 | Broken: drink grid layout, order item layout |
| **P1** | 7 | High impact: nav tabs, category pills, modal overlay, focus trap, aria-live, drink search, show empty order |
| **P2** | 18 | Polish: glassmorphism, gradients, undo, responsive, animations |
| **P3** | 8 | Nice-to-have: theme toggle, confetti, page transitions, badges |

---

*Generated from Playwright Chromium screenshots (22 captures across all pages, states, and viewports 360px-768px) + full CSS code review.*
*Screenshots saved in `./screenshots/` for reference.*
