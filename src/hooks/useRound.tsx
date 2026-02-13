// Round state management hook with deduplication and history persistence

import { useState, useEffect, useRef, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Round, OrderLine } from '../types';
import { getCurrentRound, saveCurrentRound, clearCurrentRound, addToHistory, removeLastFromHistory } from '../lib/storage';
import { generateId } from '../lib/utils';

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
  undoCompleteRound: () => void;
  canUndo: boolean;
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
    // Archive the current React state directly (not from localStorage which may be stale)
    const completedRound: Round = {
      ...round,
      completedAt: new Date().toISOString(),
    };
    addToHistory(completedRound);
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

  // Undo: track whether the last action was a complete, with a 10s timeout
  const [canUndo, setCanUndo] = useState(false);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Undo last round completion: pop from history, restore as current round
  const undoCompleteRound = () => {
    const restored = removeLastFromHistory();
    if (restored) {
      // Remove completedAt to make it a live round again
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { completedAt: _completedAt, ...liveRound } = restored;
      setRound(liveRound as Round);
      saveCurrentRound(liveRound as Round);
      setCanUndo(false);
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    }
  };

  // Wrap completeRound to enable undo window
  const completeRoundWithUndo = () => {
    completeRound();
    setCanUndo(true);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => setCanUndo(false), 10000);
  };

  const value: RoundContextValue = {
    round,
    addOrder,
    removeOrder,
    updateQuantity,
    toggleOrdered,
    completeRound: completeRoundWithUndo,
    clearRound,
    undoCompleteRound,
    canUndo,
  };

  return <RoundContext.Provider value={value}>{children}</RoundContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRound(): RoundContextValue {
  const context = useContext(RoundContext);
  if (!context) {
    throw new Error('useRound must be used within a RoundProvider');
  }
  return context;
}
