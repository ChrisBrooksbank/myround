// DrinkButton component with emoji, label, and press animation
// Supports long-press to delete custom drinks

import { useRef, useCallback } from 'react';
import type { Drink } from '../types';

interface DrinkButtonProps {
  drink: Drink;
  onClick: (drink: Drink) => void;
  isCustom?: boolean;
  onDelete?: (drink: Drink) => void;
}

const LONG_PRESS_MS = 500;

export function DrinkButton({ drink, onClick, isCustom, onDelete }: DrinkButtonProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressedRef = useRef(false);

  const cancelLongPress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startLongPress = useCallback(() => {
    if (!isCustom || !onDelete) return;
    longPressedRef.current = false;
    timerRef.current = setTimeout(() => {
      longPressedRef.current = true;
      timerRef.current = null;
      // Haptic feedback (100ms) for long-press
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
      if (window.confirm(`Delete custom drink "${drink.name}"?`)) {
        onDelete(drink);
      }
    }, LONG_PRESS_MS);
  }, [isCustom, onDelete, drink]);

  const handleClick = () => {
    if (longPressedRef.current) {
      longPressedRef.current = false;
      return;
    }
    // Haptic feedback (30ms vibrate) on drink taps
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    onClick(drink);
  };

  const className = `drink-button${isCustom ? ' custom' : ''}`;

  return (
    <button
      className={className}
      onClick={handleClick}
      onMouseDown={startLongPress}
      onMouseUp={cancelLongPress}
      onMouseLeave={cancelLongPress}
      onTouchStart={startLongPress}
      onTouchEnd={cancelLongPress}
      onTouchMove={cancelLongPress}
      aria-label={drink.name}
    >
      <span className="drink-emoji">{drink.emoji}</span>
      <span className="drink-label">{drink.shortName}</span>
    </button>
  );
}
