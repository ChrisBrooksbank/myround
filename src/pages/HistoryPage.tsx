// HistoryPage: View recent completed rounds

import { useState } from 'react';
import { getRoundHistory } from '../lib/storage';
import { getDrinkById } from '../data/drinks';
import type { Round } from '../types';

export function HistoryPage() {
  const [history] = useState<Round[]>(() =>
    getRoundHistory().filter(r => r.completedAt).reverse()
  );

  if (history.length === 0) {
    return (
      <div className="history-page">
        <div className="history-empty">
          <p className="history-empty-text">No completed rounds yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      {history.slice(0, 20).map((round) => (
        <HistoryRoundCard key={round.id} round={round} />
      ))}
    </div>
  );
}

function HistoryRoundCard({ round }: { round: Round }) {
  const [expanded, setExpanded] = useState(false);

  const totalDrinks = round.orders.reduce((sum, o) => sum + o.quantity, 0);
  const completedDate = round.completedAt ? new Date(round.completedAt) : null;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Build drink summary: "2x Guinness, 1x G&T, ..."
  const drinkSummary = (() => {
    const counts = new Map<string, { name: string; emoji: string; qty: number }>();
    round.orders.forEach(order => {
      const key = order.customDrinkName ? `custom-${order.customDrinkName}` : order.drinkId;
      const name = order.customDrinkName || getDrinkById(order.drinkId)?.shortName || 'Unknown';
      const emoji = order.customDrinkName ? '🍹' : getDrinkById(order.drinkId)?.emoji || '🍹';
      const existing = counts.get(key);
      if (existing) {
        existing.qty += order.quantity;
      } else {
        counts.set(key, { name, emoji, qty: order.quantity });
      }
    });
    return Array.from(counts.values());
  })();

  return (
    <div className="history-card" onClick={() => setExpanded(!expanded)}>
      <div className="history-card-header">
        <div className="history-card-time">
          {completedDate ? formatTime(completedDate) : 'Unknown'}
        </div>
        <div className="history-card-count">
          {totalDrinks} {totalDrinks === 1 ? 'drink' : 'drinks'}
        </div>
      </div>

      <div className="history-card-drinks">
        {drinkSummary.slice(0, expanded ? undefined : 4).map((d, i) => (
          <span key={i} className="history-drink-chip">
            {d.emoji} {d.qty > 1 ? `${d.qty}x ` : ''}{d.name}
          </span>
        ))}
        {!expanded && drinkSummary.length > 4 && (
          <span className="history-drink-more">+{drinkSummary.length - 4} more</span>
        )}
      </div>

      {expanded && (
        <div className="history-card-detail">
          {round.orders.map(order => {
            const drinkName = order.customDrinkName || getDrinkById(order.drinkId)?.name || 'Unknown';
            const emoji = order.customDrinkName ? '🍹' : getDrinkById(order.drinkId)?.emoji || '🍹';
            return (
              <div key={order.id} className="history-order-line">
                <span className="history-order-person">{order.personName}</span>
                <span className="history-order-drink">
                  {emoji} {order.quantity > 1 ? `${order.quantity}x ` : ''}{drinkName}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
