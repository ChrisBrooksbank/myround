# MyRound Bug Report

Generated: 2026-02-12

---

## CRITICAL

### BUG-1: Cannot edit a Regular's name (form resets on every keystroke)

- **File:** `src/components/RegularEditor.tsx:28-36`
- **Description:** The `useEffect` that initializes form state includes `existingRegular` in its dependency array. However, `existingRegular` is derived on line 16 via `regulars.find(r => r.id === regularId)`, which creates a new object reference on every render. When the user types in the name field, `setName()` triggers a re-render, `regulars.find()` returns a new object, the effect fires again, and `setName(existingRegular.name)` resets the input back to the original value. The name field is effectively locked -- edits snap back immediately.
- **Steps to reproduce:**
  1. Go to Regulars page
  2. Add a regular with name "Dave" and a favourite drink
  3. Click Edit on Dave's card
  4. Try to change the name to "David"
  5. Observe: each keystroke is immediately reverted
- **Expected:** Form should initialize once when opened. User edits should be preserved until Save/Cancel.
- **Fix:** Remove `existingRegular` from the dependency array; depend only on `regularId`. Or capture the initial values with a ref.

---

### BUG-2: Cannot edit a Group's name (same root cause as BUG-1)

- **File:** `src/components/GroupEditor.tsx:25-33`
- **Description:** Identical to BUG-1. `existingGroup` is derived via `groups.find(g => g.id === groupId)` on every render, creating a new reference each time. Including it in the `useEffect` dependency array causes the form to reset on every render, making group name editing impossible.
- **Steps to reproduce:**
  1. Go to Regulars page
  2. Create a group "Friday Crew" with some members
  3. Click Edit on Friday Crew
  4. Try to change the name to "Saturday Crew"
  5. Observe: name snaps back to "Friday Crew" on each keystroke
- **Expected:** Form should initialize once when the modal opens. Subsequent edits should be preserved.
- **Fix:** Remove `existingGroup` from the dependency array; depend only on `groupId`.

---

## HIGH

### BUG-3: `completeRound` archives stale data from localStorage instead of current React state

- **File:** `src/hooks/useRound.tsx:121-122`, `src/lib/storage.ts:62-75`
- **Description:** `completeRound()` calls `archiveCurrentRound()` which reads the round from localStorage via `getCurrentRound()`. The latest React state is synced to localStorage via a `useEffect` (line 49-51), which runs asynchronously after render. If the user toggles tick-off states or changes quantities and immediately hits "Done", the most recent state changes may not yet be flushed to localStorage. The archived round will contain stale data, causing "same again" suggestions to reference incorrect drinks.
- **Steps to reproduce:**
  1. Add several drinks to a round
  2. Go to Summary, tick off some drinks
  3. Immediately tap "Done"
  4. Start a new round and type a name from the previous round
  5. The "same again" suggestion may reference incorrect data
- **Expected:** The archived round should always reflect the exact current React state at the moment "Done" is pressed.
- **Fix:** Pass the current `round` state directly to the archive function instead of reading from localStorage. E.g. `archiveRound(round)` rather than `archiveCurrentRound()`.

---

## MEDIUM

### BUG-4: Initial load shows all 34 pints instead of auto-selecting first subcategory (Lager)

- **File:** `src/components/DrinkGrid.tsx:24-25, 32-34`
- **Description:** `selectedSubcategory` initializes to `''` (empty string). The display logic on line 32 is `hasSubcategories && selectedSubcategory` -- since `''` is falsy, the condition evaluates to false and `getDrinksByCategory(selectedCategory)` is called, returning all 34 pints across all subcategories (Lager, Ale, IPA, Stout, Cider, Half). The `handleCategoryChange` function correctly auto-selects the first subcategory, but this only fires when the user switches categories, not on initial mount.
- **Steps to reproduce:**
  1. Open the app fresh (or refresh the page)
  2. Observe the Pints category is selected with all 34 drink buttons visible
  3. Click on Wine, then click back on Pints
  4. Now only the Lager subcategory drinks (10) are shown correctly
- **Expected:** On initial render, the first subcategory (Lager) should be auto-selected, showing only ~10 lager drinks.
- **Fix:** Initialize `selectedSubcategory` to the first subcategory of the default category: `useState<string>(getSubcategories('pints')[0] || '')`.

---

### BUG-5: Header badge shows order line count instead of total drink quantity

