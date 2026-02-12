// RegularsPicker: Group filter tabs + quick-add buttons for regulars

import { useState } from 'react';
import { useRegulars } from '../hooks/useRegulars';
import { useRound } from '../hooks/useRound';
import { getDrinkById } from '../data/drinks';
import { useFocusTrap } from '../hooks/useFocusTrap';

const ALL_GROUP_ID = 'all';

export function RegularsPicker() {
  const { regulars, groups } = useRegulars();
  const { addOrder } = useRound();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedRegular, setSelectedRegular] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(ALL_GROUP_ID);

  // Focus trap for favorites picker modal
  const favoritesRef = useFocusTrap(showPicker, handlePickerClose);

  // Filter regulars by selected group
  const filteredRegulars = selectedGroupId === ALL_GROUP_ID
    ? regulars
    : regulars.filter(r => {
        const group = groups.find(g => g.id === selectedGroupId);
        return group ? group.memberIds.includes(r.id) : true;
      });

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
  function handlePickerClose() {
    setShowPicker(false);
    setSelectedRegular(null);
  }

  // Don't render if no regulars
  if (regulars.length === 0) {
    return null;
  }

  // Get the selected regular for picker
  const regular = selectedRegular ? regulars.find(r => r.id === selectedRegular) : null;

  // Only show group filter tabs if there are groups
  const showGroupFilter = groups.length > 0;

  return (
    <>
      {/* Group filter tabs */}
      {showGroupFilter && (
        <div className="group-filter">
          <div className="group-filter-scroll">
            <button
              className={`group-filter-tab ${selectedGroupId === ALL_GROUP_ID ? 'active' : ''}`}
              onClick={() => setSelectedGroupId(ALL_GROUP_ID)}
            >
              All
            </button>
            {groups.map(group => (
              <button
                key={group.id}
                className={`group-filter-tab ${selectedGroupId === group.id ? 'active' : ''}`}
                onClick={() => setSelectedGroupId(group.id)}
              >
                {group.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Regular buttons */}
      <div className="regulars-picker">
        <div className="regulars-scroll">
          {[...filteredRegulars].sort((a, b) => a.name.localeCompare(b.name)).map(regular => (
            <button
              key={regular.id}
              className="regular-button"
              onClick={() => handleRegularClick(regular.id)}
            >
              <span className="regular-emoji">👤</span>
              <span className="regular-name">{regular.name}</span>
            </button>
          ))}
          {filteredRegulars.length === 0 && (
            <span className="regulars-empty-filter">No regulars in this group</span>
          )}
        </div>
      </div>

      {/* Favorite Drink Picker Modal */}
      {showPicker && regular && (
        <div className="modal-overlay" onClick={handlePickerClose}>
          <div className="modal-content favorites-picker" ref={favoritesRef} onClick={(e) => e.stopPropagation()}>
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
