import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  BookOpen, 
  Zap, 
  Sparkles, 
  Clock, 
  Target, 
  Shield, 
  Upload, 
  Calendar, 
  Flame, 
  User, 
  Search, 
  ArrowRight,
  BarChart2,
  Bell,
  Download,
  GraduationCap,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { playClick } from '../utils/audio';

export default function HowToUseModal({
  isOpen,
  onClose,
  onOpenReschedule,
  onOpenCustomizer,
  onOpenProfile,
  onOpenImport,
  onOpenReminders,
  onOpenBackup,
  userProfile = {}
}) {
  if (!isOpen) return null;

  const [activeCategory, setActiveCategory] = useState('daily_flow');
  const [searchQuery, setSearchQuery] = useState('');

  const userName = userProfile.name || 'Aspirant';

  const categories = [
    { id: 'daily_flow', label: '1. Daily Routine', icon: Clock, desc: 'The 4-Phase Study Protocol' },
    { id: 'ai_reschedule', label: '2. AI Task Shifting', icon: Sparkles, desc: 'Exact Route & Catch-Up' },
    { id: 'resources', label: '3. Custom Resources', icon: Zap, desc: 'AI Playlists & Swapping' },
    { id: 'profiles', label: '4. User Profiles', icon: User, desc: 'Isolated Aspirant Sandboxes' },
    { id: 'diagnostics', label: '5. Error Log & Mocks', icon: Shield, desc: 'Weakness Eraser & Vault' },
    { id: 'tips_shortcuts', label: '6. Tips & Shortcuts', icon: Target, desc: 'Keyboard & Productivity' }
  ];

  const guideTopics = {
    daily_flow: [
      {
        title: 'The 4-Phase Daily Mastery Routine',
        badge: 'Recommended Protocol',
        content: `Every single day on your 80-day journey is scheduled into 4 progressive focus phases to prevent fatigue and guarantee IIT Madras level rigor:
• Phase 1 (15m): General Aptitude Quick Fire Warmup (Verbal, Quantitative, Spatial, or Logic).
• Phase 2 (30m): Engineering Mathematics Daily Block (Linear Algebra, Calculus, Probability).
• Phase 3 (55m): Core CSE Lecture Block (C Prog, DS, DAA, Compiler, OS, or CN).
• Phase 4 (20m): Timed PYQ Practice Target & Concise Formula Log.`
      },
      {
        title: 'Built-in Distraction-Free Video Player',
        badge: 'Zero Social Algorithms',
        content: `Click "Open Lecture" on any day to watch the planned topic directly inside the app.
• No YouTube comments, recommendations, or rabbit holes.
• Real-Time Notes & Traps scratchpad alongside the player that saves directly to your day's diary.
• 1-Click "Capture Formula" extracts key equations straight into your Formula Vault.`
      },
      {
        title: 'Integrated Pomodoro Focus Timer',
        badge: 'Tactile Countdown',
        content: `Keep yourself in deep work with the header Pomodoro timer:
• 25m Focus Block → 5m Rest Interval.
• Spacebar starts or pauses the timer at any time.
• Every completed session is logged chronologically to your active student profile.`
      }
    ],
    ai_reschedule: [
      {
        title: 'What Happens When You Miss a Day or Fall Behind?',
        badge: 'Zero Guilt Recovery',
        content: `Life happens—college submissions, exams, or fatigue. Never abandon your planner:
1. Open the AI Catch-Up Rescheduler from the top right ⚡ Tools menu (or from Today\'s Mission).
2. Choose the missed date and select one of the 3 recovery strategies:
   • Sunday Buffer (Recommended): Shifts the topic into the upcoming Sunday revision slot. Weekdays remain untouched.
   • 72-Hour Micro-Sprint: Splits the missed minutes (+25m/day) across the next 3 days.
   • Smart Shift: Slid 1 slot forward without losing semester alignment.`
      },
      {
        title: 'Exact Task Shift Destination Transparency',
        badge: '100% Traceable',
        content: `The system never quietly loses your tasks. You will always see the exact route:
• Origin Slot: Displays the exact date, day, topic, and planned duration that was missed.
• Destination Slot: Shows the exact target date, day, and session type where your task moved.
• Visual Badges: The origin day displays [↪ Task Shifted], and the receiving day displays [⚡ Absorbed Catch-Up].`
      }
    ],
    resources: [
      {
        title: 'Personalized AI Resource Recommendations',
        badge: 'Tailored for You',
        content: `Every student learns differently. In ⚡ Tools → Swap Video Playlists:
• The "Personalized AI (${userName})" tab scans your target rank (${userProfile.targetRank || 'AIR < 100'}) and weak subjects (${userProfile.weakSubjects || 'None'}).
• Recommends the highest-yielding educator playlists (e.g., Abdul Bari for Algorithms, Neso Academy for OS/CN, Amit Khurana for Compiler, Made Easy for Maths).
• 1-Click "Apply All AI Recommendations" batch synchronizes every day in your planner.`
      },
      {
        title: 'Custom YouTube Playlist & Lecture URLs',
        badge: 'Full Freedom',
        content: `Prefer your own coaching or favorite educator?
• Click "Use Custom URL" under any subject in the Resource Matrix.
• Paste any YouTube playlist URL or search query.
• The planner automatically updates all day links and video buttons for that subject.`
      }
    ],
    profiles: [
      {
        title: '100% Strict Multi-User Data Isolation',
        badge: 'Zero State Leakage',
        content: `Multiple aspirants can study on the same computer with total privacy:
• Click the profile avatar pill in the top right navbar.
• Switch between aspirants instantly with 1 click.
• Every profile has an independent database sandbox: Checked days, custom playlists, error logs, formulas, pomodoro records, and custom calendar notes are strictly isolated.`
      },
      {
        title: 'Clean Profile Lifecycle & Avatars',
        badge: 'Safe Deletion',
        content: `• Create new profiles with custom monochrome outline avatars (⌘, ⚡, ◎, ⬡, ⌨, ☕, ★, ⌬, ⚑, ◈).
• Deleting a student profile cleanly purges all of their stored keys without touching any other profile.`
      }
    ],
    diagnostics: [
      {
        title: 'Weapon Vault: Error Log with Spaced Recall',
        badge: 'Stop Repeating Mistakes',
        content: `Every mark lost in GATE is an unexamined error. Whenever you miss a test question:
1. Navigate to Weapon Vault → Error Log.
2. Log the topic, correct concept, trap explanation, and category:
   • Conceptual Gap (Lack of theoretical depth)
   • Silly Mistake (Misread question or sign error)
   • Formula Trap (Forgot edge case or theorem condition)
   • Time Pressure (Rushed calculation)
3. Spaced Repetition (1d → 3d → 7d → 14d → 30d): The app surfaces due traps for review before they cost you rank marks.`
      },
      {
        title: 'Formula Vault & Flashcards',
        badge: 'LaTeX Ready',
        content: `Access all high-weightage GATE CSE equations under Weapon Vault → Formula Vault:
• Preloaded with all core formulas across all 8 subjects.
• Add custom formulas anytime with LaTeX syntax preview.
• Interactive Formula Flashcards test your recall in 1-minute drills.`
      },
      {
        title: 'Sunday Revision & Official Question Papers Hub',
        badge: 'Exam Simulation',
        content: `Every Sunday is reserved for consolidation:
• 30m Short Notes → 90m Timed Mock Test → 60m Error Redo.
• Access official IIT Madras GATE question papers and IPU End-Term papers with integrated timers.
• Log test scorecards to monitor accuracy trends over time.`
      }
    ],
    tips_shortcuts: [
      {
        title: 'Productivity Keyboard Shortcuts',
        badge: 'Speed Navigation',
        content: `• Spacebar: Start or pause the Pomodoro focus timer.
• Esc: Close any modal dialog or popup.
• Clean Stationery Feel: Switch paper textures (Parchment, Technical Grid, Minimal White, Warm Manila) in ⚡ Tools → Theme.`
      },
      {
        title: 'Import Timetable, Notes & Backups',
        badge: 'No Cloud Lock-in',
        content: `• ⚡ Tools → Import File: Upload any study plan or notes in Excel (.xlsx), PDF, or plain text (.txt). The parser extracts schedule items and appends notes to your dashboard.
• ⚡ Tools → Backup & Restore: Download a timestamped .json snapshot of your entire study progress anytime.`
      }
    ]
  };

  const handleLaunch = (actionName) => {
    playClick();
    onClose();
    if (actionName === 'reschedule' && onOpenReschedule) onOpenReschedule();
    if (actionName === 'customizer' && onOpenCustomizer) onOpenCustomizer();
    if (actionName === 'profile' && onOpenProfile) onOpenProfile();
    if (actionName === 'import' && onOpenImport) onOpenImport();
    if (actionName === 'reminders' && onOpenReminders) onOpenReminders();
    if (actionName === 'backup' && onOpenBackup) onOpenBackup();
  };

  const currentSection = guideTopics[activeCategory] || [];

  // Filter based on search query if present
  const filteredSections = searchQuery.trim()
    ? Object.entries(guideTopics).flatMap(([catKey, items]) => 
        items.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.badge.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(item => ({ ...item, categoryKey: catKey }))
      )
    : currentSection;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div 
        className="modal-sketch" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: '860px', 
          width: '94%', 
          maxHeight: '90vh', 
          display: 'flex', 
          flexDirection: 'column',
          padding: '24px 28px',
          overflow: 'hidden'
        }}
      >
        <div className="tape-strip"></div>
        <div className="tape-strip tape-strip-right"></div>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px', borderBottom: '1.5px dashed var(--ink-border)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: 'var(--paper-card-subtle)',
              border: '2px solid var(--ink-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <HelpCircle size={24} color="#000" strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge-sketch badge-sketch-yellow" style={{ fontSize: '0.72rem' }}>
                  OFFICIAL USER PLAYBOOK
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)' }}>
                  Aspirant Guide for {userName}
                </span>
              </div>
              <h2 className="font-title" style={{ fontSize: '1.55rem', margin: '4px 0 0' }}>
                How to Use GATE Matrix Properly
              </h2>
            </div>
          </div>

          <button 
            type="button" 
            className="btn-sketch" 
            onClick={onClose}
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            <X size={15} color="#000" strokeWidth={2} />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={15} color="#000" style={{ position: 'absolute', left: '12px', top: '11px', opacity: 0.6 }} />
          <input 
            type="text"
            className="input-sketch"
            placeholder="Search guide (e.g., reschedule, pomodoro, weak subjects, playlists, shortcuts)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', fontSize: '0.88rem' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills Navigation (Hidden if searching) */}
        {!searchQuery.trim() && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px' }}>
            {categories.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { playClick(); setActiveCategory(cat.id); }}
                  className={`btn-sketch ${isActive ? 'btn-sketch-primary' : ''}`}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 800 : 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexShrink: 0,
                    boxShadow: isActive ? '2px 2px 0px var(--ink-border)' : 'none'
                  }}
                >
                  <Icon size={14} color="#000" strokeWidth={2} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Guide Content Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {searchQuery.trim() && (
            <div style={{ fontSize: '0.82rem', color: 'var(--ink-secondary)', marginBottom: '4px' }}>
              Showing results for "<strong>{searchQuery}</strong>" ({filteredSections.length} found):
            </div>
          )}

          {filteredSections.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--ink-muted)' }}>
              <Search size={28} color="#000" strokeWidth={1.5} style={{ opacity: 0.4, marginBottom: '8px' }} />
              <div>No guide topics matched your search. Try searching for "reschedule", "error", or "timer".</div>
            </div>
          ) : (
            filteredSections.map((item, idx) => (
              <div 
                key={idx} 
                className="sketch-card" 
                style={{ 
                  padding: '16px 18px', 
                  background: 'var(--paper-card)',
                  border: '1.5px solid var(--ink-border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <h3 className="font-title" style={{ fontSize: '1.15rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>◎</span> {item.title}
                  </h3>
                  <span className="badge-sketch badge-sketch-yellow" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                    {item.badge}
                  </span>
                </div>
                
                <div style={{ 
                  fontSize: '0.88rem', 
                  color: 'var(--ink-primary)', 
                  lineHeight: 1.6, 
                  whiteSpace: 'pre-line' 
                }}>
                  {item.content}
                </div>
              </div>
            ))
          )}

          {/* Quick Launch Shortcuts Bar */}
          <div className="sketch-card" style={{ 
            marginTop: '8px', 
            padding: '16px', 
            background: 'var(--paper-card-subtle)', 
            border: '2px solid var(--ink-border)' 
          }}>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} color="#000" strokeWidth={2} />
              <span>Direct Feature Shortcuts — Try Them Right Now:</span>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                className="btn-sketch" 
                onClick={() => handleLaunch('reschedule')}
                style={{ fontSize: '0.78rem', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Sparkles size={13} color="#000" strokeWidth={2} /> Open AI Rescheduler
              </button>

              <button 
                className="btn-sketch" 
                onClick={() => handleLaunch('customizer')}
                style={{ fontSize: '0.78rem', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Zap size={13} color="#000" strokeWidth={2} /> Swap Playlists
              </button>

              <button 
                className="btn-sketch" 
                onClick={() => handleLaunch('profile')}
                style={{ fontSize: '0.78rem', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <User size={13} color="#000" strokeWidth={2} /> Switch / Create Profile
              </button>

              <button 
                className="btn-sketch" 
                onClick={() => handleLaunch('import')}
                style={{ fontSize: '0.78rem', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Upload size={13} color="#000" strokeWidth={2} /> Import Notes / Timetable
              </button>

              <button 
                className="btn-sketch" 
                onClick={() => handleLaunch('reminders')}
                style={{ fontSize: '0.78rem', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Bell size={13} color="#000" strokeWidth={2} /> Study Reminders
              </button>

              <button 
                className="btn-sketch" 
                onClick={() => handleLaunch('backup')}
                style={{ fontSize: '0.78rem', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Download size={13} color="#000" strokeWidth={2} /> Export Backup
              </button>
            </div>
          </div>

        </div>

        {/* Footer info & close */}
        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--ink-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>
            Tip: Press <kbd style={{ padding: '2px 5px', border: '1px solid var(--ink-border)', borderRadius: '3px', background: '#fff' }}>Esc</kbd> anytime to dismiss this guide.
          </div>
          <button 
            type="button" 
            className="btn-sketch btn-sketch-primary"
            onClick={onClose}
            style={{ padding: '6px 18px', fontSize: '0.85rem' }}
          >
            Got It! Close Guide
          </button>
        </div>

      </div>
    </div>
  );
}