- **File:** `src/components/Header.tsx:10`
- **Description:** The badge displays `round.orders.length`, which is the number of distinct order lines. If Dave orders "Peroni x3", that is one order line but 3 drinks. The badge shows `1` instead of `3`. The spec (`specs/pwa-and-polish.md`, line 42) says "Round count badge showing number of drinks in current round".
- **Steps to reproduce:**
  1. Add "Dave - Peroni"
  2. Badge shows 1 (correct so far)
  3. Tap the + button on the order to increase quantity to 3
  4. Badge still shows 1 instead of 3
- **Expected:** Badge should show total drink quantity: `round.orders.reduce((sum, o) => sum + o.quantity, 0)`.
- **Fix:** Replace `round.orders.length` with `round.orders.reduce((sum, o) => sum + o.quantity, 0)`.

---

### BUG-6: View toggle buttons both call the same toggle function -- clicking active button switches away

- **File:** `src/pages/SummaryPage.tsx:20-21, 28-39`
- **Description:** Both the "By Drink" and "By Person" buttons call `handleToggleView`, which simply flips the current state: `setViewMode(prev => prev === 'by-drink' ? 'by-person' : 'by-drink')`. This means clicking the already-active button switches to the other view. For example, clicking "By Drink" when already viewing by-drink switches to by-person, which is counterintuitive.
- **Steps to reproduce:**
  1. Go to Summary page (defaults to "By Drink" view)
  2. Click the "By Drink" button (the one that is already active/highlighted)
  3. Observe: view switches to "By Person" unexpectedly
- **Expected:** Each button should set its specific view mode. Clicking the active button should be a no-op.
- **Fix:** Replace `handleToggleView` with direct setters: `onClick={() => setViewMode('by-drink')}` and `onClick={() => setViewMode('by-person')}`.

---

### BUG-7: Missing `.app` and `.main-content` CSS breaks flex layout chain

- **File:** `src/App.tsx:17-19`, `src/App.css`
- **Description:** The `<div className="app">` and `<main className="main-content">` elements have no corresponding CSS rules. The intended flex chain is `#root → .app → .main-content → page`, but without `display: flex; flex-direction: column; flex: 1` on `.app` and `.main-content`, the chain is broken. Page components use `flex: 1` (e.g. `.round-page`, `.summary-page`) but this has no effect because their flex container ancestors don't propagate the full-height layout. This causes the summary page's sticky "Done" footer to not stick to the viewport bottom when there are few orders.
- **Steps to reproduce:**
  1. Add just 1-2 drinks to a round
  2. Navigate to Summary page
  3. Observe: the "Done" button may not be pinned to the bottom of the viewport; there is dead space below it
- **Expected:** The `.app` div should have `display: flex; flex-direction: column; flex: 1` and `.main-content` should have `display: flex; flex-direction: column; flex: 1` to maintain the flex chain from `#root` through to the page components.
- **Fix:** Add CSS rules for `.app` and `.main-content` with proper flex properties.

---

## LOW

### BUG-8: Stale closure in NameInput useEffect cleanup

- **File:** `src/components/NameInput.tsx:25-37`
- **Description:** The `useEffect` cleanup function references `inputRef.current` directly. By the time cleanup runs (on re-render or unmount), `inputRef.current` may have changed or be null. The React docs warn against this pattern. The event listener may not be properly removed, causing a memory leak.
- **Steps to reproduce:** Difficult to reproduce visually; this is a code-level issue that manifests as a memory leak under certain unmount/remount scenarios.
- **Expected:** Capture `inputRef.current` in a local variable at the top of the effect and use that variable in both setup and cleanup.
- **Fix:**
  ```typescript
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.addEventListener('animationend', handleAnimationEnd);
    return () => {
      el.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [shake]);
  ```

---

### BUG-9: Round history grows unbounded in localStorage

- **File:** `src/lib/storage.ts:56-60`
- **Description:** Every completed round is appended to the `myround_round_history` array in localStorage via `addToHistory()`, with no limit on entries. localStorage is typically limited to 5-10MB. After months of regular use, the history will eventually exceed this limit, causing `localStorage.setItem` to throw a `QuotaExceededError`. While `safeSave` catches the error, the history data is silently lost/corrupted since the save fails with no cleanup or pruning.
- **Steps to reproduce:** Use the app extensively over weeks/months, completing many rounds with many orders. Eventually localStorage quota is exceeded.
- **Expected:** History should be capped (e.g. last 50 rounds) with oldest entries pruned when adding new ones.
- **Fix:** Add a cap in `addToHistory()`:
  ```typescript
  export function addToHistory(round: Round): void {
    const history = getRoundHistory();
    history.push(round);
    while (history.length > 50) {
      history.shift();
    }
    saveRoundHistory(history);
  }
  ```
