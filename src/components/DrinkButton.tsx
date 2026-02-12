// DrinkButton component with emoji, label, and press animation

import type { Drink } from '../types';

interface DrinkButtonProps {
  drink: Drink;
  onClick: (drink: Drink) => void;
}

export function DrinkButton({ drink, onClick }: DrinkButtonProps) {
  const handleClick = () => {
    // Haptic feedback (30ms vibrate) on drink taps
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    onClick(drink);
  };

  return (
    <button
      className="drink-button"
      onClick={handleClick}
      aria-label={drink.name}
    >
      <span className="drink-emoji">{drink.emoji}</span>
      <span className="drink-label">{drink.shortName}</span>
    </button>
  );
}
