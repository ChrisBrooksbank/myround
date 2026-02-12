// GroupEditor: Create/edit/delete groups with member selection

import { useState, useEffect } from 'react';
import { useRegulars } from '../hooks/useRegulars';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface GroupEditorProps {
  groupId?: string | null;
  onClose: () => void;
}

export function GroupEditor({ groupId, onClose }: GroupEditorProps) {
  const { regulars, groups, addGroup, updateGroup, deleteGroup } = useRegulars();

  // Find the group if editing
  const existingGroup = groupId ? groups.find(g => g.id === groupId) : null;

  // Form state
  const [name, setName] = useState(existingGroup?.name || '');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
    existingGroup?.memberIds || []
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Update form when groupId changes (only depend on groupId to avoid resetting on every render)
  useEffect(() => {
    const grp = groupId ? groups.find(g => g.id === groupId) : null;
    if (grp) {
      setName(grp.name);
      setSelectedMemberIds(grp.memberIds);
    } else {
      setName('');
      setSelectedMemberIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  // Handle member selection
  const handleMemberToggle = (regularId: string) => {
    if (selectedMemberIds.includes(regularId)) {
      // Remove member
      setSelectedMemberIds(prev => prev.filter(id => id !== regularId));
    } else {
      // Add member
      setSelectedMemberIds(prev => [...prev, regularId]);
    }
  };

  // Handle save
  const handleSave = () => {
    if (!name.trim()) return;
    if (selectedMemberIds.length === 0) return;

    if (existingGroup) {
      updateGroup(existingGroup.id, name.trim(), selectedMemberIds);
    } else {
      addGroup(name.trim(), selectedMemberIds);
    }

    onClose();
  };

  // Handle delete
  const handleDelete = () => {
    if (existingGroup) {
      deleteGroup(existingGroup.id);
      onClose();
    }
  };

  // Check if form is valid
  const isValid = name.trim() !== '' && selectedMemberIds.length > 0;

  // Focus traps for modals
  const mainModalRef = useFocusTrap(true, onClose);
  const deleteConfirmRef = useFocusTrap(showDeleteConfirm, () => setShowDeleteConfirm(false));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content group-editor" ref={mainModalRef} onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          {existingGroup ? 'Edit Group' : 'Create Group'}
        </h2>

        {/* Name Input */}
        <div className="editor-section">
          <label className="editor-label">Group Name</label>
          <input
            type="text"
            className="editor-input"
            placeholder="e.g. Friday Crew, Work Lot..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        {/* Members Selection */}
        <div className="editor-section">
          <label className="editor-label">
            Members ({selectedMemberIds.length} selected)
          </label>

          {regulars.length === 0 ? (
            <p className="editor-hint">
              Add some regulars first to create a group!
            </p>
          ) : (
            <div className="member-selection-list">
              {regulars.map(regular => {
                const isSelected = selectedMemberIds.includes(regular.id);

                return (
                  <button
                    key={regular.id}
                    className={`member-selection-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleMemberToggle(regular.id)}
                  >
                    <span className="member-name">{regular.name}</span>
                    {isSelected && <span className="member-check">✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="editor-actions">
          <button
            className="modal-button modal-button-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="modal-button modal-button-confirm"
            onClick={handleSave}
            disabled={!isValid}
          >
            {existingGroup ? 'Update' : 'Create'}
          </button>
        </div>

        {/* Delete Button (only for existing groups) */}
        {existingGroup && (
          <button
            className="editor-delete-button"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Group
          </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content delete-confirm-modal" ref={deleteConfirmRef} onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Delete Group?</h3>
            <p className="delete-confirm-text">
              Are you sure you want to delete <strong>{name}</strong>? This cannot be undone.
            </p>
            <div className="modal-buttons">
              <button
                className="modal-button modal-button-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="modal-button modal-button-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
