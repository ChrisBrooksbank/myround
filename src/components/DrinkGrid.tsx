// DrinkGrid component with search, category tabs, subcategory pills, drink grid, and inline custom drink add

import { useState, useCallback, useMemo } from 'react';
import type { Drink, DrinkCategory } from '../types';
import { drinks, getDrinksByCategory, getDrinksByCategoryAndSubcategory, getSubcategories, getDrinkById } from '../data/drinks';
import { getCustomDrinks, deleteCustomDrink } from '../lib/storage';
import { haptic } from '../lib/haptics';
import { DrinkButton } from './DrinkButton';

type TabId = DrinkCategory | 'recent';

interface DrinkGridProps {
  onDrinkSelect: (drink: Drink) => void;
  onCustomDrinkAdd: (drinkName: string) => void;
  recentDrinkIds?: string[];
}

const categories: { id: DrinkCategory; label: string }[] = [
  { id: 'pints', label: 'Pints' },
  { id: 'wine', label: 'Wine' },
  { id: 'spirits', label: 'Spirits' },
  { id: 'cocktails', label: 'Cocktails' },
  { id: 'soft', label: 'Soft' },
  { id: 'shots', label: 'Shots' },
  { id: 'zero', label: '0%' },
];

export function DrinkGrid({ onDrinkSelect, onCustomDrinkAdd, recentDrinkIds = [] }: DrinkGridProps) {
  const [selectedTab, setSelectedTab] = useState<TabId>('pints');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(() => getSubcategories('pints')[0] || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDeleteCustomDrink = useCallback((drink: Drink) => {
    deleteCustomDrink(drink.id);
    setRefreshKey((k) => k + 1);
  }, []);

  const isSearching = searchQuery.trim().length >= 2;

  // Re-read custom drinks when refreshKey changes (after deletion).
  // refreshKey is the only trigger for storage updates, so this dep is intentionally narrowed.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const customDrinks = useMemo(() => getCustomDrinks(), [refreshKey]);
  const allDrinks = useMemo(() => [...drinks, ...customDrinks], [customDrinks]);

  const searchResults = isSearching
    ? allDrinks.filter(drink =>
        drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drink.shortName.toLowerCase().includes(searchQuery.toLowerCase())
      ).sort((a, b) => a.shortName.localeCompare(b.shortName))
    : [];

  // Check if search text exactly matches an existing drink (for showing "Add new" option)
  const trimmedQuery = searchQuery.trim();
  const hasExactMatch = isSearching && allDrinks.some(
    drink => drink.name.toLowerCase() === trimmedQuery.toLowerCase() ||
             drink.shortName.toLowerCase() === trimmedQuery.toLowerCase()
  );

  // Get drinks for "Recent" tab
  const recentDrinks = selectedTab === 'recent'
    ? recentDrinkIds.map(id => getDrinkById(id)).filter((d): d is Drink => d !== undefined)
    : [];

  // Get subcategories for category tabs
  const subcategories = selectedTab !== 'recent' ? getSubcategories(selectedTab) : [];
  const hasSubcategories = subcategories.length > 0;

  // Get drinks to display (normal mode)
  const categoryDrinks = selectedTab !== 'recent'
    ? (hasSubcategories && selectedSubcategory
        ? getDrinksByCategoryAndSubcategory(selectedTab, selectedSubcategory)
        : getDrinksByCategory(selectedTab))
    : [];

  const drinksToDisplay = isSearching
    ? searchResults
    : selectedTab === 'recent'
      ? recentDrinks
      : categoryDrinks;

  // Handle category change
  const handleTabChange = (tab: TabId) => {
    setSelectedTab(tab);
    if (tab !== 'recent') {
      const newSubcategories = getSubcategories(tab);
      setSelectedSubcategory(newSubcategories.length > 0 ? newSubcategories[0] : '');
    }
  };

  // Handle subcategory change
  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  return (
    <div className="drink-grid-container">
      {/* Search Input - also used to add custom drinks */}
      <div className="drink-search-wrapper">
        <input
          type="text"
          className="drink-search-input"
          placeholder="Search or add a drink..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && trimmedQuery) {
              // If there's an exact match, select it; otherwise add as custom
              if (searchResults.length === 1) {
                onDrinkSelect(searchResults[0]);
                setSearchQuery('');
              } else if (!hasExactMatch && trimmedQuery.length >= 2) {
                onCustomDrinkAdd(trimmedQuery);
                setSearchQuery('');
              }
            }
          }}
        />
        {searchQuery && (
          <button
            className="drink-search-clear"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Category tabs (hidden when searching) */}
      {!isSearching && (
        <div className="category-tabs">
          {recentDrinkIds.length > 0 && (
            <button
              className={`category-tab ${selectedTab === 'recent' ? 'active' : ''}`}
              data-category="recent"
              onClick={() => handleTabChange('recent')}
            >
              Recent
            </button>
          )}
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-tab ${selectedTab === category.id ? 'active' : ''}`}
              data-category={category.id}
              onClick={() => handleTabChange(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      {/* Subcategory pills (only shown if category has subcategories and not searching) */}
      {!isSearching && hasSubcategories && (
        <div className="subcategory-pills">
          {subcategories.map((subcategory) => (
            <button
              key={subcategory}
              className={`subcategory-pill ${selectedSubcategory === subcategory ? 'active' : ''}`}
              onClick={() => handleSubcategoryChange(subcategory)}
            >
              {subcategory}
            </button>
          ))}
        </div>
      )}

      {/* Drink grid */}
      <div className="drink-grid">
        {drinksToDisplay.map((drink) => (
          <DrinkButton
            key={drink.id}
            drink={drink}
            onClick={onDrinkSelect}
            isCustom={drink.category === 'custom'}
            onDelete={handleDeleteCustomDrink}
          />
        ))}

        {/* Show "Add as new drink" when searching and no exact match */}
        {isSearching && !hasExactMatch && trimmedQuery.length >= 2 && (
          <button
            className="drink-button other-button"
            onClick={() => {
              haptic();
              onCustomDrinkAdd(trimmedQuery);
              setSearchQuery('');
            }}
            aria-label={`Add ${trimmedQuery} as new drink`}
          >
            <span className="drink-emoji">➕</span>
            <span className="drink-label">Add "{trimmedQuery}"</span>
          </button>
        )}
      </div>
    </div>
  );
}
