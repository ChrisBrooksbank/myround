// SettingsPage: Export and import user data

import { useState, useRef } from 'react';
import { exportAllData, importAllData, getDataCounts } from '../lib/storage';
import './SettingsPage.css';

export function SettingsPage() {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const counts = getDataCounts();

  const handleExport = () => {
    try {
      const json = exportAllData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const date = new Date().toISOString().split('T')[0];
      const a = document.createElement('a');
      a.href = url;
      a.download = `myround-backup-${date}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'Backup downloaded' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to export data' });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setShowConfirm(true);
    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmImport = async () => {
    if (!pendingFile) return;
    setShowConfirm(false);
    try {
      const text = await pendingFile.text();
      const summary = importAllData(text);
      setMessage({ type: 'success', text: `Restored: ${summary}` });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Import failed' });
    }
    setPendingFile(null);
  };

  const handleCancelImport = () => {
    setShowConfirm(false);
    setPendingFile(null);
  };

  return (
    <div className="settings-page">
      <h1 className="page-title">Settings</h1>

      {/* Data Overview */}
      <div className="settings-section">
        <h2 className="settings-section-title">Your Data</h2>
        <div className="data-counts">
          <div className="data-count-item">
            <span className="data-count-number">{counts.regulars}</span>
            <span className="data-count-label">Regulars</span>
          </div>
          <div className="data-count-item">
            <span className="data-count-number">{counts.groups}</span>
            <span className="data-count-label">Groups</span>
          </div>
          <div className="data-count-item">
            <span className="data-count-number">{counts.customDrinks}</span>
            <span className="data-count-label">Custom Drinks</span>
          </div>
          <div className="data-count-item">
            <span className="data-count-number">{counts.rounds}</span>
            <span className="data-count-label">Rounds</span>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="settings-section">
        <h2 className="settings-section-title">Export</h2>
        <p className="settings-section-desc">
          Download a backup of all your data as a JSON file.
        </p>
        <button className="settings-button settings-button-primary" onClick={handleExport}>
          Export Data
        </button>
      </div>

      {/* Import Section */}
      <div className="settings-section">
        <h2 className="settings-section-title">Import</h2>
        <p className="settings-section-desc">
          Restore from a previous backup file.
        </p>
        <p className="settings-warning">This will replace all current data</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="settings-file-input"
          onChange={handleFileSelect}
        />
        <button
          className="settings-button settings-button-import"
          onClick={() => fileInputRef.current?.click()}
        >
          Import Data
        </button>
      </div>

      {/* Feedback Message */}
      {message && (
        <div className={`settings-message settings-message-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="modal-overlay" onClick={handleCancelImport}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Replace all data?</h3>
            <p className="delete-confirm-text">
              Importing will <strong>overwrite</strong> all your current regulars, groups, custom drinks, and round history. This cannot be undone.
            </p>
            <div className="modal-buttons">
              <button
                className="modal-button modal-button-cancel"
                onClick={handleCancelImport}
              >
                Cancel
              </button>
              <button
                className="modal-button modal-button-danger"
                onClick={handleConfirmImport}
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
