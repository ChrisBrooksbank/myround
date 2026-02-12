// RegularsPage: Manage regulars with their favorite drinks and groups

import { useState } from 'react';
import { useRegulars } from '../hooks/useRegulars';
import { RegularEditor } from '../components/RegularEditor';
import { GroupEditor } from '../components/GroupEditor';
import { getDrinkById } from '../data/drinks';

export function RegularsPage() {
  const { regulars, groups } = useRegulars();
  const [editingRegularId, setEditingRegularId] = useState<string | null>(null);
  const [showRegularEditor, setShowRegularEditor] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [showGroupEditor, setShowGroupEditor] = useState(false);

  // Handle add new regular
  const handleAddRegular = () => {
    setEditingRegularId(null);
    setShowRegularEditor(true);
  };

  // Handle edit regular
  const handleEditRegular = (regularId: string) => {
    setEditingRegularId(regularId);
    setShowRegularEditor(true);
  };

  // Handle close regular editor
  const handleCloseRegularEditor = () => {
    setShowRegularEditor(false);
    setEditingRegularId(null);
  };

  // Handle add new group
  const handleAddGroup = () => {
    setEditingGroupId(null);
    setShowGroupEditor(true);
  };

  // Handle edit group
  const handleEditGroup = (groupId: string) => {
    setEditingGroupId(groupId);
    setShowGroupEditor(true);
  };

  // Handle close group editor
  const handleCloseGroupEditor = () => {
    setShowGroupEditor(false);
    setEditingGroupId(null);
  };

  return (
    <div className="regulars-page">
      {/* Regulars Section */}
      <div className="regulars-section">
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
      </div>

      {/* Groups Section */}
      <div className="groups-section">
        <div className="regulars-page-header">
          <h2 className="section-title">Groups</h2>
          <button className="add-group-button" onClick={handleAddGroup}>
            + Create Group
          </button>
        </div>

        {groups.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">
              No groups yet. Create groups like "Friday Crew" or "Work Lot" to quickly add multiple regulars!
            </p>
          </div>
        ) : (
          <div className="groups-list">
            {groups.map(group => (
              <div key={group.id} className="group-card">
                <div className="group-card-header">
                  <h3 className="group-name">{group.name}</h3>
                  <button
                    className="edit-group-button"
                    onClick={() => handleEditGroup(group.id)}
                    aria-label={`Edit ${group.name}`}
                  >
                    Edit
                  </button>
                </div>
                <div className="group-members">
                  {group.memberIds.map(memberId => {
                    const regular = regulars.find(r => r.id === memberId);
                    if (!regular) return null;

                    return (
                      <div key={memberId} className="group-member-chip">
                        {regular.name}
                      </div>
                    );
                  })}
                  {group.memberIds.length === 0 && (
                    <p className="group-empty-text">No members</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Regular Editor Modal */}
      {showRegularEditor && (
        <RegularEditor
          regularId={editingRegularId}
          onClose={handleCloseRegularEditor}
        />
      )}

      {/* Group Editor Modal */}
      {showGroupEditor && (
        <GroupEditor
          groupId={editingGroupId}
          onClose={handleCloseGroupEditor}
        />
      )}
    </div>
  );
}
