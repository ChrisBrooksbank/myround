# Drinks Database

## Overview

A comprehensive UK pub drinks database (~80-100 drinks) with categories and subcategories. Brand-level beers, popular spirits, cocktails, and 0% options.

## User Stories

- As the round-taker, I want a comprehensive list of common UK pub drinks so I rarely need the "Other" option
- As the round-taker, I want drinks organised by category and subcategory so I can find them quickly
- As the round-taker, I want recognisable brand names (Peroni, Guinness, Doom Bar) not just generic types

## Requirements

### Data Structure
- [ ] Each drink has: id, name, shortName, emoji, category, subcategory
- [ ] DrinkCategory type: 'pints' | 'wine' | 'spirits' | 'cocktails' | 'soft' | 'shots' | 'zero'
- [ ] Stored in src/data/drinks.ts as a static array

### Categories and Drinks

#### Pints (subcategories: Lager, Ale, IPA, Stout, Cider, Half)
- [ ] Lager: Peroni, Estrella, Birra Moretti, Carling, Fosters, Heineken, San Miguel, Madri, Prawns, generic Lager
- [ ] Ale: Doom Bar, London Pride, Hobgoblin, Old Speckled Hen, Bombardier, generic Bitter
- [ ] IPA: Punk IPA, Neck Oil, Elvis Juice, Lagunitas, Greene King IPA, generic IPA
- [ ] Stout: Guinness, Murphy's, generic Stout
- [ ] Cider: Strongbow, Thatchers Gold, Thatchers Haze, Magners, Aspall, Old Rosie, generic Cider
- [ ] Half: Half Lager, Half Cider, Half Bitter

#### Wine (subcategories: Red, White, Rose, Sparkling)
- [ ] Red: Red Wine, Merlot, Shiraz, Pinot Noir, Malbec
- [ ] White: White Wine, Pinot Grigio, Sauvignon Blanc, Chardonnay
- [ ] Rose: Rose Wine
- [ ] Sparkling: Prosecco, Champagne

#### Spirits (no subcategories needed - flat list)
- [ ] G&T, Double G&T, Vodka Coke, Vodka Lemonade, Rum & Coke, JD & Coke, Whisky, Brandy, Amaretto, Southern Comfort & Lemonade

#### Cocktails (no subcategories needed - flat list)
- [ ] Espresso Martini, Aperol Spritz, Mojito, Pornstar Martini, Margarita, Long Island Iced Tea, Pina Colada, Cosmopolitan, Old Fashioned, Negroni

#### Soft (no subcategories needed - flat list)
- [ ] Coke, Diet Coke, Lemonade, OJ, Lime & Soda, Water, Tonic Water, Appletiser, J2O

#### Shots (no subcategories needed - flat list)
- [ ] Sambuca, Tequila, Jagerbomb, Baby Guinness, Fireball

#### 0% / Low Alcohol (no subcategories needed - flat list)
- [ ] Peroni 0.0, Guinness 0.0, Heineken 0.0, Erdinger Alkoholfrei, Lucky Saint, Nosecco, Becks Blue

### Category Styling
- [ ] Each category has a distinct colour: Pints=amber, Wine=red, Spirits=purple, Cocktails=pink, Soft=cyan, Shots=orange, 0%=green
- [ ] Emojis for each drink (beer mug, wine glass, cocktail glass, etc.)

## Acceptance Criteria

- [ ] ~80-100 drinks in the database
- [ ] All 7 categories populated
- [ ] Subcategories work for Pints and Wine
- [ ] Every drink has an emoji
- [ ] Category tabs show correct drinks
- [ ] Subcategory pills filter correctly within a category

## Out of Scope

- User-added permanent drinks (custom drinks are per-order only)
- Drink images/photos (emoji only)
- Price tracking
- Venue-specific menus
