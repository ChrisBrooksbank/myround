// Name input with auto-focus, auto-clear, and "same again" suggestion

import { useEffect, useRef, useMemo } from 'react';
import { getLastDrinkForPerson } from '../lib/storage';
import { getDrinkById } from '../data/drinks';

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
  onSameAgain?: (drinkId: string, customDrinkName?: string) => void;
  shake?: boolean;
  onShakeEnd?: () => void;
}

export function NameInput({ value, onChange, onSameAgain, shake, onShakeEnd }: NameInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle shake: focus input and listen for animation end
  useEffect(() => {
    const el = inputRef.current;
    if (shake && el) {
      el.focus();

      const handleAnimationEnd = () => {
        onShakeEnd?.();
      };
      el.addEventListener('animationend', handleAnimationEnd);
      return () => {
        el.removeEventListener('animationend', handleAnimationEnd);
      };
    }
  }, [shake, onShakeEnd]);

  // Derive "same again" suggestion from current name value
  const suggestion = useMemo((): { drinkId: string; drinkName: string; customDrinkName?: string } | null => {
    if (value.trim().length < 2) return null;

    const lastDrink = getLastDrinkForPerson(value);
    if (!lastDrink) return null;

    if (lastDrink.customDrinkName) {
      return {
        drinkId: lastDrink.drinkId,
        drinkName: lastDrink.customDrinkName,
        customDrinkName: lastDrink.customDrinkName,
      };
    }

    const drink = getDrinkById(lastDrink.drinkId);
    if (drink) {
      return { drinkId: lastDrink.drinkId, drinkName: drink.shortName };
    }

    return null;
  }, [value]);

  const handleSuggestionClick = () => {
    if (suggestion && onSameAgain) {
      onSameAgain(suggestion.drinkId, suggestion.customDrinkName);
    }
  };

  return (
    <div className="name-input-container">
      <input
        ref={inputRef}
        type="text"
        className={`name-input ${shake ? 'shake' : ''}`}
        placeholder="Type a name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        autoCapitalize="words"
      />
      {suggestion && (
        <button
          className="same-again-suggestion"
          onClick={handleSuggestionClick}
          type="button"
        >
          Same again? {suggestion.drinkName}
        </button>
      )}
    </div>
  );
}
