import React, { useState, useRef, useEffect } from 'react';
import { 
  Flame, 
  Calendar, 
  AlertTriangle, 
  Compass, 
  Sparkles, 
  Zap, 
  Upload, 
  Palette, 
  Bell, 
  Download, 
  ChevronDown,
  User,
  Sliders,
  Settings
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
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const toolsMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target)) {
        setShowToolsMenu(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabs = [
    { 
      id: 'today', 
      label: "War Room", 
      icon: Compass, 
      desc: "Today's Mission" 
    },
    { 
      id: 'vault', 
      label: 'Weapon Vault', 
      icon: AlertTriangle, 
      count: todayStats?.errorsDue || 0 
    },
    { 
      id: 'radar', 
      label: 'Radar', 
      icon: Calendar, 
      desc: 'Calendar & Roadmap' 
    },
  ];

  return (
    <header className="sketch-card" style={{ 
      margin: '12px 18px 16px', 
      padding: '10px 18px', 
      position: 'sticky', 
      top: '10px', 
      zIndex: 100,
      background: 'var(--paper-card)',
      boxShadow: 'var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.06))'
    }}>
      <div className="tape-strip" style={{ opacity: 0.85 }}></div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        
        {/* Left: Brand Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '36px', 
            height: '36px', 
            borderRadius: '6px',
            background: 'var(--highlight-yellow, #FEF08A)',
            border: '2px solid var(--ink-border)'
          }}>
            <span style={{ fontSize: '1.2rem' }}>📓</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="font-title" style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                GATE <span className="highlight-pen">MATRIX</span>
              </span>
              <span className="badge-sketch badge-sketch-yellow" style={{ fontSize: '0.72rem', padding: '1px 6px' }}>
                CSE 2027
              </span>
            </div>
          </div>
        </div>

        {/* Center: Sleek 3-Workspace Segmented Tabs */}
        <nav style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          background: 'var(--paper-card-subtle, rgba(0,0,0,0.03))',
          padding: '4px 6px',
          borderRadius: '8px',
          border: '1.5px solid var(--ink-border)'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClick();
                  setActiveTab(tab.id);
                }}
                className={`btn-sketch ${isActive ? 'btn-sketch-primary' : ''}`}
                style={{
                  padding: '5px 12px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 800 : 600,
                  border: isActive ? '2px solid var(--ink-border)' : '1px solid transparent',
                  background: isActive ? undefined : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isActive ? '2px 2px 0px var(--ink-border)' : 'none'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span style={{
                    fontSize: '0.68rem',
                    background: '#E11D48',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '0 5px',
                    marginLeft: '2px'
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Streak, Tools Dropdown, & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          
          {/* Subtle Streak Pill */}
          <div 
            className="badge-sketch badge-sketch-orange" 
            title="Daily Study Streak"
            style={{ fontSize: '0.8rem', padding: '4px 8px' }}
          >
            <Flame size={14} color="#D97706" fill="#D97706" />
            <span>{streak}d</span>
          </div>

          {/* Unified Tools Popover Menu */}
          <div style={{ position: 'relative' }} ref={toolsMenuRef}>
            <button
              className="btn-sketch"
              onClick={() => setShowToolsMenu(prev => !prev)}
              style={{ 
                padding: '5px 10px', 
                fontSize: '0.82rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px',
                background: showToolsMenu ? 'var(--paper-card-subtle)' : undefined
              }}
              title="Assistant Tools & Utilities"
            >
              <Zap size={14} color="#D97706" />
              <span>Tools</span>
              <ChevronDown size={13} style={{ opacity: 0.6 }} />
            </button>

            {showToolsMenu && (
              <div 
                className="sketch-card"
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '240px',
                  padding: '8px',
                  zIndex: 200,
                  background: 'var(--paper-card)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <button
                  className="btn-sketch"
                  onClick={() => {
                    setShowToolsMenu(false);
                    onOpenReschedule();
                  }}
                  style={{ justifyContent: 'flex-start', padding: '7px 10px', fontSize: '0.82rem', width: '100%' }}
                >
                  <Sparkles size={14} color="#2563EB" />
                  <span>AI Catch-Up Rescheduler</span>
                </button>

                <button
                  className="btn-sketch"
                  onClick={() => {
                    setShowToolsMenu(false);
                    onOpenCustomizer();
                  }}
                  style={{ justifyContent: 'flex-start', padding: '7px 10px', fontSize: '0.82rem', width: '100%' }}
                >
                  <Zap size={14} color="#D97706" />
                  <span>Swap Video Playlists</span>
                </button>

                <button
                  className="btn-sketch"
                  onClick={() => {
                    setShowToolsMenu(false);
                    onOpenImport();
                  }}
                  style={{ justifyContent: 'flex-start', padding: '7px 10px', fontSize: '0.82rem', width: '100%' }}
                >
                  <Upload size={14} />
                  <span>Import File (Excel / PDF / TXT)</span>
                </button>

                <button
                  className="btn-sketch"
                  onClick={() => {
                    setShowToolsMenu(false);
                    onOpenReminders();
                  }}
                  style={{ justifyContent: 'flex-start', padding: '7px 10px', fontSize: '0.82rem', width: '100%' }}
                >
                  <Bell size={14} color={notifPermission === 'granted' ? '#15803D' : 'currentColor'} />
                  <span>Study Reminders</span>
                </button>

                <button
                  className="btn-sketch"
                  onClick={() => {
                    setShowToolsMenu(false);
                    onOpenBackup();
                  }}
                  style={{ justifyContent: 'flex-start', padding: '7px 10px', fontSize: '0.82rem', width: '100%' }}
                >
                  <Download size={14} />
                  <span>Backup & Restore Data</span>
                </button>

                {/* Paper Color Palette Picker */}
                <div style={{ 
                  marginTop: '4px', 
                  paddingTop: '6px', 
                  borderTop: '1px dashed var(--ink-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingLeft: '6px',
                  paddingRight: '6px'
                }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Palette size={13} /> Theme:
                  </span>
                  <select
                    value={paperTheme}
                    onChange={e => onSelectPaperTheme && onSelectPaperTheme(e.target.value)}
                    style={{
                      border: '1px solid var(--ink-border)',
                      borderRadius: '4px',
                      background: 'var(--paper-card-subtle)',
                      fontFamily: 'inherit',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--ink-primary)',
                      cursor: 'pointer',
                      padding: '2px 4px'
                    }}
                  >
                    <option value="parchment">📜 Parchment</option>
                    <option value="ivory">📓 Ivory Moleskine</option>
                    <option value="sage">🌿 Sage Mint</option>
                    <option value="rose">🌸 Rose Coral</option>
                    <option value="blueprint">🩵 Blueprint Grid</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Profile Switcher & Settings Dropdown */}
          <div style={{ position: 'relative' }} ref={profileMenuRef}>
            <button 
              className="btn-sketch btn-sketch-primary" 
              onClick={() => setShowProfileMenu(prev => !prev)}
              title="User Profiles & Personalization"
              style={{ 
                padding: '5px 10px', 
                fontSize: '0.82rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px' 
              }}
            >
              <span>{userProfile?.avatar || '🦉'}</span>
              <span style={{ fontWeight: 700, maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userProfile?.name || 'Shreya'}
              </span>
              <ChevronDown size={13} style={{ opacity: 0.7 }} />
            </button>

            {showProfileMenu && (
              <div 
                className="sketch-card"
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '210px',
                  padding: '8px',
                  zIndex: 200,
                  background: 'var(--paper-card)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                {/* Profiles List */}
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--ink-muted)', padding: '4px 6px' }}>
                  PROFILES ({profilesList.length})
                </div>

                {profilesList.map(p => (
                  <button
                    key={p.id}
                    className="btn-sketch"
                    onClick={() => {
                      playClick();
                      setShowProfileMenu(false);
                      onSwitchProfile && onSwitchProfile(p.id);
                    }}
                    style={{
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      fontSize: '0.8rem',
                      background: p.id === activeProfileId ? 'var(--highlight-blue, rgba(37,99,235,0.08))' : 'transparent',
                      border: p.id === activeProfileId ? '1.5px solid var(--ink-blue, #2563EB)' : '1px solid transparent'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{p.avatar || '👤'}</span>
                      <strong style={{ fontWeight: p.id === activeProfileId ? 800 : 600 }}>{p.name}</strong>
                    </span>
                    {p.id === activeProfileId && <span style={{ fontSize: '0.7rem', color: '#2563EB' }}>Active</span>}
                  </button>
                ))}

                <div style={{ borderTop: '1px dashed var(--ink-border)', marginTop: '4px', paddingTop: '4px' }}>
                  <button
                    className="btn-sketch"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenSettings && onOpenSettings('profile');
                    }}
                    style={{ justifyContent: 'flex-start', padding: '6px 8px', fontSize: '0.8rem', width: '100%' }}
                  >
                    <Settings size={14} />
                    <span>Manage Profiles & Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </header>
  );
}
