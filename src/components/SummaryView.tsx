// Summary view component with by-drink and by-person views
// Supports tick-off functionality and progress tracking

import { useMemo } from 'react';
import type { OrderLine } from '../types';
import { getDrinkById } from '../data/drinks';
import { haptic } from '../lib/haptics';

interface SummaryViewProps {
  orders: OrderLine[];
  viewMode: 'by-drink' | 'by-person';
  onToggleOrdered: (orderId: string) => void;
}

// Group orders by drink
interface DrinkGroup {
  drinkName: string;
  emoji: string;
  totalQuantity: number;
  orders: OrderLine[];
  allOrdered: boolean;
}

// Group orders by person
interface PersonGroup {
  personName: string;
  orders: OrderLine[];
  allOrdered: boolean;
}

export function SummaryView({ orders, viewMode, onToggleOrdered }: SummaryViewProps) {
  // Calculate progress
  const { orderedCount, totalCount } = useMemo(() => {
    const total = orders.reduce((sum, order) => sum + order.quantity, 0);
    const ordered = orders.reduce((sum, order) => {
      return sum + (order.ordered ? order.quantity : 0);
    }, 0);
    return { orderedCount: ordered, totalCount: total };
  }, [orders]);

  // Group by drink
  const drinkGroups = useMemo((): DrinkGroup[] => {
    const groups = new Map<string, DrinkGroup>();

    orders.forEach(order => {
      const drinkName = order.customDrinkName || getDrinkById(order.drinkId)?.name || 'Unknown';
      const emoji = order.customDrinkName ? '🍹' : getDrinkById(order.drinkId)?.emoji || '🍹';

      const key = order.customDrinkName ? `custom-${order.customDrinkName}` : order.drinkId;

      if (!groups.has(key)) {
        groups.set(key, {
          drinkName,
          emoji,
          totalQuantity: 0,
          orders: [],
          allOrdered: true,
        });
      }

      const group = groups.get(key)!;
      group.totalQuantity += order.quantity;
      group.orders.push(order);
      if (!order.ordered) {
        group.allOrdered = false;
      }
    });

    return Array.from(groups.values()).sort((a, b) => {
      // Sort by ordered status (unordered first), then by name
      if (a.allOrdered !== b.allOrdered) {
        return a.allOrdered ? 1 : -1;
      }
      return a.drinkName.localeCompare(b.drinkName);
    });
  }, [orders]);

  // Group by person
  const personGroups = useMemo((): PersonGroup[] => {
    const groups = new Map<string, PersonGroup>();

    orders.forEach(order => {
      const key = order.personName.toLowerCase();

      if (!groups.has(key)) {
        groups.set(key, {
          personName: order.personName,
          orders: [],
          allOrdered: true,
        });
      }

      const group = groups.get(key)!;
      group.orders.push(order);
      if (!order.ordered) {
        group.allOrdered = false;
      }
    });

    return Array.from(groups.values()).sort((a, b) => {
      // Sort by ordered status (unordered first), then by name
      if (a.allOrdered !== b.allOrdered) {
        return a.allOrdered ? 1 : -1;
      }
      return a.personName.localeCompare(b.personName);
    });
  }, [orders]);

  // Handle clicking on a drink group (marks all orders in that group)
  const handleDrinkGroupClick = (group: DrinkGroup) => {
    haptic();
    // Toggle all orders in this group to match the opposite of current state
    const shouldBeOrdered = !group.allOrdered;
    group.orders.forEach(order => {
      if (order.ordered !== shouldBeOrdered) {
        onToggleOrdered(order.id);
      }
    });
  };

  // Handle clicking on a person group (marks all their orders)
  const handlePersonGroupClick = (group: PersonGroup) => {
    haptic();
    // Toggle all orders for this person to match the opposite of current state
    const shouldBeOrdered = !group.allOrdered;
    group.orders.forEach(order => {
      if (order.ordered !== shouldBeOrdered) {
        onToggleOrdered(order.id);
      }
    });
  };

  if (orders.length === 0) {
    return (
      <div className="summary-empty">
        <p className="summary-empty-text">No drinks in this round yet</p>
      </div>
    );
  }

  return (
    <div className="summary-view">
      {/* Progress Indicator */}
      <div className="summary-progress">
        <div className="summary-progress-text">
          {orderedCount} of {totalCount} ordered
        </div>
        <div className="summary-progress-bar">
          <div
            className="summary-progress-fill"
            style={{ width: `${totalCount > 0 ? (orderedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* By-Drink View */}
      {viewMode === 'by-drink' && (
        <div className="summary-list">
          {drinkGroups.map((group, index) => (
            <div
              key={index}
              className={`summary-item ${group.allOrdered ? 'ordered' : ''}`}
              onClick={() => handleDrinkGroupClick(group)}
            >
              <div className="summary-item-main">
                <span className="summary-emoji">{group.emoji}</span>
                <div className="summary-item-content">
                  <div className="summary-drink-line">
                    <span className="summary-quantity">{group.totalQuantity}x</span>
                    <span className="summary-drink-name">{group.drinkName}</span>
                  </div>
                  <div className="summary-people">
                    {group.orders.map((order, idx) => {
                      const parts: string[] = [];
                      parts.push(order.personName);
                      if (order.quantity > 1) {
                        parts.push(`x${order.quantity}`);
                      }
                      return (
                        <span key={order.id}>
                          {parts.join(' ')}
                          {idx < group.orders.length - 1 ? ', ' : ''}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* By-Person View */}
      {viewMode === 'by-person' && (
        <div className="summary-list">
          {personGroups.map((group) => (
            <div
              key={group.personName}
              className={`summary-item ${group.allOrdered ? 'ordered' : ''}`}
              onClick={() => handlePersonGroupClick(group)}
            >
              <div className="summary-item-main">
                <span className="summary-emoji">👤</span>
                <div className="summary-item-content">
                  <div className="summary-person-name">{group.personName}</div>
                  <div className="summary-drinks">
                    {group.orders.map((order, idx) => {
                      const drinkName = order.customDrinkName || getDrinkById(order.drinkId)?.name || 'Unknown';
                      const emoji = order.customDrinkName ? '🍹' : getDrinkById(order.drinkId)?.emoji || '🍹';
                      const parts: string[] = [];
                      if (order.quantity > 1) {
                        parts.push(`${order.quantity}x`);
                      }
                      parts.push(`${emoji} ${drinkName}`);
                      return (
                        <span key={order.id}>
                          {parts.join(' ')}
                          {idx < group.orders.length - 1 ? ', ' : ''}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
