// UK Pub Drinks Database
// ~150 drinks across 7 categories with subcategories for Pints and Wine

import type { Drink } from '../types';

export const drinks: Drink[] = [
  // ===== PINTS =====
  // Subcategory: Lager
  { id: 'peroni', name: 'Peroni', shortName: 'Peroni', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'estrella', name: 'Estrella', shortName: 'Estrella', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'birra-moretti', name: 'Birra Moretti', shortName: 'Moretti', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'carling', name: 'Carling', shortName: 'Carling', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'fosters', name: 'Fosters', shortName: 'Fosters', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'heineken', name: 'Heineken', shortName: 'Heineken', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'san-miguel', name: 'San Miguel', shortName: 'San Mig', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'madri', name: 'Madri', shortName: 'Madri', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'prawns', name: 'Prawns', shortName: 'Prawns', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'lager', name: 'Lager', shortName: 'Lager', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'stella-artois', name: 'Stella Artois', shortName: 'Stella', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'kronenbourg', name: 'Kronenbourg 1664', shortName: 'Kronenbourg', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'budweiser', name: 'Budweiser', shortName: 'Budweiser', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'bud-light', name: 'Bud Light', shortName: 'Bud Light', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'coors', name: 'Coors', shortName: 'Coors', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'carlsberg', name: 'Carlsberg', shortName: 'Carlsberg', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'camden-hells', name: 'Camden Hells', shortName: 'Camden', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'cruzcampo', name: 'Cruzcampo', shortName: 'Cruzcampo', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'asahi', name: 'Asahi', shortName: 'Asahi', emoji: '🍺', category: 'pints', subcategory: 'Lager' },
  { id: 'corona', name: 'Corona', shortName: 'Corona', emoji: '🍺', category: 'pints', subcategory: 'Lager' },

  // Subcategory: Ale
  { id: 'doom-bar', name: 'Doom Bar', shortName: 'Doom Bar', emoji: '🍺', category: 'pints', subcategory: 'Ale' },
  { id: 'london-pride', name: 'London Pride', shortName: 'Pride', emoji: '🍺', category: 'pints', subcategory: 'Ale' },
  { id: 'hobgoblin', name: 'Hobgoblin', shortName: 'Hobgoblin', emoji: '🍺', category: 'pints', subcategory: 'Ale' },
  { id: 'old-speckled-hen', name: 'Old Speckled Hen', shortName: 'Speckled', emoji: '🍺', category: 'pints', subcategory: 'Ale' },
  { id: 'bombardier', name: 'Bombardier', shortName: 'Bombardier', emoji: '🍺', category: 'pints', subcategory: 'Ale' },
  { id: 'bitter', name: 'Bitter', shortName: 'Bitter', emoji: '🍺', category: 'pints', subcategory: 'Ale' },
  { id: 'timothy-taylors-landlord', name: "Timothy Taylor's Landlord", shortName: 'Landlord', emoji: '🍺', category: 'pints', subcategory: 'Ale' },
  { id: 'newcastle-brown-ale', name: 'Newcastle Brown Ale', shortName: 'Newcastle', emoji: '🍺', category: 'pints', subcategory: 'Ale' },
  { id: 'abbot-ale', name: 'Abbot Ale', shortName: 'Abbot', emoji: '🍺', category: 'pints', subcategory: 'Ale' },
  { id: 'old-golden-hen', name: 'Old Golden Hen', shortName: 'Golden Hen', emoji: '🍺', category: 'pints', subcategory: 'Ale' },

  // Subcategory: IPA
  { id: 'punk-ipa', name: 'Punk IPA', shortName: 'Punk', emoji: '🍺', category: 'pints', subcategory: 'IPA' },
  { id: 'neck-oil', name: 'Neck Oil', shortName: 'Neck Oil', emoji: '🍺', category: 'pints', subcategory: 'IPA' },
  { id: 'elvis-juice', name: 'Elvis Juice', shortName: 'Elvis', emoji: '🍺', category: 'pints', subcategory: 'IPA' },
  { id: 'lagunitas', name: 'Lagunitas', shortName: 'Lagunitas', emoji: '🍺', category: 'pints', subcategory: 'IPA' },
  { id: 'greene-king-ipa', name: 'Greene King IPA', shortName: 'GK IPA', emoji: '🍺', category: 'pints', subcategory: 'IPA' },
  { id: 'ipa', name: 'IPA', shortName: 'IPA', emoji: '🍺', category: 'pints', subcategory: 'IPA' },

  // Subcategory: Stout
  { id: 'guinness', name: 'Guinness', shortName: 'Guinness', emoji: '🍺', category: 'pints', subcategory: 'Stout' },
  { id: 'murphys', name: "Murphy's", shortName: "Murphy's", emoji: '🍺', category: 'pints', subcategory: 'Stout' },
  { id: 'stout', name: 'Stout', shortName: 'Stout', emoji: '🍺', category: 'pints', subcategory: 'Stout' },
  { id: 'beamish', name: 'Beamish', shortName: 'Beamish', emoji: '🍺', category: 'pints', subcategory: 'Stout' },

  // Subcategory: Cider
  { id: 'strongbow', name: 'Strongbow', shortName: 'Strongbow', emoji: '🍺', category: 'pints', subcategory: 'Cider' },
  { id: 'thatchers-gold', name: 'Thatchers Gold', shortName: 'Thatchers', emoji: '🍺', category: 'pints', subcategory: 'Cider' },
  { id: 'thatchers-haze', name: 'Thatchers Haze', shortName: 'Haze', emoji: '🍺', category: 'pints', subcategory: 'Cider' },
  { id: 'magners', name: 'Magners', shortName: 'Magners', emoji: '🍺', category: 'pints', subcategory: 'Cider' },
  { id: 'aspall', name: 'Aspall', shortName: 'Aspall', emoji: '🍺', category: 'pints', subcategory: 'Cider' },
  { id: 'old-rosie', name: 'Old Rosie', shortName: 'Old Rosie', emoji: '🍺', category: 'pints', subcategory: 'Cider' },
  { id: 'cider', name: 'Cider', shortName: 'Cider', emoji: '🍺', category: 'pints', subcategory: 'Cider' },
  { id: 'strongbow-dark-fruit', name: 'Strongbow Dark Fruit', shortName: 'Dark Fruit', emoji: '🍺', category: 'pints', subcategory: 'Cider' },
  { id: 'inch', name: "Inch's", shortName: "Inch's", emoji: '🍺', category: 'pints', subcategory: 'Cider' },
  { id: 'stowford-press', name: 'Stowford Press', shortName: 'Stowford', emoji: '🍺', category: 'pints', subcategory: 'Cider' },
  { id: 'rekorderlig', name: 'Rekorderlig', shortName: 'Rekorderlig', emoji: '🍺', category: 'pints', subcategory: 'Cider' },
  { id: 'old-mout', name: 'Old Mout', shortName: 'Old Mout', emoji: '🍺', category: 'pints', subcategory: 'Cider' },
  { id: 'kopparberg', name: 'Kopparberg', shortName: 'Kopparberg', emoji: '🍺', category: 'pints', subcategory: 'Cider' },
  { id: 'bulmers', name: 'Bulmers', shortName: 'Bulmers', emoji: '🍺', category: 'pints', subcategory: 'Cider' },

  // Subcategory: Half
  { id: 'half-lager', name: 'Half Lager', shortName: 'Half Lager', emoji: '🍺', category: 'pints', subcategory: 'Half' },
  { id: 'half-cider', name: 'Half Cider', shortName: 'Half Cider', emoji: '🍺', category: 'pints', subcategory: 'Half' },
  { id: 'half-bitter', name: 'Half Bitter', shortName: 'Half Bitter', emoji: '🍺', category: 'pints', subcategory: 'Half' },
  { id: 'half-guinness', name: 'Half Guinness', shortName: 'Half Guin', emoji: '🍺', category: 'pints', subcategory: 'Half' },
  { id: 'half-ipa', name: 'Half IPA', shortName: 'Half IPA', emoji: '🍺', category: 'pints', subcategory: 'Half' },

  // ===== WINE =====
  // Subcategory: Red (red wine emoji 🍷)
  { id: 'red-wine', name: 'Red Wine', shortName: 'Red', emoji: '🍷', category: 'wine', subcategory: 'Red' },
  { id: 'merlot', name: 'Merlot', shortName: 'Merlot', emoji: '🍷', category: 'wine', subcategory: 'Red' },
  { id: 'shiraz', name: 'Shiraz', shortName: 'Shiraz', emoji: '🍷', category: 'wine', subcategory: 'Red' },
  { id: 'pinot-noir', name: 'Pinot Noir', shortName: 'Pinot Noir', emoji: '🍷', category: 'wine', subcategory: 'Red' },
  { id: 'malbec', name: 'Malbec', shortName: 'Malbec', emoji: '🍷', category: 'wine', subcategory: 'Red' },
  { id: 'cabernet-sauvignon', name: 'Cabernet Sauvignon', shortName: 'Cab Sauv', emoji: '🍷', category: 'wine', subcategory: 'Red' },
  { id: 'rioja', name: 'Rioja', shortName: 'Rioja', emoji: '🍷', category: 'wine', subcategory: 'Red' },

  // Subcategory: White (white wine emoji 🥂 — distinct from red)
  { id: 'white-wine', name: 'White Wine', shortName: 'White', emoji: '🥂', category: 'wine', subcategory: 'White' },
  { id: 'pinot-grigio', name: 'Pinot Grigio', shortName: 'Pinot Grigio', emoji: '🥂', category: 'wine', subcategory: 'White' },
  { id: 'sauvignon-blanc', name: 'Sauvignon Blanc', shortName: 'Sauv Blanc', emoji: '🥂', category: 'wine', subcategory: 'White' },
  { id: 'chardonnay', name: 'Chardonnay', shortName: 'Chardonnay', emoji: '🥂', category: 'wine', subcategory: 'White' },
  { id: 'riesling', name: 'Riesling', shortName: 'Riesling', emoji: '🥂', category: 'wine', subcategory: 'White' },

  // Subcategory: Rose (rose emoji 🌸 — distinct from red and white)
  { id: 'rose-wine', name: 'Rose Wine', shortName: 'Rose', emoji: '🌸', category: 'wine', subcategory: 'Rose' },
  { id: 'white-zinfandel', name: 'White Zinfandel', shortName: 'Zinfandel', emoji: '🌸', category: 'wine', subcategory: 'Rose' },
  { id: 'pinot-grigio-blush', name: 'Pinot Grigio Blush', shortName: 'PG Blush', emoji: '🌸', category: 'wine', subcategory: 'Rose' },

  // Subcategory: Sparkling
  { id: 'prosecco', name: 'Prosecco', shortName: 'Prosecco', emoji: '🍾', category: 'wine', subcategory: 'Sparkling' },
  { id: 'champagne', name: 'Champagne', shortName: 'Champagne', emoji: '🍾', category: 'wine', subcategory: 'Sparkling' },

  // ===== SPIRITS =====
  { id: 'gin-tonic', name: 'G&T', shortName: 'G&T', emoji: '🍸', category: 'spirits', subcategory: '' },
  { id: 'double-gin-tonic', name: 'Double G&T', shortName: 'Dbl G&T', emoji: '🍸', category: 'spirits', subcategory: '' },
  { id: 'gin-lemonade', name: 'Gin & Lemonade', shortName: 'G&L', emoji: '🍸', category: 'spirits', subcategory: '' },
  { id: 'vodka-coke', name: 'Vodka Coke', shortName: 'V&C', emoji: '🥃', category: 'spirits', subcategory: '' },
  { id: 'vodka-lemonade', name: 'Vodka Lemonade', shortName: 'V&L', emoji: '🥃', category: 'spirits', subcategory: '' },
  { id: 'vodka-orange', name: 'Vodka & Orange', shortName: 'V&O', emoji: '🥃', category: 'spirits', subcategory: '' },
  { id: 'vodka-redbull', name: 'Vodka Red Bull', shortName: 'V&RB', emoji: '🥃', category: 'spirits', subcategory: '' },
  { id: 'rum-coke', name: 'Rum & Coke', shortName: 'R&C', emoji: '🥃', category: 'spirits', subcategory: '' },
  { id: 'dark-rum-coke', name: 'Dark Rum & Coke', shortName: 'DR&C', emoji: '🥃', category: 'spirits', subcategory: '' },
  { id: 'bacardi-coke', name: 'Bacardi & Coke', shortName: 'Bac&C', emoji: '🥃', category: 'spirits', subcategory: '' },
  { id: 'jd-coke', name: 'JD & Coke', shortName: 'JD&C', emoji: '🥃', category: 'spirits', subcategory: '' },
  { id: 'jd-ginger', name: 'JD & Ginger', shortName: 'JD&G', emoji: '🥃', category: 'spirits', subcategory: '' },
  { id: 'whisky', name: 'Whisky', shortName: 'Whisky', emoji: '🥃', category: 'spirits', subcategory: '' },
  { id: 'whisky-ginger', name: 'Whisky & Ginger', shortName: 'W&G', emoji: '🥃', category: 'spirits', subcategory: '' },
  { id: 'brandy', name: 'Brandy', shortName: 'Brandy', emoji: '🥃', category: 'spirits', subcategory: '' },
  { id: 'amaretto', name: 'Amaretto', shortName: 'Amaretto', emoji: '🥃', category: 'spirits', subcategory: '' },
  { id: 'disaronno-coke', name: 'Disaronno & Coke', shortName: 'Dis&C', emoji: '🥃', category: 'spirits', subcategory: '' },
  { id: 'southern-comfort-lemonade', name: 'Southern Comfort & Lemonade', shortName: 'SC&L', emoji: '🥃', category: 'spirits', subcategory: '' },
  { id: 'malibu-coke', name: 'Malibu & Coke', shortName: 'Malibu&C', emoji: '🥃', category: 'spirits', subcategory: '' },
  { id: 'malibu-pineapple', name: 'Malibu & Pineapple', shortName: 'Malibu&P', emoji: '🥃', category: 'spirits', subcategory: '' },
  { id: 'archers-lemonade', name: 'Archers & Lemonade', shortName: 'Arch&L', emoji: '🥃', category: 'spirits', subcategory: '' },

  // ===== COCKTAILS =====
  { id: 'espresso-martini', name: 'Espresso Martini', shortName: 'Esp Mart', emoji: '🍸', category: 'cocktails', subcategory: '' },
  { id: 'aperol-spritz', name: 'Aperol Spritz', shortName: 'Aperol', emoji: '🍹', category: 'cocktails', subcategory: '' },
  { id: 'mojito', name: 'Mojito', shortName: 'Mojito', emoji: '🍹', category: 'cocktails', subcategory: '' },
  { id: 'pornstar-martini', name: 'Pornstar Martini', shortName: 'Pornstar', emoji: '🍸', category: 'cocktails', subcategory: '' },
  { id: 'margarita', name: 'Margarita', shortName: 'Margarita', emoji: '🍹', category: 'cocktails', subcategory: '' },
  { id: 'long-island', name: 'Long Island Iced Tea', shortName: 'Long Island', emoji: '🍹', category: 'cocktails', subcategory: '' },
  { id: 'pina-colada', name: 'Pina Colada', shortName: 'Pina Colada', emoji: '🍹', category: 'cocktails', subcategory: '' },
  { id: 'cosmopolitan', name: 'Cosmopolitan', shortName: 'Cosmo', emoji: '🍸', category: 'cocktails', subcategory: '' },
  { id: 'old-fashioned', name: 'Old Fashioned', shortName: 'Old Fash', emoji: '🥃', category: 'cocktails', subcategory: '' },
  { id: 'negroni', name: 'Negroni', shortName: 'Negroni', emoji: '🍸', category: 'cocktails', subcategory: '' },
  { id: 'daiquiri', name: 'Daiquiri', shortName: 'Daiquiri', emoji: '🍹', category: 'cocktails', subcategory: '' },
  { id: 'hugo-spritz', name: 'Hugo Spritz', shortName: 'Hugo', emoji: '🍹', category: 'cocktails', subcategory: '' },
  { id: 'limoncello-spritz', name: 'Limoncello Spritz', shortName: 'Limoncello', emoji: '🍹', category: 'cocktails', subcategory: '' },
  { id: 'sex-on-the-beach', name: 'Sex on the Beach', shortName: 'SOTB', emoji: '🍹', category: 'cocktails', subcategory: '' },
  { id: 'whisky-sour', name: 'Whisky Sour', shortName: 'Whisky Sour', emoji: '🍸', category: 'cocktails', subcategory: '' },

  // ===== SOFT =====
  { id: 'coke', name: 'Coke', shortName: 'Coke', emoji: '🥤', category: 'soft', subcategory: '' },
  { id: 'diet-coke', name: 'Diet Coke', shortName: 'Diet Coke', emoji: '🥤', category: 'soft', subcategory: '' },
  { id: 'coke-zero', name: 'Coke Zero', shortName: 'Coke Zero', emoji: '🥤', category: 'soft', subcategory: '' },
  { id: 'pepsi', name: 'Pepsi', shortName: 'Pepsi', emoji: '🥤', category: 'soft', subcategory: '' },
  { id: 'pepsi-max', name: 'Pepsi Max', shortName: 'Pepsi Max', emoji: '🥤', category: 'soft', subcategory: '' },
  { id: 'lemonade', name: 'Lemonade', shortName: 'Lemonade', emoji: '🥤', category: 'soft', subcategory: '' },
  { id: 'orange-juice', name: 'OJ', shortName: 'OJ', emoji: '🍊', category: 'soft', subcategory: '' },
  { id: 'apple-juice', name: 'Apple Juice', shortName: 'Apple J', emoji: '🍏', category: 'soft', subcategory: '' },
  { id: 'cranberry-juice', name: 'Cranberry Juice', shortName: 'Cranberry', emoji: '🥤', category: 'soft', subcategory: '' },
  { id: 'tomato-juice', name: 'Tomato Juice', shortName: 'Tomato', emoji: '🥤', category: 'soft', subcategory: '' },
  { id: 'lime-soda', name: 'Lime & Soda', shortName: 'Lime & Soda', emoji: '🥤', category: 'soft', subcategory: '' },
  { id: 'blackcurrant-soda', name: 'Blackcurrant & Soda', shortName: 'B/C & Soda', emoji: '🥤', category: 'soft', subcategory: '' },
  { id: 'water', name: 'Water', shortName: 'Water', emoji: '💧', category: 'soft', subcategory: '' },
  { id: 'soda-water', name: 'Soda Water', shortName: 'Soda Water', emoji: '💧', category: 'soft', subcategory: '' },
  { id: 'tonic-water', name: 'Tonic Water', shortName: 'Tonic', emoji: '🥤', category: 'soft', subcategory: '' },
  { id: 'ginger-beer', name: 'Ginger Beer', shortName: 'Ginger Beer', emoji: '🥤', category: 'soft', subcategory: '' },
  { id: 'ginger-ale', name: 'Ginger Ale', shortName: 'Ginger Ale', emoji: '🥤', category: 'soft', subcategory: '' },
  { id: 'appletiser', name: 'Appletiser', shortName: 'Appletiser', emoji: '🍏', category: 'soft', subcategory: '' },
  { id: 'j2o', name: 'J2O', shortName: 'J2O', emoji: '🥤', category: 'soft', subcategory: '' },

  // ===== SHOTS =====
  { id: 'sambuca', name: 'Sambuca', shortName: 'Sambuca', emoji: '🥃', category: 'shots', subcategory: '' },
  { id: 'tequila', name: 'Tequila', shortName: 'Tequila', emoji: '🥃', category: 'shots', subcategory: '' },
  { id: 'jagerbomb', name: 'Jagerbomb', shortName: 'Jagerbomb', emoji: '💣', category: 'shots', subcategory: '' },
  { id: 'jagermeister', name: 'Jagermeister', shortName: 'Jager', emoji: '🥃', category: 'shots', subcategory: '' },
  { id: 'baby-guinness', name: 'Baby Guinness', shortName: 'Baby G', emoji: '🥃', category: 'shots', subcategory: '' },
  { id: 'fireball', name: 'Fireball', shortName: 'Fireball', emoji: '🔥', category: 'shots', subcategory: '' },
  { id: 'sourz', name: 'Sourz', shortName: 'Sourz', emoji: '🥃', category: 'shots', subcategory: '' },
  { id: 'aftershock', name: 'Aftershock', shortName: 'Aftershock', emoji: '🥃', category: 'shots', subcategory: '' },
  { id: 'baileys-shot', name: 'Baileys Shot', shortName: 'Baileys', emoji: '🥃', category: 'shots', subcategory: '' },
  { id: 'limoncello-shot', name: 'Limoncello Shot', shortName: 'Limoncello', emoji: '🥃', category: 'shots', subcategory: '' },

  // ===== 0% / LOW ALCOHOL =====
  { id: 'peroni-zero', name: 'Peroni 0.0', shortName: 'Peroni 0.0', emoji: '🍺', category: 'zero', subcategory: '' },
  { id: 'guinness-zero', name: 'Guinness 0.0', shortName: 'Guinness 0.0', emoji: '🍺', category: 'zero', subcategory: '' },
  { id: 'heineken-zero', name: 'Heineken 0.0', shortName: 'Heineken 0.0', emoji: '🍺', category: 'zero', subcategory: '' },
  { id: 'erdinger-alkoholfrei', name: 'Erdinger Alkoholfrei', shortName: 'Erdinger AF', emoji: '🍺', category: 'zero', subcategory: '' },
  { id: 'lucky-saint', name: 'Lucky Saint', shortName: 'Lucky Saint', emoji: '🍺', category: 'zero', subcategory: '' },
  { id: 'nosecco', name: 'Nosecco', shortName: 'Nosecco', emoji: '🥂', category: 'zero', subcategory: '' },
  { id: 'becks-blue', name: 'Becks Blue', shortName: 'Becks Blue', emoji: '🍺', category: 'zero', subcategory: '' },
  { id: 'estrella-zero', name: 'Estrella 0.0', shortName: 'Estrella 0.0', emoji: '🍺', category: 'zero', subcategory: '' },
  { id: 'birra-moretti-zero', name: 'Birra Moretti 0.0', shortName: 'Moretti 0.0', emoji: '🍺', category: 'zero', subcategory: '' },
  { id: 'old-mout-zero', name: 'Old Mout 0%', shortName: 'Old Mout 0%', emoji: '🍺', category: 'zero', subcategory: '' },
  { id: 'gordons-zero', name: "Gordon's 0.0% G&T", shortName: "Gordon's 0.0", emoji: '🍸', category: 'zero', subcategory: '' },
  { id: 'kopparberg-zero', name: 'Kopparberg 0%', shortName: 'Kopparbg 0%', emoji: '🍺', category: 'zero', subcategory: '' },
];

// Helper function to get drinks by category
export const getDrinksByCategory = (category: string): Drink[] => {
  return drinks.filter(drink => drink.category === category).sort((a, b) => a.name.localeCompare(b.name));
};

// Helper function to get drinks by category and subcategory
export const getDrinksByCategoryAndSubcategory = (category: string, subcategory: string): Drink[] => {
  return drinks.filter(drink => drink.category === category && drink.subcategory === subcategory).sort((a, b) => a.name.localeCompare(b.name));
};

// Helper function to get all subcategories for a category
export const getSubcategories = (category: string): string[] => {
  const subcategories = drinks
    .filter(drink => drink.category === category)
    .map(drink => drink.subcategory)
    .filter(sub => sub !== '');
  return [...new Set(subcategories)];
};

// Helper function to find drink by id
export const getDrinkById = (id: string): Drink | undefined => {
  return drinks.find(drink => drink.id === id);
};
