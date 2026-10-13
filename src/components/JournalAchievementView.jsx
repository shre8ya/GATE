import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Award, 
  Flame, 
  Star, 
  BookOpen, 
  Clock, 
  Calendar, 
  Sparkles, 
  Save, 
  CheckCircle, 
  Volume2, 
  VolumeX, 
  ChevronRight,
  TrendingUp,
  Smile,
  Zap,
  Target,
  Download
} from 'lucide-react';
import { playClick, playSuccessChime, startAmbientSound, stopAmbientSound } from '../utils/audio';
import { fireTaskConfetti, fireFullDayConfetti } from '../utils/confetti';

export default function JournalAchievementView({
  currentDate,
  masterSchedule,
  dayStatus,
  userProfile
}) {
  // -------------------------------------------------------------
  // 1. Dynamic Live Clock & GATE 2027 Countdown
  // -------------------------------------------------------------
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const gateExamDate = new Date('2027-02-13T09:30:00');
  const diffMs = Math.max(0, gateExamDate - now);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const diffSeconds = Math.floor((diffMs / 1000) % 60);

  // -------------------------------------------------------------
  // 2. Dynamic Ambient Lo-Fi / Study Sound Controller
  // -------------------------------------------------------------
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const [ambientType, setAmbientType] = useState('white_noise'); // 'white_noise' (rain), 'drone', 'binaural_40hz'

  const toggleAmbient = (type) => {
    playClick();
    if (ambientPlaying && ambientType === type) {
      stopAmbientSound();
      setAmbientPlaying(false);
    } else {
      setAmbientType(type);
      startAmbientSound(type, 0.25);
      setAmbientPlaying(true);
    }
  };

  // -------------------------------------------------------------
  // 3. Daily Reflections Journal
  // -------------------------------------------------------------
  const [journalEntries, setJournalEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('gate_journal_entries_v1');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [selectedDate, setSelectedDate] = useState(currentDate);
  const currentEntry = journalEntries[selectedDate] || {
    rating: 4,
    mood: '⚡ Energetic',
    breakthrough: '',
    struggle: '',
    priority: '',
    diaryNotes: '',
    savedAt: null
  };

  const [rating, setRating] = useState(currentEntry.rating);
  const [mood, setMood] = useState(currentEntry.mood);
  const [breakthrough, setBreakthrough] = useState(currentEntry.breakthrough);
  const [struggle, setStruggle] = useState(currentEntry.struggle);
  const [priority, setPriority] = useState(currentEntry.priority);
  const [diaryNotes, setDiaryNotes] = useState(currentEntry.diaryNotes);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    const entry = journalEntries[selectedDate] || {
      rating: 4,
      mood: '⚡ Energetic',
      breakthrough: '',
      struggle: '',
      priority: '',
      diaryNotes: '',
      savedAt: null
    };
    setRating(entry.rating);
    setMood(entry.mood);
    setBreakthrough(entry.breakthrough);
    setStruggle(entry.struggle);
    setPriority(entry.priority);
    setDiaryNotes(entry.diaryNotes);
    setJustSaved(false);
  }, [selectedDate, journalEntries]);

  const handleSaveJournal = (e) => {
    e.preventDefault();
    playSuccessChime();
    fireTaskConfetti(e);

    const updated = {
      ...journalEntries,
      [selectedDate]: {
        rating,
        mood,
        breakthrough,
        struggle,
        priority,
        diaryNotes,
        savedAt: new Date().toISOString()
      }
    };

    setJournalEntries(updated);
    try {
      localStorage.setItem('gate_journal_entries_v1', JSON.stringify(updated));
    } catch (err) {}

    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);
  };

  // -------------------------------------------------------------
  // 4. Achievement Trophies Engine
  // -------------------------------------------------------------
  const completedDaysCount = masterSchedule.filter(m => dayStatus[m.date]?.status === 'Done').length;
  const journalCount = Object.keys(journalEntries).length;
  
  // Custom tasks count from localStorage
  let customEventsCount = 0;
  try {
    const ce = JSON.parse(localStorage.getItem('gate_custom_calendar_events_v1') || '{}');
    customEventsCount = Object.values(ce).reduce((acc, list) => acc + (list?.length || 0), 0);
  } catch (e) {}

  // Formulas count from localStorage
  let formulasCount = 0;
  try {
    const fv = JSON.parse(localStorage.getItem('gate_formula_vault_v1') || '[]');
    formulasCount = fv.length;
  } catch (e) {}

  const trophies = [
    {
      id: 't-day1',
      title: 'Day One Initiator',
      desc: 'Complete your first study mission on the roadmap.',
      icon: '🚀',
      unlocked: completedDaysCount >= 1,
      progress: `${Math.min(completedDaysCount, 1)} / 1`
    },
    {
      id: 't-streak3',
      title: '3-Day Momentum',
      desc: 'Complete 3 daily study missions.',
      icon: '🔥',
      unlocked: completedDaysCount >= 3,
      progress: `${Math.min(completedDaysCount, 3)} / 3`
    },
    {
      id: 't-streak7',
      title: '7-Day Study Warrior',
      desc: 'Conquer a full week of consistent study.',
      icon: '⚔️',
      unlocked: completedDaysCount >= 7,
      progress: `${Math.min(completedDaysCount, 7)} / 7`
    },
    {
      id: 't-streak14',
      title: '14-Day Iron Machine',
      desc: '2 full weeks of unbroken dedication to GATE CSE.',
      icon: '🛡️',
      unlocked: completedDaysCount >= 14,
      progress: `${Math.min(completedDaysCount, 14)} / 14`
    },
    {
      id: 't-journal3',
      title: 'Reflective Scholar',
      desc: 'Log 3 daily reflections in your personal study diary.',
      icon: '📝',
      unlocked: journalCount >= 3,
      progress: `${Math.min(journalCount, 3)} / 3`
    },
    {
      id: 't-formula5',
      title: 'Formula Alchemist',
      desc: 'Add 5+ formulas or photo notes in the Formula Vault.',
      icon: '📐',
      unlocked: formulasCount >= 5,
      progress: `${Math.min(formulasCount, 5)} / 5`
    },
    {
      id: 't-customTasks',
      title: 'Master Organizer',
      desc: 'Log custom college or practice tasks on your desk calendar.',
      icon: '🗓️',
      unlocked: customEventsCount >= 3,
      progress: `${Math.min(customEventsCount, 3)} / 3`
    },
    {
      id: 't-dsFinish',
      title: 'Algorithm Specialist',
      desc: 'Conquer all Data Structures & DAA daily study modules.',
      icon: '⚡',
      unlocked: completedDaysCount >= 22,
      progress: `${Math.min(completedDaysCount, 22)} / 22`
    }
  ];

  const unlockedCount = trophies.filter(t => t.unlocked).length;

  return (
    <div style={{ padding: '0 18px 40px', maxWidth: '1440px', margin: '0 auto' }}>

      {/* Header Banner */}
      <div className="sketch-card" style={{ padding: '24px', marginBottom: '22px' }}>
        <div className="tape-strip"></div>
        <div className="tape-strip tape-strip-right"></div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-sketch badge-sketch-yellow">STUDENT JOURNAL • TROPHIES</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Daily Reflection & Milestone Tracker</span>
            </div>
            <h1 className="font-title" style={{ fontSize: '1.9rem', margin: '6px 0 0' }}>
              🏆 Personal Achievement & Daily Journal
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              Track personal focus ratings, celebrate breakthroughs, capture lessons learned, and unlock milestone trophies.
            </p>
          </div>

          {/* Student Profile Quick Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', fontWeight: 700 }}>ACTIVE SCHOLAR</div>
              <div className="font-title" style={{ fontSize: '1.25rem' }}>{userProfile?.name || 'GATE Scholar'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-blue)' }}>Target: {userProfile?.targetRank || 'AIR < 100'}</div>
            </div>
            <div style={{ 
              width: '46px', 
              height: '46px', 
              borderRadius: '50%', 
              background: 'var(--highlight-yellow)', 
              border: '2px solid var(--ink-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem'
            }}>
              {userProfile?.avatar || '🎓'}
            </div>
          </div>
        </div>

        {/* Dynamic Study Pulse Bar: Countdown & Ambient Sound Generator */}
        <div style={{ 
          marginTop: '18px', 
          paddingTop: '16px', 
          borderTop: '2px dashed var(--ink-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          {/* Live GATE 2027 Countdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                background: '#DC2626', 
                boxShadow: '0 0 8px #DC2626',
                animation: 'pulse 1.5s infinite' 
              }}></span>
              <span style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--ink-secondary)' }}>
                GATE 2027 COUNTDOWN:
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <div className="sketch-card" style={{ padding: '3px 8px', fontSize: '0.9rem', fontWeight: 800 }}>
                {diffDays} <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>DAYS</span>
              </div>
              <div className="sketch-card" style={{ padding: '3px 8px', fontSize: '0.9rem', fontWeight: 800 }}>
                {String(diffHours).padStart(2, '0')} <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>HRS</span>
              </div>
              <div className="sketch-card" style={{ padding: '3px 8px', fontSize: '0.9rem', fontWeight: 800 }}>
                {String(diffMinutes).padStart(2, '0')} <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>MIN</span>
              </div>
              <div className="sketch-card" style={{ padding: '3px 8px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--ink-blue)' }}>
                {String(diffSeconds).padStart(2, '0')} <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>SEC</span>
              </div>
            </div>
          </div>

          {/* Web Audio Ambient Focus Generator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-secondary)' }}>
              🎧 Ambient Focus Sounds:
            </span>
            <button
              className={`btn-sketch ${ambientPlaying && ambientType === 'white_noise' ? 'btn-sketch-green' : ''}`}
              onClick={() => toggleAmbient('white_noise')}
              style={{ fontSize: '0.78rem', padding: '4px 10px' }}
              title="Self-contained calming study rain synthesizer"
            >
              🌧️ Study Rain
            </button>
            <button
              className={`btn-sketch ${ambientPlaying && ambientType === 'binaural_40hz' ? 'btn-sketch-green' : ''}`}
              onClick={() => toggleAmbient('binaural_40hz')}
              style={{ fontSize: '0.78rem', padding: '4px 10px' }}
              title="40Hz Gamma Focus Frequency synthesizer"
            >
              🧠 40Hz Gamma
            </button>
            <button
              className={`btn-sketch ${ambientPlaying && ambientType === 'drone' ? 'btn-sketch-green' : ''}`}
              onClick={() => toggleAmbient('drone')}
              style={{ fontSize: '0.78rem', padding: '4px 10px' }}
              title="Deep Space Lo-Fi Drone synthesizer"
            >
              🌌 Deep Drone
            </button>
            {ambientPlaying && (
              <button
                className="btn-sketch"
                onClick={() => {
                  stopAmbientSound();
                  setAmbientPlaying(false);
                }}
                style={{ fontSize: '0.78rem', padding: '4px 8px', color: '#DC2626' }}
              >
                <VolumeX size={13} /> Mute
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>

        {/* ========================================================================= */}
        {/* Left: Daily Reflection Journal Form */}
        {/* ========================================================================= */}
        <div className="sketch-card ruled-paper" style={{ padding: '24px' }}>
          <div className="tape-strip"></div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <span className="badge-sketch badge-sketch-orange" style={{ fontSize: '0.75rem' }}>
                DAILY DIARY ENTRY
              </span>
              <h2 className="font-title" style={{ fontSize: '1.4rem', margin: '4px 0 0' }}>
                📖 Today's Study Reflection
              </h2>
            </div>

            <input 
              type="date"
              value={selectedDate}
              onChange={e => {
                playClick();
                setSelectedDate(e.target.value);
              }}
              style={{
                padding: '6px 10px',
                border: '1.5px solid var(--ink-border)',
                borderRadius: '6px',
                fontFamily: 'inherit',
                fontSize: '0.85rem',
                background: 'var(--paper-card)'
              }}
            />
          </div>

          <form onSubmit={handleSaveJournal} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Focus Rating & Mood */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                  FOCUS RATING (1-5 STARS):
                </label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { playClick(); setRating(s); }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.4rem',
                        padding: '2px',
                        color: s <= rating ? '#EAB308' : '#CBD5E1'
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                  TODAY'S ENERGY / MOOD:
                </label>
                <select
                  value={mood}
                  onChange={e => setMood(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    border: '1.5px solid var(--ink-border)',
                    borderRadius: '6px',
                    fontFamily: 'inherit',
                    fontSize: '0.85rem',
                    background: 'var(--paper-card)'
                  }}
                >
                  <option value="⚡ Energetic">⚡ Energetic & Locked In</option>
                  <option value="🧘 Deep Flow">🧘 Deep Flow State</option>
                  <option value="☕ Grinding">☕ Grinding Through</option>
                  <option value="🤯 Brain Burnout">🤯 Challenged / Brain Melted</option>
                  <option value="🎯 Consistent">🎯 Steady & Consistent</option>
                </select>
              </div>
            </div>

            {/* Prompt 1: Breakthrough */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                💡 WHAT CONCEPT OR FORMULA FINALLY CLICKED TODAY?
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Master Theorem case 2, or how Dijkstra avoids negative weight cycles..."
                value={breakthrough}
                onChange={e => setBreakthrough(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1.5px solid var(--ink-border)',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  resize: 'vertical',
                  background: 'var(--paper-card)'
                }}
              />
            </div>

            {/* Prompt 2: Struggle & Solution */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                ⚠️ WHAT TRIPPED ME UP OR DISTRACTED ME?
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Spent 45 min on a trick PYQ on pointers; will check solution earlier next time..."
                value={struggle}
                onChange={e => setStruggle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1.5px solid var(--ink-border)',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  resize: 'vertical',
                  background: 'var(--paper-card)'
                }}
              />
            </div>

            {/* Prompt 3: Tomorrow's Top Priority */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                🎯 TOP #1 PRIORITY FOR TOMORROW:
              </label>
              <input
                type="text"
                placeholder="e.g. Complete Dynamic Programming notes before 2 PM..."
                value={priority}
                onChange={e => setPriority(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1.5px solid var(--ink-border)',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  background: 'var(--paper-card)'
                }}
              />
            </div>

            {/* Prompt 4: Freeform Study Notes */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                📝 PERSONAL NOTES & THOUGHTS:
              </label>
              <textarea
                rows={3}
                placeholder="Write whatever you want to remember about this study session..."
                value={diaryNotes}
                onChange={e => setDiaryNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1.5px solid var(--ink-border)',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  resize: 'vertical',
                  background: 'var(--paper-card)'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <button
                type="submit"
                className="btn-sketch btn-sketch-primary"
                style={{ padding: '8px 18px', fontSize: '0.95rem' }}
              >
                <Save size={16} /> Save Daily Journal
              </button>

              {justSaved && (
                <span style={{ color: 'var(--ink-green)', fontWeight: 700, fontSize: '0.88rem' }}>
                  ✓ Reflection Saved!
                </span>
              )}
            </div>

          </form>
        </div>

        {/* ========================================================================= */}
        {/* Right: Milestone Trophies Room */}
        {/* ========================================================================= */}
        <div className="sketch-card ruled-paper" style={{ padding: '24px' }}>
          <div className="tape-strip tape-strip-right"></div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <span className="badge-sketch badge-sketch-yellow" style={{ fontSize: '0.75rem' }}>
                MILESTONE BADGES
              </span>
              <h2 className="font-title" style={{ fontSize: '1.4rem', margin: '4px 0 0' }}>
                🏆 Scholar's Trophy Room
              </h2>
            </div>

            <span className="badge-sketch" style={{ background: '#FEF08A', fontWeight: 800, fontSize: '0.85rem' }}>
              {unlockedCount} / {trophies.length} UNLOCKED
            </span>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--ink-secondary)', marginBottom: '16px' }}>
            Badges unlock automatically as you complete daily missions, log reflections, and add formula notes.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
            {trophies.map((trophy) => (
              <div
                key={trophy.id}
                className="sketch-card"
                style={{
                  padding: '12px 14px',
                  background: trophy.unlocked ? 'var(--highlight-yellow)' : 'var(--paper-card-subtle)',
                  border: trophy.unlocked ? '2px solid #CA8A04' : '1.5px dashed var(--ink-border)',
                  opacity: trophy.unlocked ? 1 : 0.65,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ 
                  fontSize: '2rem', 
                  filter: trophy.unlocked ? 'none' : 'grayscale(100%)',
                  flexShrink: 0
                }}>
                  {trophy.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--ink-primary)' }}>
                      {trophy.title}
                    </div>
                    {trophy.unlocked ? (
                      <span style={{ fontSize: '0.72rem', color: '#854D0E', fontWeight: 800 }}>✓ UNLOCKED</span>
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: 'var(--ink-muted)' }}>{trophy.progress}</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)', marginTop: '2px', lineHeight: 1.3 }}>
                    {trophy.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Past Reflections Summary */}
          {journalCount > 0 && (
            <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '2px dashed var(--ink-border)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px' }}>
                📜 Recent Journal Entries ({journalCount}):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {Object.keys(journalEntries).slice(-8).reverse().map(dateKey => (
                  <button
                    key={dateKey}
                    className="btn-sketch"
                    onClick={() => { playClick(); setSelectedDate(dateKey); }}
                    style={{ fontSize: '0.78rem', padding: '3px 8px' }}
                  >
                    <span>{dateKey}</span>
                    <span>★{journalEntries[dateKey]?.rating || 4}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
