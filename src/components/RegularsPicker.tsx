// RegularsPicker: Quick-add buttons for regulars with favorite drink picker

import { useState } from 'react';
import { useRegulars } from '../hooks/useRegulars';
import { useRound } from '../hooks/useRound';
import { getDrinkById } from '../data/drinks';

export function RegularsPicker() {
  const { regulars } = useRegulars();
  const { addOrder } = useRound();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedRegular, setSelectedRegular] = useState<string | null>(null);

  // Handle regular button click
  const handleRegularClick = (regularId: string) => {
    const regular = regulars.find(r => r.id === regularId);
    if (!regular) return;

    // If regular has only 1 favorite, add directly
    if (regular.favouriteDrinkIds.length === 1) {
      addOrder(regular.name, regular.favouriteDrinkIds[0]);

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    } else {
      // Show picker for multiple favorites
      setSelectedRegular(regularId);
      setShowPicker(true);
    }
  };

  // Handle favorite drink selection from picker
  const handleFavoriteSelect = (drinkId: string) => {
    if (!selectedRegular) return;

    const regular = regulars.find(r => r.id === selectedRegular);
    if (!regular) return;

    addOrder(regular.name, drinkId);

    // Close picker
    setShowPicker(false);
    setSelectedRegular(null);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  // Handle picker close
  const handlePickerClose = () => {
    setShowPicker(false);
    setSelectedRegular(null);
  };

  // Don't render if no regulars
  if (regulars.length === 0) {
    return null;
  }

  // Get the selected regular for picker
  const regular = selectedRegular ? regulars.find(r => r.id === selectedRegular) : null;

  return (
    <>
      <div className="regulars-picker">
        <div className="regulars-scroll">
          {regulars.map(regular => (
            <button
              key={regular.id}
              className="regular-button"
              onClick={() => handleRegularClick(regular.id)}
            >
              <span className="regular-emoji">👤</span>
              <span className="regular-name">{regular.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Favorite Drink Picker Modal */}
      {showPicker && regular && (
        <div className="modal-overlay" onClick={handlePickerClose}>
          <div className="modal-content favorites-picker" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{regular.name}'s Favorites</h3>
            <div className="favorites-grid">
              {regular.favouriteDrinkIds.map(drinkId => {
                const drink = getDrinkById(drinkId);
                if (!drink) return null;

                return (
                  <button
                    key={drinkId}
                    className="favorite-button"
                    onClick={() => handleFavoriteSelect(drinkId)}
                  >
                    <span className="favorite-emoji">{drink.emoji}</span>
                    <span className="favorite-name">{drink.shortName}</span>
                  </button>
                );
              })}
            </div>
            <button className="modal-close-button" onClick={handlePickerClose}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
