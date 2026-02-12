// RoundPage: Main ordering screen integrating all ordering components

import { useState } from 'react';
import { useRound } from '../hooks/useRound';
import { NameInput } from '../components/NameInput';
import { DrinkGrid } from '../components/DrinkGrid';
import { OrderList } from '../components/OrderList';
import type { Drink } from '../types';

export function RoundPage() {
  const { round, addOrder, updateQuantity, removeOrder } = useRound();
  const [name, setName] = useState('');
  const [shake, setShake] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDrinkName, setCustomDrinkName] = useState('');

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
  const handleSameAgain = (drinkId: string) => {
    const trimmedName = name.trim();
    if (trimmedName) {
      addOrder(trimmedName, drinkId);
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
  const handleCustomDrinkCancel = () => {
    setCustomDrinkName('');
    setShowCustomInput(false);
  };

  return (
    <div className="round-page">
      <div className="round-page-content">
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
          />
        </div>

        {/* Order List Section */}
        {round.orders.length > 0 && (
          <div className="order-section">
            <h2 className="order-section-title">Current Order</h2>
            <OrderList
              orders={round.orders}
              onUpdateQuantity={updateQuantity}
              onRemove={removeOrder}
            />
          </div>
        )}
      </div>

      {/* Custom Drink Modal */}
      {showCustomInput && (
        <div className="modal-overlay" onClick={handleCustomDrinkCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
