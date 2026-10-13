import React, { useState } from 'react';
import { 
  User, 
  Target, 
  Award, 
  Clock, 
  Sparkles, 
  BookOpen, 
  Trash2, 
  Plus, 
  Check, 
  Shield, 
  BarChart2, 
  Calendar,
  Flame,
  Zap,
  FolderDown
} from 'lucide-react';
import { playClick, playSuccessChime } from '../utils/audio';

export default function PersonalizationModal({ 
  userProfile, 
  onSaveProfile, 
  studySessions = [], 
  dayStatus = {}, 
  mockTests = [], 
  errorLog = [], 
  customFormulas = [], 
  onResetAll, 
  onClose 
}) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'records' | 'switch'
  
  // Profile Fields
  const [name, setName] = useState(userProfile.name || 'Shreya');
  const [avatar, setAvatar] = useState(userProfile.avatar || '🦉');
  const [targetRank, setTargetRank] = useState(userProfile.targetRank || 'AIR < 100');
  const [targetScore, setTargetScore] = useState(userProfile.targetScore || '80+ Marks');
  const [college, setCollege] = useState(userProfile.college || 'GGSIPU (5th Sem CSE)');
  const [dailyGoalHours, setDailyGoalHours] = useState(userProfile.dailyGoalHours || 3.5);
  const [weakSubjects, setWeakSubjects] = useState(userProfile.weakSubjects || 'Operating Systems, COA');
  const [geminiApiKey, setGeminiApiKey] = useState(userProfile.geminiApiKey || '');

  // Profiles list
  const [profilesList, setProfilesList] = useState(() => {
    try {
      const stored = localStorage.getItem('GATE_MATRIX_2027_profiles_list');
      return stored ? JSON.parse(stored) : [{ id: 'p-1', name: userProfile.name || 'Shreya', avatar: userProfile.avatar || '🦉' }];
    } catch (e) {
      return [{ id: 'p-1', name: 'Shreya', avatar: '🦉' }];
    }
  });

  const avatars = [
    { emoji: '🦉', label: 'The Architect' },
    { emoji: '⚡', label: 'The Sprinter' },
    { emoji: '🎯', label: 'The Precisionist' },
    { emoji: '🧠', label: 'The Math Wizard' },
    { emoji: '🚀', label: 'The Visionary' },
    { emoji: '💻', label: 'The Hacker' },
    { emoji: '☕', label: 'The Night Owl' },
    { emoji: '🌅', label: 'The Early Bird' },
    { emoji: '🥇', label: 'The Topper' },
    { emoji: '🔬', label: 'The Researcher' }
  ];

  const handleSave = (e) => {
    e.preventDefault();
    playClick();
    const updated = {
      ...userProfile,
      name,
      avatar,
      targetRank,
      targetScore,
      college,
      dailyGoalHours: parseFloat(dailyGoalHours) || 3.5,
      weakSubjects,
      geminiApiKey
    };
    onSaveProfile(updated);
    playSuccessChime();
    onClose();
  };

  const handleCreateNewProfile = () => {
    const newName = prompt("Enter Name for new Student Profile:");
    if (!newName) return;
    playClick();
    const newP = {
      id: 'p-' + Date.now(),
      name: newName,
      avatar: '🚀'
    };
    const updatedList = [...profilesList, newP];
    setProfilesList(updatedList);
    localStorage.setItem('GATE_MATRIX_2027_profiles_list', JSON.stringify(updatedList));
    setName(newName);
    setAvatar('🚀');
    alert(`Switched to new profile: ${newName}! Click "Save Profile" to apply.`);
  };

  const handleSwitchProfile = (p) => {
    playClick();
    setName(p.name);
    setAvatar(p.avatar || '🦉');
    alert(`Active profile set to ${p.name}. Save changes to update session.`);
  };

  const handleResetConfirm = () => {
    if (window.confirm("⚠️ Are you sure you want to reset all planner progress, study history, and error logs? This cannot be undone.")) {
      playClick();
      onResetAll();
      onClose();
    }
  };

  // Compute Record Analytics
  const completedDaysCount = Object.values(dayStatus).filter(s => s.status === 'Done').length;
  const inProgressDaysCount = Object.values(dayStatus).filter(s => s.status === 'In Progress').length;
  const totalStudyMinutes = studySessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);
  const avgAccuracy = mockTests.length > 0 
    ? (mockTests.reduce((acc, curr) => acc + (curr.accuracy || 0), 0) / mockTests.length).toFixed(0)
    : 0;
  const resolvedErrorsCount = errorLog.filter(e => e.resolved).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sketch" onClick={e => e.stopPropagation()} style={{ padding: '26px', maxWidth: '720px' }}>
        <div className="tape-strip"></div>
        <div className="tape-strip tape-strip-right"></div>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '2rem' }}>{avatar}</span>
            <div>
              <h2 className="font-title" style={{ fontSize: '1.45rem', margin: 0 }}>
                {name}'s Personal Study Command & Records
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>
                Target: <strong>{targetRank}</strong> ({targetScore}) • {college}
              </div>
            </div>
          </div>
          <button className="btn-sketch" onClick={onClose} style={{ padding: '4px 8px' }}>
            ✕
          </button>
        </div>

        {/* Navigation Tabs: Profile Settings vs Study Records vs Profile Switcher */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '18px' }}>
          <button 
            type="button"
            className={`btn-sketch ${activeTab === 'profile' ? 'btn-sketch-primary' : ''}`}
            onClick={() => setActiveTab('profile')}
            style={{ fontSize: '0.85rem' }}
          >
            👤 Personalization
          </button>
          <button 
            type="button"
            className={`btn-sketch ${activeTab === 'records' ? 'btn-sketch-primary' : ''}`}
            onClick={() => setActiveTab('records')}
            style={{ fontSize: '0.85rem' }}
          >
            📊 Maintained Records ({studySessions.length} logs)
          </button>
          <button 
            type="button"
            className={`btn-sketch ${activeTab === 'switch' ? 'btn-sketch-primary' : ''}`}
            onClick={() => setActiveTab('switch')}
            style={{ fontSize: '0.85rem' }}
          >
            👥 Switch Profile ({profilesList.length})
          </button>
        </div>

        {/* Tab 1: Personalization Form */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Avatar Picker */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Choose Your Study Persona / Avatar:
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {avatars.map(a => (
                  <button
                    key={a.emoji}
                    type="button"
                    onClick={() => { playClick(); setAvatar(a.emoji); }}
                    style={{
                      fontSize: '1.4rem',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: avatar === a.emoji ? 'var(--highlight-yellow)' : 'var(--paper-card)',
                      border: avatar === a.emoji ? '2px solid var(--ink-border)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      boxShadow: avatar === a.emoji ? '2px 2px 0px var(--ink-border)' : 'none'
                    }}
                    title={a.label}
                  >
                    {a.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Aspirant Name / Moniker:
                </label>
                <input 
                  type="text" 
                  className="input-sketch" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  College / University:
                </label>
                <input 
                  type="text" 
                  className="input-sketch" 
                  value={college} 
                  onChange={e => setCollege(e.target.value)} 
                  placeholder="e.g. USICT / MAIT / VIPS 5th Sem"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Target GATE Rank:
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
                  Target Score:
                </label>
                <input 
                  type="text" 
                  className="input-sketch" 
                  value={targetScore} 
                  onChange={e => setTargetScore(e.target.value)} 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Daily Hours Goal:
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
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                High-Priority / Weak Subjects (Highlighted in Planner):
              </label>
              <input 
                type="text" 
                className="input-sketch" 
                value={weakSubjects} 
                onChange={e => setWeakSubjects(e.target.value)} 
                placeholder="e.g. Operating Systems, Computer Organization, TOC"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  Gemini API Key (Optional for AI Dynamic Rescheduling):
                </label>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ fontSize: '0.8rem', color: 'var(--pen-blue)', textDecoration: 'underline' }}
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
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <button 
                type="button" 
                className="btn-sketch btn-sketch-pink" 
                onClick={handleResetConfirm}
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                Reset All Progress
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn-sketch" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-sketch btn-sketch-primary">
                  ✓ Save Personalization
                </button>
              </div>
            </div>

          </form>
        )}

        {/* Tab 2: Maintained Records & Analytics Dashboard */}
        {activeTab === 'records' && (
          <div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
              gap: '10px',
              marginBottom: '16px'
            }}>
              <div className="sketch-card" style={{ padding: '12px', background: 'var(--highlight-green)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>DAYS DONE</div>
                <div className="font-title" style={{ fontSize: '1.4rem' }}>{completedDaysCount}</div>
              </div>

              <div className="sketch-card" style={{ padding: '12px', background: 'var(--highlight-blue)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E40AF' }}>STUDY HOURS</div>
                <div className="font-title" style={{ fontSize: '1.4rem' }}>{totalStudyHours}h</div>
              </div>

              <div className="sketch-card" style={{ padding: '12px', background: 'var(--highlight-orange)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9A3412' }}>MOCK ACCURACY</div>
                <div className="font-title" style={{ fontSize: '1.4rem' }}>{avgAccuracy}%</div>
              </div>

              <div className="sketch-card" style={{ padding: '12px', background: 'var(--highlight-pink)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9F1239' }}>ERRORS FIXED</div>
                <div className="font-title" style={{ fontSize: '1.4rem' }}>{resolvedErrorsCount}</div>
              </div>

              <div className="sketch-card" style={{ padding: '12px', background: 'var(--highlight-yellow)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#854D0E' }}>FORMULAS</div>
                <div className="font-title" style={{ fontSize: '1.4rem' }}>{customFormulas.length}</div>
              </div>
            </div>

            <h3 className="font-title" style={{ fontSize: '1.15rem', marginBottom: '8px' }}>
              📜 Chronological Focus Sessions History:
            </h3>

            {studySessions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ink-muted)', fontSize: '0.85rem' }}>
                No completed Pomodoro sessions yet.<br/>
                Complete your first focus block on Today's Mission to log your session!
              </div>
            ) : (
              <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {studySessions.slice(0, 15).map((s, idx) => (
                  <div 
                    key={idx}
                    className="sketch-card"
                    style={{ 
                      padding: '8px 12px', 
                      background: 'var(--paper-card-subtle)',
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div>
                      <strong>{s.subject}</strong> — {s.topic}
                      <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>{s.date || 'Today'}</div>
                    </div>
                    <span className="badge-sketch badge-sketch-green">
                      ⏱️ {s.durationMinutes} min
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn-sketch" onClick={onClose}>
                Close Records
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Multiple Profile Switcher */}
        {activeTab === 'switch' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ink-secondary)' }}>
                Maintain separate personalized study records and goals for multiple students or preparation tracks:
              </p>
              <button 
                type="button" 
                className="btn-sketch btn-sketch-primary" 
                onClick={handleCreateNewProfile}
                style={{ fontSize: '0.8rem', padding: '6px 10px', flexShrink: 0 }}
              >
                <Plus size={14} /> New Profile
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {profilesList.map(p => {
                const isActive = p.name === name;

                return (
                  <div 
                    key={p.id}
                    className="sketch-card"
                    style={{ 
                      padding: '14px 18px',
                      background: isActive ? 'var(--highlight-yellow)' : 'var(--paper-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.6rem' }}>{p.avatar || '🦉'}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                          {p.name} {isActive && <span className="badge-sketch badge-sketch-green">Active</span>}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)' }}>
                          Personalized GATE 2027 Workspace
                        </div>
                      </div>
                    </div>

                    {!isActive ? (
                      <button 
                        className="btn-sketch"
                        onClick={() => handleSwitchProfile(p)}
                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      >
                        Select Profile
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 700 }}>
                        ✓ Current User
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
              <button className="btn-sketch" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
