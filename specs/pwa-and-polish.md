# PWA & Polish

## Overview

Make MyRound installable, offline-capable, and polished enough to share with mates. Dark pub theme, animations, haptic feedback, and a first-class mobile experience.

## User Stories

- As the round-taker, I want to install the app on my phone's home screen so it feels like a native app
- As the round-taker, I want the app to work offline so I can use it even with poor pub WiFi
- As the round-taker, I want the dark theme so the screen is readable in a dim pub
- As the round-taker, I want the app to feel responsive and polished so I'm not embarrassed showing it to mates

## Requirements

### PWA Configuration
- [ ] vite-plugin-pwa configured in vite.config.ts
- [ ] Web app manifest with name, icons, theme colour, background colour
- [ ] App icons in public/ directory (192px, 512px minimum)
- [ ] Service worker for offline asset caching
- [ ] ReloadPrompt component for update notifications
- [ ] Works offline after first load (all assets cached)

### Dark Pub Theme
- [ ] Dark navy background: #1a1a2e
- [ ] Warm red primary: #e94560
- [ ] Amber accent: #f5a623
- [ ] Category colours: Pints=amber, Wine=red, Spirits=purple, Cocktails=pink, Soft=cyan, Shots=orange, 0%=green
- [ ] CSS custom properties for all theme values
- [ ] High contrast text for readability
- [ ] Summary page: extra-large text for dim pub reading

### Touch & Interaction
- [ ] Large touch targets: 90px drink buttons minimum
- [ ] Haptic feedback: 30ms vibrate on drink taps (navigator.vibrate)
- [ ] Button press scale animation (subtle scale-down on press)
- [ ] Order slide-in animation when new orders are added
- [ ] Smooth transitions between pages

### Navigation
- [ ] Header/nav bar with app title and navigation
- [ ] Round count badge showing number of drinks in current round
- [ ] Three pages: / (round), /summary, /regulars
- [ ] react-router-dom for routing

### Mobile-First Design
- [ ] Designed for phone viewport (360-428px width)
- [ ] No horizontal scrolling
- [ ] Appropriate spacing for thumb reach
- [ ] Keyboard doesn't obscure content when name input is focused

## Acceptance Criteria

- [ ] App is installable from browser (shows install prompt or can add to home screen)
- [ ] App works offline after first visit
- [ ] Dark theme throughout with specified colours
- [ ] Drink buttons are large and easy to tap
- [ ] Haptic buzz felt when tapping drinks on supported devices
- [ ] Animations are smooth (no jank)
- [ ] App looks polished enough to show to friends
- [ ] Summary text is readable in a dim room

## Out of Scope

- Desktop/tablet optimisation (mobile-first, may work on larger screens but not priority)
- Dark/light theme toggle (dark only)
- Push notifications
- Backend/cloud sync
