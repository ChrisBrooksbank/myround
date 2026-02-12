// DrinkGrid component with search, category tabs, subcategory pills, drink grid, and "Other" button

import { useState } from 'react';
import type { Drink, DrinkCategory } from '../types';
import { drinks, getDrinksByCategory, getDrinksByCategoryAndSubcategory, getSubcategories, getDrinkById } from '../data/drinks';
import { DrinkButton } from './DrinkButton';

type TabId = DrinkCategory | 'recent';

interface DrinkGridProps {
  onDrinkSelect: (drink: Drink) => void;
  onCustomDrinkClick: () => void;
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

export function DrinkGrid({ onDrinkSelect, onCustomDrinkClick, recentDrinkIds = [] }: DrinkGridProps) {
  const [selectedTab, setSelectedTab] = useState<TabId>('pints');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(() => getSubcategories('pints')[0] || '');
  const [searchQuery, setSearchQuery] = useState('');

  const isSearching = searchQuery.trim().length >= 2;

  // Filter drinks based on search query
  const searchResults = isSearching
    ? drinks.filter(drink =>
        drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drink.shortName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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
      {/* Search Input */}
      <div className="drink-search-wrapper">
        <input
          type="text"
          className="drink-search-input"
          placeholder="Search drinks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
          />
        ))}

        {/* "Other" button for custom drinks */}
        <button
          className="drink-button other-button"
          onClick={() => {
            // Haptic feedback
            if (navigator.vibrate) {
              navigator.vibrate(30);
            }
            onCustomDrinkClick();
          }}
          aria-label="Add custom drink"
        >
          <span className="drink-emoji">➕</span>
          <span className="drink-label">Other...</span>
        </button>
      </div>
    </div>
  );
}
