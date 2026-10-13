import React, { useState } from 'react';
import { Settings, User, Target, Key, AlertOctagon, Check } from 'lucide-react';
import { playClick, playSuccessChime } from '../utils/audio';

export default function SettingsModal({ 
  userProfile, 
  onSaveProfile, 
  onResetAll, 
  onClose 
}) {
  const [name, setName] = useState(userProfile.name || 'GATE Aspirant');
  const [targetRank, setTargetRank] = useState(userProfile.targetRank || 'AIR < 100');
  const [dailyGoalHours, setDailyGoalHours] = useState(userProfile.dailyGoalHours || 3.0);
  const [geminiApiKey, setGeminiApiKey] = useState(userProfile.geminiApiKey || '');

  const handleSave = (e) => {
    e.preventDefault();
    playClick();
    onSaveProfile({
      name,
      targetRank,
      dailyGoalHours: parseFloat(dailyGoalHours) || 3.0,
      geminiApiKey
    });
    playSuccessChime();
    onClose();
  };

  const handleResetConfirm = () => {
    if (window.confirm("⚠️ Are you sure you want to reset all planner progress, study history, and error logs? This cannot be undone.")) {
      playClick();
      onResetAll();
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sketch" onClick={e => e.stopPropagation()} style={{ padding: '28px' }}>
        <div className="tape-strip"></div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>⚙️</span>
            <div>
              <h2 className="font-title" style={{ fontSize: '1.4rem', margin: 0 }}>
                Personal Profile & Settings
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
                Target rank, daily study hours, and optional Gemini AI credentials
              </div>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-sketch" 
            onClick={onClose}
            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Your Name / Moniker:
            </label>
            <input 
              type="text" 
              className="input-sketch" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Target Rank:
              </label>
              <input 
                type="text" 
                className="input-sketch" 
                value={targetRank} 
                onChange={e => setTargetRank(e.target.value)} 
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Daily Study Target (Hours):
              </label>
              <input 
                type="number" 
                step="0.5"
                className="input-sketch" 
                value={dailyGoalHours} 
                onChange={e => setDailyGoalHours(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                Gemini API Key (Optional):
              </label>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer" 
                style={{ fontSize: '0.8rem', color: 'var(--pen-blue)', textDecoration: 'underline', fontStyle: 'italic' }}
              >
                Get free key ↗
              </a>
            </div>
            <input 
              type="password" 
              className="input-sketch" 
              placeholder="AIzaSy..." 
              value={geminiApiKey} 
              onChange={e => setGeminiApiKey(e.target.value)} 
            />
            <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginTop: '4px', fontStyle: 'italic' }}>
              🔒 Stored strictly in your local browser. Powers live AI doubt explanations & deep rescheduling prompts.
            </div>
          </div>

          {/* Danger Zone */}
          <div className="sketch-card" style={{ 
            marginTop: '8px', 
            padding: '14px 16px', 
            background: 'var(--highlight-pink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#9F1239' }}>Reset All Progress</div>
              <div style={{ fontSize: '0.8rem', color: '#475569' }}>Clears checked days, logs, and resets planner to Day 1</div>
            </div>
            <button 
              type="button" 
              className="btn-sketch btn-sketch-pink" 
              onClick={handleResetConfirm}
              style={{ fontSize: '0.85rem', padding: '6px 14px' }}
            >
              Reset Data
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" className="btn-sketch" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-sketch btn-sketch-primary">
              ✓ Save Settings
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
