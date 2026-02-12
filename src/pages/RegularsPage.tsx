// RegularsPage: Manage regulars with their favorite drinks

import { useState } from 'react';
import { useRegulars } from '../hooks/useRegulars';
import { RegularEditor } from '../components/RegularEditor';
import { getDrinkById } from '../data/drinks';

export function RegularsPage() {
  const { regulars } = useRegulars();
  const [editingRegularId, setEditingRegularId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  // Handle add new regular
  const handleAddRegular = () => {
    setEditingRegularId(null);
    setShowEditor(true);
  };

  // Handle edit regular
  const handleEditRegular = (regularId: string) => {
    setEditingRegularId(regularId);
    setShowEditor(true);
  };

  // Handle close editor
  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingRegularId(null);
  };

  return (
    <div className="regulars-page">
      <div className="regulars-page-header">
        <h1 className="page-title">Regulars</h1>
        <button className="add-regular-button" onClick={handleAddRegular}>
          + Add Regular
        </button>
      </div>

      {regulars.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">
            No regulars yet. Add your drinking mates with their favorite drinks for quick ordering!
          </p>
        </div>
      ) : (
        <div className="regulars-list">
          {regulars.map(regular => (
            <div key={regular.id} className="regular-card">
              <div className="regular-card-header">
                <h3 className="regular-name">{regular.name}</h3>
                <button
                  className="edit-regular-button"
                  onClick={() => handleEditRegular(regular.id)}
                  aria-label={`Edit ${regular.name}`}
                >
                  Edit
                </button>
              </div>
              <div className="regular-favorites">
                {regular.favouriteDrinkIds.map(drinkId => {
                  const drink = getDrinkById(drinkId);
                  if (!drink) return null;

                  return (
                    <div key={drinkId} className="favorite-drink-chip">
                      <span className="drink-emoji">{drink.emoji}</span>
                      <span className="drink-name">{drink.shortName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Regular Editor Modal */}
      {showEditor && (
        <RegularEditor
          regularId={editingRegularId}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
}
