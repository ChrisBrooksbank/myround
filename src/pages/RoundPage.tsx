// RoundPage: Main ordering screen integrating all ordering components

import { useState, useRef, useEffect } from 'react';
import { useRound } from '../hooks/useRound';
import { RegularsPicker } from '../components/RegularsPicker';
import { NameInput } from '../components/NameInput';
import { DrinkGrid } from '../components/DrinkGrid';
import { OrderList } from '../components/OrderList';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { getDrinkById } from '../data/drinks';
import type { Drink } from '../types';

export function RoundPage() {
  const { round, addOrder, updateQuantity, removeOrder } = useRound();
  const [name, setName] = useState('');
  const [shake, setShake] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDrinkName, setCustomDrinkName] = useState('');

  // aria-live announcements for order changes
  const [announcement, setAnnouncement] = useState('');
  const prevOrderCountRef = useRef(round.orders.length);

  useEffect(() => {
    const prevCount = prevOrderCountRef.current;
    const currentCount = round.orders.length;
    prevOrderCountRef.current = currentCount;

    if (currentCount > prevCount) {
      // New order added — announce the latest one
      const latest = round.orders[round.orders.length - 1];
      const drink = getDrinkById(latest.drinkId);
      const drinkName = latest.customDrinkName || drink?.shortName || 'drink';
      setAnnouncement(`Added ${drinkName} for ${latest.personName}`);
    } else if (currentCount < prevCount) {
      setAnnouncement('Removed order');
    }
  }, [round.orders]);

  // Clear announcement after a short delay so repeated identical additions still announce
  useEffect(() => {
    if (!announcement) return;
    const timer = setTimeout(() => setAnnouncement(''), 1000);
    return () => clearTimeout(timer);
  }, [announcement]);

  // Derive recent drink IDs from orders (unique, excluding 'custom', last 8)
  const recentDrinkIds = (() => {
    const seen = new Set<string>();
    const ids: string[] = [];
    for (let i = round.orders.length - 1; i >= 0; i--) {
      const drinkId = round.orders[i].drinkId;
      if (drinkId !== 'custom' && !seen.has(drinkId)) {
        seen.add(drinkId);
        ids.push(drinkId);
      }
      if (ids.length >= 8) break;
    }
    return ids;
  })();

  // Focus trap for custom drink modal
  const customModalRef = useFocusTrap(showCustomInput, handleCustomDrinkCancel);

  // Handle drink selection from grid
  const handleDrinkSelect = (drink: Drink) => {
    const trimmedName = name.trim();

    // If no name entered, shake the input
    if (!trimmedName) {
      setShake(true);
      return;
    }

    // Add the order
    addOrder(trimmedName, drink.id);

    // Clear the name input (ready for next person)
    setName('');

    // Haptic feedback (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  // Handle "same again" suggestion
  const handleSameAgain = (drinkId: string, customDrinkName?: string) => {
    const trimmedName = name.trim();
    if (trimmedName) {
      addOrder(trimmedName, drinkId, customDrinkName);
      setName('');

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    }
  };

  // Handle shake animation end
  const handleShakeEnd = () => {
    setShake(false);
  };

  // Handle custom drink button click
  const handleCustomDrinkClick = () => {
    const trimmedName = name.trim();

    // If no name entered, shake the input
    if (!trimmedName) {
      setShake(true);
      return;
    }

    // Show custom drink input
    setShowCustomInput(true);
  };

  // Handle custom drink submission
  const handleCustomDrinkSubmit = () => {
    const trimmedName = name.trim();
    const trimmedCustomDrink = customDrinkName.trim();

    if (trimmedName && trimmedCustomDrink) {
      // Add custom order (drinkId = 'custom' placeholder, actual name in customDrinkName)
      addOrder(trimmedName, 'custom', trimmedCustomDrink);

      // Clear inputs
      setName('');
      setCustomDrinkName('');
      setShowCustomInput(false);

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    }
  };

  // Handle custom drink cancel
  function handleCustomDrinkCancel() {
    setCustomDrinkName('');
    setShowCustomInput(false);
  }

  return (
    <div className="round-page">
      <div className="round-page-content">
        {/* Regulars Quick-Add Bar */}
        <RegularsPicker />

        {/* Name Input Section */}
        <div className="name-section">
          <NameInput
            value={name}
            onChange={setName}
            onSameAgain={handleSameAgain}
            shake={shake}
            onShakeEnd={handleShakeEnd}
          />
        </div>

        {/* Drink Grid Section */}
        <div className="drink-section">
          <DrinkGrid
            onDrinkSelect={handleDrinkSelect}
            onCustomDrinkClick={handleCustomDrinkClick}
            recentDrinkIds={recentDrinkIds}
          />
        </div>

        {/* Order List Section */}
        <div className="order-section">
          <h2 className="order-section-title">Current Order</h2>
          <OrderList
            orders={round.orders}
            onUpdateQuantity={updateQuantity}
            onRemove={removeOrder}
          />
        </div>

        {/* Visually hidden live region for screen reader announcements */}
        <div aria-live="polite" className="sr-only">
          {announcement}
        </div>
      </div>

      {/* Custom Drink Modal */}
      {showCustomInput && (
        <div className="modal-overlay" onClick={handleCustomDrinkCancel}>
          <div className="modal-content" ref={customModalRef} onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Custom Drink</h3>
            <input
              type="text"
              className="custom-drink-input"
              placeholder="Enter drink name..."
              value={customDrinkName}
              onChange={(e) => setCustomDrinkName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCustomDrinkSubmit();
                } else if (e.key === 'Escape') {
                  handleCustomDrinkCancel();
                }
              }}
              autoFocus
            />
            <div className="modal-buttons">
              <button
                className="modal-button modal-button-cancel"
                onClick={handleCustomDrinkCancel}
              >
                Cancel
              </button>
              <button
                className="modal-button modal-button-confirm"
                onClick={handleCustomDrinkSubmit}
                disabled={!customDrinkName.trim()}
              >
                Add Drink
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
