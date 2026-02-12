// DrinkGrid component with category tabs, subcategory pills, drink grid, and "Other" button

import { useState } from 'react';
import type { Drink, DrinkCategory } from '../types';
import { getDrinksByCategory, getDrinksByCategoryAndSubcategory, getSubcategories } from '../data/drinks';
import { DrinkButton } from './DrinkButton';

interface DrinkGridProps {
  onDrinkSelect: (drink: Drink) => void;
  onCustomDrinkClick: () => void;
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

export function DrinkGrid({ onDrinkSelect, onCustomDrinkClick }: DrinkGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<DrinkCategory>('pints');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');

  // Get subcategories for the selected category
  const subcategories = getSubcategories(selectedCategory);
  const hasSubcategories = subcategories.length > 0;

  // Get drinks to display
  const drinksToDisplay = hasSubcategories && selectedSubcategory
    ? getDrinksByCategoryAndSubcategory(selectedCategory, selectedSubcategory)
    : getDrinksByCategory(selectedCategory);

  // Handle category change
  const handleCategoryChange = (category: DrinkCategory) => {
    setSelectedCategory(category);
    const newSubcategories = getSubcategories(category);
    // Auto-select first subcategory if available
    setSelectedSubcategory(newSubcategories.length > 0 ? newSubcategories[0] : '');
  };

  // Handle subcategory change
  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  return (
    <div className="drink-grid-container">
      {/* Category tabs */}
      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
            data-category={category.id}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Subcategory pills (only shown if category has subcategories) */}
      {hasSubcategories && (
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
          onClick={onCustomDrinkClick}
          aria-label="Add custom drink"
        >
          <span className="drink-emoji">➕</span>
          <span className="drink-label">Other...</span>
        </button>
      </div>
    </div>
  );
}
