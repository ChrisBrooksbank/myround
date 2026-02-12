# Regulars & Groups

## Overview

Save your regular drinking mates with their favourite drinks for one-tap ordering. Optionally group them ("Friday Crew", "Work Lot") for pre-filling rounds.

## User Stories

- As the round-taker, I want to save regulars with their favourite drinks so I can add their orders with minimal taps
- As the round-taker, I want to tap a regular's name and pick from their favourites so I don't need to type or search
- As the round-taker, I want to manage my regulars list (add, edit, delete) on a dedicated page
- As the round-taker, I want to create groups of regulars so I can pre-fill a whole crew's orders

## Requirements

### Regular Management (/regulars page)
- [ ] Add a new regular: name + 2-3 favourite drinks (picked from drink database)
- [ ] Edit an existing regular: change name or favourite drinks
- [ ] Delete a regular with confirmation
- [ ] List all regulars with their favourite drinks shown
- [ ] Drink picker for selecting favourites (search or browse)

### Quick-Add Bar (on main /round page)
- [ ] Row of regular buttons at top of the ordering screen
- [ ] Each button shows the regular's name
- [ ] Tapping a regular shows a small picker/popover of their 2-3 favourite drinks
- [ ] Tapping a favourite drink from the picker adds the order (regular's name + that drink)
- [ ] Picker dismisses after selection
- [ ] If the regular has only 1 favourite, skip the picker and add directly

### Groups (Nice-to-Have)
- [ ] Create a group with a name ("Friday Crew") and select members from regulars
- [ ] Edit/delete groups
- [ ] Tapping a group on the regulars page or main screen adds all members' first favourite drinks
- [ ] Individual overrides: after group pre-fill, can change any person's drink

### Persistence
- [ ] Regulars stored in localStorage
- [ ] Groups stored in localStorage
- [ ] Survives page refreshes and app restarts

## Acceptance Criteria

- [ ] Can add a regular "Dave" with favourites: Peroni, Guinness
- [ ] On main screen, tapping "Dave" shows Peroni and Guinness as options
- [ ] Tapping "Peroni" from the picker adds "Dave - Peroni" to the order
- [ ] Can edit Dave's favourites on /regulars page
- [ ] Can delete a regular
- [ ] Can create a group "Friday Crew" with Dave, Chris, Tom
- [ ] Regulars persist across page refreshes

## Out of Scope

- Syncing regulars across devices
- Importing contacts from phone
- Social features / sharing regulars
