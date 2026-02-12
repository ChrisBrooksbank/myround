// Round state management hook with deduplication and history persistence

import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Round, OrderLine } from '../types';
import { getCurrentRound, saveCurrentRound, clearCurrentRound, archiveCurrentRound } from '../lib/storage';

// Generate a unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Generate deduplication key for order lines
function getDedupKey(personName: string, drinkId: string, customDrinkName?: string): string {
  const normalizedName = personName.toLowerCase().trim();
  if (customDrinkName) {
    return `${normalizedName}-custom-${customDrinkName.toLowerCase().trim()}`;
  }
  return `${normalizedName}-${drinkId}`;
}

interface RoundContextValue {
  round: Round;
  addOrder: (personName: string, drinkId: string, customDrinkName?: string) => void;
  removeOrder: (orderId: string) => void;
  updateQuantity: (orderId: string, quantity: number) => void;
  toggleOrdered: (orderId: string) => void;
  completeRound: () => void;
  clearRound: () => void;
}

const RoundContext = createContext<RoundContextValue | null>(null);

export function RoundProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or create new round
  const [round, setRound] = useState<Round>(() => {
    const saved = getCurrentRound();
    if (saved) {
      return saved;
    }
    return {
      id: generateId(),
      createdAt: new Date().toISOString(),
      orders: [],
    };
  });

  // Persist to localStorage whenever round changes
  useEffect(() => {
    saveCurrentRound(round);
  }, [round]);

  // Add order with deduplication
  const addOrder = (personName: string, drinkId: string, customDrinkName?: string) => {
    setRound(prev => {
      const dedupKey = getDedupKey(personName, drinkId, customDrinkName);

      // Check for existing order with same person + drink
      const existingIndex = prev.orders.findIndex(order => {
        const orderKey = getDedupKey(order.personName, order.drinkId, order.customDrinkName);
        return orderKey === dedupKey;
      });

      if (existingIndex !== -1) {
        // Increment quantity of existing order
        const updatedOrders = [...prev.orders];
        updatedOrders[existingIndex] = {
          ...updatedOrders[existingIndex],
          quantity: updatedOrders[existingIndex].quantity + 1,
        };
        return { ...prev, orders: updatedOrders };
      } else {
        // Add new order
        const newOrder: OrderLine = {
          id: generateId(),
          drinkId,
          personName,
          quantity: 1,
          customDrinkName,
          ordered: false,
        };
        return { ...prev, orders: [...prev.orders, newOrder] };
      }
    });
  };

  // Remove order
  const removeOrder = (orderId: string) => {
    setRound(prev => ({
      ...prev,
      orders: prev.orders.filter(order => order.id !== orderId),
    }));
  };

  // Update quantity
  const updateQuantity = (orderId: string, quantity: number) => {
    if (quantity < 1) {
      removeOrder(orderId);
      return;
    }

    setRound(prev => ({
      ...prev,
      orders: prev.orders.map(order =>
        order.id === orderId ? { ...order, quantity } : order
      ),
    }));
  };

  // Toggle ordered status
  const toggleOrdered = (orderId: string) => {
    setRound(prev => ({
      ...prev,
      orders: prev.orders.map(order =>
        order.id === orderId ? { ...order, ordered: !order.ordered } : order
      ),
    }));
  };

  // Complete round (archive to history and start fresh)
  const completeRound = () => {
    archiveCurrentRound();
    clearRound();
  };

  // Clear round (start fresh without archiving)
  const clearRound = () => {
    clearCurrentRound();
    setRound({
      id: generateId(),
      createdAt: new Date().toISOString(),
      orders: [],
    });
  };

  const value: RoundContextValue = {
    round,
    addOrder,
    removeOrder,
    updateQuantity,
    toggleOrdered,
    completeRound,
    clearRound,
  };

  return <RoundContext.Provider value={value}>{children}</RoundContext.Provider>;
}

// Hook to use round context
export function useRound(): RoundContextValue {
  const context = useContext(RoundContext);
  if (!context) {
    throw new Error('useRound must be used within a RoundProvider');
  }
  return context;
}
