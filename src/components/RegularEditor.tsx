// RegularEditor: Add/edit/delete regulars with multiple favorite drinks

import { useState, useEffect } from 'react';
import { drinks, getDrinkById } from '../data/drinks';
import { useRegulars } from '../hooks/useRegulars';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface RegularEditorProps {
  regularId?: string | null;
  onClose: () => void;
}

export function RegularEditor({ regularId, onClose }: RegularEditorProps) {
  const { regulars, addRegular, updateRegular, deleteRegular } = useRegulars();

  // Find the regular if editing
  const existingRegular = regularId ? regulars.find(r => r.id === regularId) : null;

  // Form state
  const [name, setName] = useState(existingRegular?.name || '');
  const [selectedDrinkIds, setSelectedDrinkIds] = useState<string[]>(
    existingRegular?.favouriteDrinkIds || []
  );
  const [showDrinkPicker, setShowDrinkPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Update form when regularId changes (only depend on regularId to avoid resetting on every render)
  useEffect(() => {
    const reg = regularId ? regulars.find(r => r.id === regularId) : null;
    if (reg) {
      setName(reg.name);
      setSelectedDrinkIds(reg.favouriteDrinkIds);
    } else {
      setName('');
      setSelectedDrinkIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regularId]);

  // Filter drinks based on search query
  const filteredDrinks = searchQuery.trim()
    ? drinks.filter(drink =>
        drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drink.shortName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : drinks;

  // Handle drink selection
  const handleDrinkToggle = (drinkId: string) => {
    if (selectedDrinkIds.includes(drinkId)) {
      // Remove drink
      setSelectedDrinkIds(prev => prev.filter(id => id !== drinkId));
    } else {
      // Add drink (max 3)
      if (selectedDrinkIds.length < 3) {
        setSelectedDrinkIds(prev => [...prev, drinkId]);
      }
    }
  };

  // Handle save
  const handleSave = () => {
    if (!name.trim()) return;
    if (selectedDrinkIds.length === 0) return;

    if (existingRegular) {
      updateRegular(existingRegular.id, name.trim(), selectedDrinkIds);
    } else {
      addRegular(name.trim(), selectedDrinkIds);
    }

    onClose();
  };

  // Handle delete
  const handleDelete = () => {
    if (existingRegular) {
      deleteRegular(existingRegular.id);
      onClose();
    }
  };

  // Check if form is valid
  const isValid = name.trim() !== '' && selectedDrinkIds.length > 0 && selectedDrinkIds.length <= 3;

  // Focus traps for modals
  const mainModalRef = useFocusTrap(true, onClose);
  const drinkPickerRef = useFocusTrap(showDrinkPicker, () => setShowDrinkPicker(false));
  const deleteConfirmRef = useFocusTrap(showDeleteConfirm, () => setShowDeleteConfirm(false));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content regular-editor" ref={mainModalRef} onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          {existingRegular ? 'Edit Regular' : 'Add Regular'}
        </h2>

        {/* Name Input */}
        <div className="editor-section">
          <label className="editor-label">Name</label>
          <input
            type="text"
            className="editor-input"
            placeholder="Enter name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        {/* Favorite Drinks */}
        <div className="editor-section">
          <label className="editor-label">
            Favorite Drinks ({selectedDrinkIds.length}/3)
          </label>

          {/* Selected drinks display */}
          {selectedDrinkIds.length > 0 && (
            <div className="selected-drinks">
              {selectedDrinkIds.map(drinkId => {
                const drink = getDrinkById(drinkId);
                if (!drink) return null;

                return (
                  <div key={drinkId} className="selected-drink-chip">
                    <span className="chip-emoji">{drink.emoji}</span>
                    <span className="chip-name">{drink.shortName}</span>
                    <button
                      className="chip-remove"
                      onClick={() => handleDrinkToggle(drinkId)}
                      aria-label="Remove drink"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add drinks button */}
          <button
            className="editor-button-secondary"
            onClick={() => setShowDrinkPicker(true)}
            disabled={selectedDrinkIds.length >= 3}
          >
            {selectedDrinkIds.length === 0 ? 'Select Drinks' : 'Add More Drinks'}
          </button>
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
            {existingRegular ? 'Update' : 'Add'}
          </button>
        </div>

        {/* Delete Button (only for existing regulars) */}
        {existingRegular && (
          <button
            className="editor-delete-button"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Regular
          </button>
        )}
      </div>

      {/* Drink Picker Modal */}
      {showDrinkPicker && (
        <div className="modal-overlay" onClick={() => setShowDrinkPicker(false)}>
          <div className="modal-content drink-picker-modal" ref={drinkPickerRef} onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Select Drinks</h3>

            {/* Search Input */}
            <input
              type="text"
              className="editor-input search-input"
              placeholder="Search drinks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />

            {/* Drinks List */}
            <div className="drink-picker-list">
              {filteredDrinks.map(drink => {
                const isSelected = selectedDrinkIds.includes(drink.id);
                const canSelect = selectedDrinkIds.length < 3 || isSelected;

                return (
                  <button
                    key={drink.id}
                    className={`drink-picker-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDrinkToggle(drink.id)}
                    disabled={!canSelect}
                  >
                    <span className="drink-picker-emoji">{drink.emoji}</span>
                    <span className="drink-picker-name">{drink.name}</span>
                    {isSelected && <span className="drink-picker-check">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Close Button */}
            <button
              className="modal-close-button"
              onClick={() => setShowDrinkPicker(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content delete-confirm-modal" ref={deleteConfirmRef} onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Delete Regular?</h3>
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
