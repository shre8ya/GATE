import React, { useState } from 'react';
import { Bell, Clock, Volume2, CheckCircle2, AlertCircle } from 'lucide-react';
import { requestNotificationPermission, sendNotification } from '../utils/notifications';
import { playBell, playClick } from '../utils/audio';

export default function RemindersModal({ 
  reminderSettings, 
  onSaveReminderSettings, 
  onClose,
  notifPermission,
  onPermissionUpdated
}) {
  const [morningTime, setMorningTime] = useState(reminderSettings.morningTime || '08:00');
  const [afternoonTime, setAfternoonTime] = useState(reminderSettings.afternoonTime || '14:00');
  const [eveningTime, setEveningTime] = useState(reminderSettings.eveningTime || '20:00');
  const [soundEnabled, setSoundEnabled] = useState(reminderSettings.soundEnabled !== false);
  const [spacedRecallAlerts, setSpacedRecallAlerts] = useState(reminderSettings.spacedRecallAlerts !== false);

  const handleRequestPermission = async () => {
    playClick();
    const result = await requestNotificationPermission();
    onPermissionUpdated(result);
  };

  const handleTestNotification = () => {
    playClick();
    sendNotification("GATE Matrix Alert Test", {
      body: "Reminders are working! Time for today's Engineering Maths lecture.",
      playSound: soundEnabled
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    playClick();
    onSaveReminderSettings({
      morningTime,
      afternoonTime,
      eveningTime,
      soundEnabled,
      spacedRecallAlerts
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sketch" onClick={e => e.stopPropagation()} style={{ padding: '28px' }}>
        <div className="tape-strip"></div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={26} color="#000" strokeWidth={2.2} />
            <div>
              <h2 className="font-title" style={{ fontSize: '1.4rem', margin: 0 }}>
                Study Reminders & Timetable Alerts
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
                Morning kick-off, maths slots, practice alarms, and spaced recall
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

        {/* Desktop Permission Banner */}
        <div className="sketch-card" style={{ 
          background: notifPermission === 'granted' ? 'var(--highlight-green)' : 'var(--highlight-yellow)', 
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
              {notifPermission === 'granted' ? '✓ Desktop Alerts Enabled' : 'Browser Notification Access'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#334155' }}>
              {notifPermission === 'granted' 
                ? 'You will receive study prompts directly on your screen.' 
                : 'Allow notifications to get study session alerts.'}
            </div>
          </div>

          {notifPermission !== 'granted' ? (
            <button type="button" className="btn-sketch btn-sketch-primary" onClick={handleRequestPermission} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
              Enable Alerts
            </button>
          ) : (
            <button type="button" className="btn-sketch" onClick={handleTestNotification} style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Bell size={13} color="#000" strokeWidth={2} /> Test Alert
            </button>
          )}
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Morning Kickoff</label>
              <input 
                type="time" 
                className="input-sketch" 
                value={morningTime} 
                onChange={e => setMorningTime(e.target.value)} 
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Maths Slot</label>
              <input 
                type="time" 
                className="input-sketch" 
                value={afternoonTime} 
                onChange={e => setAfternoonTime(e.target.value)} 
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Practice & Redo</label>
              <input 
                type="time" 
                className="input-sketch" 
                value={eveningTime} 
                onChange={e => setEveningTime(e.target.value)} 
              />
            </div>
          </div>

          {/* Toggle Switches */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                className="sketch-check"
                checked={soundEnabled} 
                onChange={e => setSoundEnabled(e.target.checked)}
              />
              <span>Enable Zen study bell chimes on timer & notifications</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                className="sketch-check"
                checked={spacedRecallAlerts} 
                onChange={e => setSpacedRecallAlerts(e.target.checked)}
              />
              <span>Daily reminder for Spaced Repetition Error Vault reviews</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" className="btn-sketch" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-sketch btn-sketch-primary">
              ✓ Save Preferences
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
