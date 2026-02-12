// SummaryPage: Bar review screen with tick-off and round completion

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRound } from '../hooks/useRound';
import { SummaryView } from '../components/SummaryView';

export function SummaryPage() {
  const navigate = useNavigate();
  const { round, toggleOrdered, completeRound } = useRound();
  const [viewMode, setViewMode] = useState<'by-drink' | 'by-person'>('by-drink');
  const [showDoneConfirm, setShowDoneConfirm] = useState(false);

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
          <button className="done-button" onClick={() => setShowDoneConfirm(true)}>
            ✓ Done
          </button>
        </div>
      )}

      {/* Done Confirmation Modal */}
      {showDoneConfirm && (
        <div className="modal-overlay" onClick={() => setShowDoneConfirm(false)}>
          <div className="modal-content delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Complete Round?</h3>
            <p className="delete-confirm-text">
              This will clear the current round ({round.orders.length} {round.orders.length === 1 ? 'order' : 'orders'}) and save it to history.
            </p>
            <div className="modal-buttons">
              <button
                className="modal-button modal-button-cancel"
                onClick={() => setShowDoneConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="modal-button modal-button-confirm"
                onClick={handleDone}
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
