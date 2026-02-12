// SummaryPage: Bar review screen with tick-off and round completion

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRound } from '../hooks/useRound';
import { SummaryView } from '../components/SummaryView';

export function SummaryPage() {
  const navigate = useNavigate();
  const { round, toggleOrdered, completeRound } = useRound();
  const [viewMode, setViewMode] = useState<'by-drink' | 'by-person'>('by-drink');

  // Handle "Done" button - archive round and navigate back
  const handleDone = () => {
    completeRound();
    navigate('/');
  };

  return (
    <div className="summary-page">
      <div className="summary-page-header">
        <div className="view-toggle">
          <button
            className={`view-toggle-button ${viewMode === 'by-drink' ? 'active' : ''}`}
            onClick={() => setViewMode('by-drink')}
          >
            By Drink
          </button>
          <button
            className={`view-toggle-button ${viewMode === 'by-person' ? 'active' : ''}`}
            onClick={() => setViewMode('by-person')}
          >
            By Person
          </button>
        </div>
      </div>

      <SummaryView
        orders={round.orders}
        viewMode={viewMode}
        onToggleOrdered={toggleOrdered}
      />

      {round.orders.length > 0 && (
        <div className="summary-page-footer">
          <button className="done-button" onClick={handleDone}>
            ✓ Done
          </button>
        </div>
      )}
    </div>
  );
}
