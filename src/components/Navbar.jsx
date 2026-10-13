import React from 'react';
import { 
  Flame, 
  Clock, 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle, 
  GraduationCap, 
  Compass, 
  Zap, 
  Bot, 
  Bell, 
  Download, 
  Settings,
  Sparkles,
  Sun,
  Moon,
  Palette,
  Upload,
  Layers,
  Users
} from 'lucide-react';
import { playClick } from '../utils/audio';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  streak = 1, 
  todayStats, 
  userProfile,
  onOpenSettings, 
  onOpenBackup, 
  onOpenReminders,
  onOpenReschedule,
  onOpenImport,
  onOpenCustomizer,
  profilesList = [],
  activeProfileId,
  onSwitchProfile,
  theme,
  onToggleTheme,
  paperTheme = 'parchment',
  onSelectPaperTheme,
  notifPermission
}) {
  const tabs = [
    { 
      id: 'today', 
      label: "War Room (Today)", 
      icon: Compass, 
      badge: 'Live' 
    },
    { 
      id: 'vault', 
      label: 'Weapon Vault (Errors & Formulas)', 
      icon: AlertTriangle, 
      count: todayStats?.errorsDue || 0 
    },
    { 
      id: 'radar', 
      label: 'Radar (Calendar & Planner)', 
      icon: Calendar, 
      badge: 'Roadmap' 
    },
  ];

  return (
    <header className="sketch-card" style={{ 
      margin: '14px 18px', 
      padding: '12px 18px', 
      position: 'sticky', 
      top: '10px', 
      zIndex: 100,
      background: 'var(--paper-card)'
    }}>
      <div className="tape-strip"></div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        
        {/* Brand & Handwriting Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '42px', 
            height: '42px', 
            borderRadius: 'var(--sketch-radius-sm)',
            background: 'var(--highlight-yellow)',
            border: '2px solid var(--ink-border)',
            boxShadow: '2px 2px 0px var(--ink-border)'
          }}>
            <span style={{ fontSize: '1.4rem' }}>📓</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="font-title" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                GATE <span className="highlight-pen">MATRIX</span>
              </span>
              <span className="badge-sketch badge-sketch-yellow">CSE 2027</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                IIT Madras Organizer
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>✏️ Personal Study Journal & 12-Week Roadmap</span>
            </div>
          </div>
        </div>

        {/* Center: Hand-Drawn Stats Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          
          <div className="badge-sketch badge-sketch-orange" title="Daily Study Streak">
            <Flame size={15} color="#D97706" fill="#D97706" />
            <span>Streak: {streak}d 🔥</span>
          </div>

          <div className="badge-sketch badge-sketch-blue" title="Today's Target Hours">
            <Clock size={15} color="#2563EB" />
            <span>Target: {todayStats?.hoursToday || 2.5}h / day</span>
          </div>

          <div className="badge-sketch badge-sketch-pink" title="Days to GATE 2027">
            <GraduationCap size={15} color="#DB2777" />
            <span>GATE '27: ~114d</span>
          </div>

          {/* AI Rescheduler Button */}
          <button 
            className="btn-sketch btn-sketch-primary"
            onClick={onOpenReschedule}
            style={{ padding: '4px 10px', fontSize: '0.82rem' }}
            title="Missed a topic or day? Reorganize with AI"
          >
            <Sparkles size={14} /> AI Reschedule
          </button>

          {/* Custom Resources Button */}
          <button
            className="btn-sketch"
            onClick={onOpenCustomizer}
            style={{ padding: '4px 10px', fontSize: '0.82rem', background: 'var(--paper-card-subtle)' }}
            title="Personalize & Swap Playlists with AI (e.g. Gate Smashers, Abdul Bari, Amit Khurana)"
          >
            <Zap size={14} color="#D97706" /> Swap Resources
          </button>

          {/* Universal File Import Studio Button */}
          <button
            className="btn-sketch"
            onClick={onOpenImport}
            style={{ padding: '4px 10px', fontSize: '0.82rem', background: 'var(--highlight-yellow)' }}
            title="Import Excel (.xlsx/.csv), PDF, TXT or JSON directly into dashboard"
          >
            <Upload size={14} /> Import File
          </button>
        </div>

        {/* Right: Paper Themes, Notifications, Backup, Settings & Profile Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          
          {/* Paper Color Palette Selector */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              background: 'var(--paper-card-subtle)', 
              padding: '4px 8px', 
              borderRadius: '6px', 
              border: '1.5px solid var(--ink-border)' 
            }} 
            title="Choose Hand-Drawn Paper Stationery Style"
          >
            <Palette size={14} color="var(--ink-secondary)" />
            <select
              value={paperTheme}
              onChange={e => onSelectPaperTheme && onSelectPaperTheme(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontFamily: 'inherit',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--ink-primary)',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="parchment">📜 Parchment</option>
              <option value="ivory">📓 Ivory Moleskine</option>
              <option value="sage">🌿 Sage Mint</option>
              <option value="rose">🌸 Rose Coral</option>
              <option value="blueprint">🩵 Blueprint Grid</option>
            </select>
          </div>

          <button 
            className="btn-sketch" 
            onClick={onOpenReminders}
            title={notifPermission === 'granted' ? "Reminders (Active)" : "Enable Alerts"}
            style={{ padding: '6px 10px' }}
          >
            <Bell size={16} color={notifPermission === 'granted' ? "#15803D" : "currentColor"} />
          </button>

          <button 
            className="btn-sketch" 
            onClick={onOpenBackup}
            title="Backup & Restore Data (Export JSON)"
            style={{ padding: '6px 10px' }}
          >
            <Download size={16} />
          </button>

          {/* Profile Switcher Quick Dropdown / Settings Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {profilesList.length > 1 && (
              <select
                value={activeProfileId}
                onChange={e => {
                  playClick();
                  onSwitchProfile && onSwitchProfile(e.target.value);
                }}
                style={{
                  background: 'var(--paper-card-subtle)',
                  border: '1.5px solid var(--ink-border)',
                  borderRadius: '6px',
                  padding: '4px 6px',
                  fontFamily: 'inherit',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: 'var(--ink-primary)'
                }}
                title="Switch active user profile"
              >
                {profilesList.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.avatar || '👤'} {p.name}
                  </option>
                ))}
              </select>
            )}

            <button 
              className="btn-sketch btn-sketch-primary" 
              onClick={() => onOpenSettings && onOpenSettings('profile')}
              title="Personalization, Records & Multi-User Manager"
              style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>{userProfile?.avatar || '🦉'}</span>
              <span style={{ fontWeight: 700 }}>{userProfile?.name || 'Shreya'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Tabs Menu Strip */}
      <nav style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        marginTop: '12px', 
        paddingTop: '10px', 
        borderTop: '2px dashed var(--ink-border)',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn-sketch"
              style={{
                background: isActive 
                  ? 'var(--highlight-yellow)' 
                  : tab.highlight 
                  ? 'var(--highlight-purple)' 
                  : 'var(--paper-card)',
                boxShadow: isActive ? '3px 3px 0px var(--ink-border)' : '1px 1px 0px var(--ink-border)',
                transform: isActive ? 'translate(-1px, -1px)' : 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                padding: '6px 12px'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="badge-sketch badge-sketch-pink" style={{ padding: '1px 5px', fontSize: '0.7rem' }}>
                  {tab.badge}
                </span>
              )}
              {tab.count > 0 && (
                <span className="badge-sketch badge-sketch-orange" style={{ padding: '1px 5px', fontSize: '0.7rem' }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
