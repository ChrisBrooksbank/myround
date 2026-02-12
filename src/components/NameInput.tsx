// Name input with auto-focus, auto-clear, and "same again" suggestion

import { useState, useEffect, useRef } from 'react';
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
  const [suggestion, setSuggestion] = useState<{ drinkId: string; drinkName: string; customDrinkName?: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle shake: focus input and listen for animation end
  useEffect(() => {
    if (shake && inputRef.current) {
      // Focus the input when shake is triggered
      inputRef.current.focus();

      const handleAnimationEnd = () => {
        onShakeEnd?.();
      };
      inputRef.current.addEventListener('animationend', handleAnimationEnd);
      return () => {
        inputRef.current?.removeEventListener('animationend', handleAnimationEnd);
      };
    }
  }, [shake, onShakeEnd]);

  // Check for "same again" suggestion when name changes
  useEffect(() => {
    if (value.trim().length >= 2) {
      const lastDrink = getLastDrinkForPerson(value);
      if (lastDrink) {
        // Check if it's a custom drink or a standard drink
        if (lastDrink.customDrinkName) {
          // Custom drink - show the custom name
          setSuggestion({
            drinkId: lastDrink.drinkId,
            drinkName: lastDrink.customDrinkName,
            customDrinkName: lastDrink.customDrinkName,
          });
        } else {
          // Standard drink - look up the drink name
          const drink = getDrinkById(lastDrink.drinkId);
          if (drink) {
            setSuggestion({ drinkId: lastDrink.drinkId, drinkName: drink.shortName });
          } else {
            setSuggestion(null);
          }
        }
      } else {
        setSuggestion(null);
      }
    } else {
      setSuggestion(null);
    }
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
