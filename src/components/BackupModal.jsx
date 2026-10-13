import React, { useState } from 'react';
import { Download, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';
import { exportBackupData, importBackupData } from '../utils/storage';
import { playClick, playSuccessChime } from '../utils/audio';

export default function BackupModal({ onClose, onDataRestored }) {
  const [importStatus, setImportStatus] = useState(null);

  const handleExport = () => {
    playClick();
    const backup = exportBackupData();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GATE_Matrix_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    playSuccessChime();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        const success = importBackupData(content);
        if (success) {
          playSuccessChime();
          setImportStatus('success');
          setTimeout(() => {
            onDataRestored();
            onClose();
          }, 1200);
        } else {
          setImportStatus('error');
        }
      } catch (err) {
        setImportStatus('error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sketch" onClick={e => e.stopPropagation()} style={{ padding: '28px' }}>
        <div className="tape-strip"></div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>💾</span>
            <div>
              <h2 className="font-title" style={{ fontSize: '1.4rem', margin: 0 }}>
                Backup & Sync Study Journal
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
                Export your checked syllabus, error logs, and notes to a portable file
              </div>
            </div>
          </div>
          <button 
            className="btn-sketch" 
            onClick={onClose}
            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
          >
            ✕
          </button>
        </div>

        <p style={{ color: 'var(--ink-secondary)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.5 }}>
          Your study records, error logs, mock scores, and personal journal notes are stored securely in your browser. Export regular backups so you never lose your progress!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          
          {/* Export Box */}
          <div className="sketch-card" style={{ 
            padding: '20px', 
            textAlign: 'center',
            background: 'var(--highlight-blue)'
          }}>
            <Download size={32} color="#1D4ED8" style={{ margin: '0 auto 10px' }} />
            <h3 className="font-title" style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Export Backup</h3>
            <p style={{ fontSize: '0.85rem', color: '#1E293B', marginBottom: '16px' }}>
              Download complete state as a portable JSON file.
            </p>
            <button className="btn-sketch btn-sketch-primary" onClick={handleExport} style={{ width: '100%' }}>
              Download .json
            </button>
          </div>

          {/* Import Box */}
          <div className="sketch-card" style={{ 
            padding: '20px', 
            textAlign: 'center',
            background: 'var(--highlight-green)'
          }}>
            <Upload size={32} color="#15803D" style={{ margin: '0 auto 10px' }} />
            <h3 className="font-title" style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Restore Backup</h3>
            <p style={{ fontSize: '0.85rem', color: '#1E293B', marginBottom: '16px' }}>
              Upload an existing backup file to restore your progress.
            </p>
            <label className="btn-sketch" style={{ width: '100%', cursor: 'pointer', display: 'inline-block' }}>
              Upload .json
              <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>

        </div>

        {importStatus === 'success' && (
          <div className="sketch-card" style={{ padding: '12px', background: 'var(--highlight-green)', color: '#14532D', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700 }}>
            ✓ Backup successfully restored! Refreshing command center...
          </div>
        )}

        {importStatus === 'error' && (
          <div className="sketch-card" style={{ padding: '12px', background: 'var(--highlight-pink)', color: '#9F1239', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700 }}>
            ✕ Invalid backup file format. Please upload a valid JSON backup.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button className="btn-sketch" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
