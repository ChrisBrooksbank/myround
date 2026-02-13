// RoundPage: Main ordering screen integrating all ordering components

import { useState, useRef, useEffect } from 'react';
import { useRound } from '../hooks/useRound';
import { RegularsPicker } from '../components/RegularsPicker';
import { NameInput } from '../components/NameInput';
import { DrinkGrid } from '../components/DrinkGrid';
import { OrderList } from '../components/OrderList';
import { getDrinkById } from '../data/drinks';
import { addCustomDrink, getCustomDrinks } from '../lib/storage';
import { haptic } from '../lib/haptics';
import type { Drink } from '../types';

export function RoundPage() {
  const { round, addOrder, updateQuantity, removeOrder, undoCompleteRound, canUndo } = useRound();
  const [name, setName] = useState('');
  const [shake, setShake] = useState(false);

  // aria-live announcements for order changes
  const announcementRef = useRef<HTMLDivElement>(null);
  const prevOrderCountRef = useRef(round.orders.length);

  useEffect(() => {
    const prevCount = prevOrderCountRef.current;
    const currentCount = round.orders.length;
    prevOrderCountRef.current = currentCount;

    const el = announcementRef.current;
    if (!el) return;

    let text = '';
    if (currentCount > prevCount) {
      const latest = round.orders[round.orders.length - 1];
      const drink = getDrinkById(latest.drinkId);
      const drinkName = latest.customDrinkName || drink?.shortName || 'drink';
      text = `Added ${drinkName} for ${latest.personName}`;
    } else if (currentCount < prevCount) {
      text = 'Removed order';
    }

    if (text) {
      el.textContent = text;
      const timer = setTimeout(() => { el.textContent = ''; }, 1000);
      return () => clearTimeout(timer);
    }
  }, [round.orders]);

  // Derive recent drink IDs from orders (unique, last 8)
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

    haptic();
  };

  // Handle "same again" suggestion
  const handleSameAgain = (drinkId: string, customDrinkName?: string) => {
    const trimmedName = name.trim();
    if (trimmedName) {
      addOrder(trimmedName, drinkId, customDrinkName);
      setName('');
      haptic();
    }
  };

  // Handle shake animation end
  const handleShakeEnd = () => {
    setShake(false);
  };

  // Handle adding a custom drink by name — saves to storage and adds order
  const handleCustomDrinkAdd = (drinkName: string) => {
    const trimmedName = name.trim();

    // If no name entered, shake the input
    if (!trimmedName) {
      setShake(true);
      return;
    }

    // Check if this custom drink already exists in storage
    const existingCustom = getCustomDrinks().find(
      (d) => d.name.toLowerCase() === drinkName.toLowerCase()
    );

    if (existingCustom) {
      // Already saved — use it as a normal drink
      addOrder(trimmedName, existingCustom.id);
    } else {
      // Create and save the custom drink
      const customId = 'custom-' + drinkName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newDrink: Drink = {
        id: customId,
        name: drinkName,
        shortName: drinkName,
        emoji: '🍹',
        category: 'custom',
        subcategory: '',
      };
      addCustomDrink(newDrink);
      addOrder(trimmedName, customId);
    }

    setName('');

    haptic();
  };

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
            onCustomDrinkAdd={handleCustomDrinkAdd}
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
        <div aria-live="polite" className="sr-only" ref={announcementRef} />
      </div>

      {/* Undo Toast */}
      {canUndo && (
        <div className="undo-toast">
          <span>Round completed</span>
          <button className="undo-toast-button" onClick={undoCompleteRound}>
            Undo
          </button>
        </div>
      )}

    </div>
  );
}
