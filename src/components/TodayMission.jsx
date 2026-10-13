import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  Headphones, 
  CheckCheck,
  Sparkles,
  FileEdit,
  AlertTriangle,
  Calendar,
  Coffee,
  Plus,
  Minus,
  X
} from 'lucide-react';
import { playBell, playSuccessChime, playClick, startAmbientSound, stopAmbientSound } from '../utils/audio';
import { getDailyQuote, DAILY_MOTIVATIONAL_QUOTES } from '../data/quotes';
import { fireTaskConfetti, fireFullDayConfetti } from '../utils/confetti';
import { getTodayGoogleCalendarUrl } from '../utils/googleCalendar';

export default function TodayMission({ 
  currentDate, 
  setCurrentDate, 
  masterSchedule, 
  mathsSchedule, 
  aptitudeSchedule, 
  dayStatus, 
  onUpdateDayStatus, 
  onLogStudySession, 
  onOpenReschedule 
}) {
  const currentMasterItem = masterSchedule.find(m => m.date === currentDate) || masterSchedule[0];
  const currentMathsItem = mathsSchedule.find(m => m.date === currentDate) || null;
  const currentAptItem = aptitudeSchedule.find(m => m.date === currentDate) || null;

  const currentStatus = dayStatus[currentDate] || {
    status: 'Not Started',
    phase1: false,
    phase2: false,
    phase3: false,
    phase4: false,
    note: ''
  };

  // Motivational Quote State
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(() => getDailyQuote(currentDate));

  useEffect(() => {
    setCurrentQuote(getDailyQuote(currentDate));
  }, [currentDate]);

  const handleShuffleQuote = () => {
    playClick();
    const nextIdx = (quoteIdx + 1) % DAILY_MOTIVATIONAL_QUOTES.length;
    setQuoteIdx(nextIdx);
    setCurrentQuote(DAILY_MOTIVATIONAL_QUOTES[nextIdx]);
  };

  // Pomodoro State — Fully Customizable by User
  const [sessionType, setSessionType] = useState('focus'); // 'focus' | 'short_break' | 'long_break'
  const [customFocusMins, setCustomFocusMins] = useState(() => {
    try {
      const saved = localStorage.getItem('gate_pomodoro_custom_mins_v1');
      return saved ? parseInt(saved, 10) || 25 : 25;
    } catch {
      return 25;
    }
  });
  const [customInputVal, setCustomInputVal] = useState(() => {
    try {
      const saved = localStorage.getItem('gate_pomodoro_custom_mins_v1');
      return saved || '25';
    } catch {
      return '25';
    }
  });
  const [timerMode, setTimerMode] = useState(() => {
    try {
      const saved = localStorage.getItem('gate_pomodoro_custom_mins_v1');
      return saved ? parseInt(saved, 10) || 25 : 25;
    } catch {
      return 25;
    }
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    try {
      const saved = localStorage.getItem('gate_pomodoro_custom_mins_v1');
      const mins = saved ? parseInt(saved, 10) || 25 : 25;
      return mins * 60;
    } catch {
      return 25 * 60;
    }
  });
  const [isRunning, setIsRunning] = useState(false);
  const [ambientType, setAmbientType] = useState('none');
  const [ambientVolume, setAmbientVolume] = useState(0.3);
  const [sessionCompletedBanner, setSessionCompletedBanner] = useState(null);

  const [noteText, setNoteText] = useState(currentStatus.note || '');

  useEffect(() => {
    setNoteText(currentStatus.note || '');
  }, [currentDate]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playBell();
      fireTaskConfetti();
      if (sessionType === 'focus') {
        onLogStudySession({
          durationMinutes: timerMode,
          subject: currentMasterItem?.subject || 'GATE Study',
          topic: currentMasterItem?.mainFocus || 'Focus Block',
          date: currentDate
        });
        setSessionCompletedBanner({
          title: `🎉 Focus Block Finished (${timerMode}m)!`,
          message: `Logged to your study record. Take a well-deserved breather!`,
          type: 'focus'
        });
      } else {
        setSessionCompletedBanner({
          title: `☕ Break Time Over (${timerMode}m)!`,
          message: `Refreshed and ready for your next study streak?`,
          type: 'break'
        });
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, sessionType, timerMode, currentMasterItem, currentDate]);

  const toggleAmbient = (type) => {
    if (ambientType === type) {
      stopAmbientSound();
      setAmbientType('none');
    } else {
      setAmbientType(type);
      startAmbientSound(type, ambientVolume);
    }
  };

  const handleStartTimer = () => { 
    playClick(); 
    setSessionCompletedBanner(null);
    setIsRunning(true); 
  };
  const handlePauseTimer = () => { playClick(); setIsRunning(false); };
  
  const handleResetTimer = (minutes = timerMode) => {
    playClick();
    setIsRunning(false);
    setTimerMode(minutes);
    setTimeLeft(minutes * 60);
  };

  const handleApplyCustomMinutes = (minsToSet) => {
    playClick();
    const parsed = parseInt(minsToSet, 10);
    const validMins = isNaN(parsed) ? 25 : Math.max(1, Math.min(240, parsed));
    setCustomFocusMins(validMins);
    setCustomInputVal(String(validMins));
    try {
      localStorage.setItem('gate_pomodoro_custom_mins_v1', String(validMins));
    } catch (e) {}
    setSessionType('focus');
    handleResetTimer(validMins);
  };

  const handleAdjustTime = (deltaMins) => {
    playClick();
    const newSeconds = Math.max(60, timeLeft + deltaMins * 60);
    setTimeLeft(newSeconds);
    const updatedMins = Math.ceil(newSeconds / 60);
    setTimerMode(updatedMins);
  };

  const handleSelectSessionType = (type) => {
    playClick();
    setSessionType(type);
    setIsRunning(false);
    setSessionCompletedBanner(null);
    if (type === 'focus') {
      setTimerMode(customFocusMins);
      setTimeLeft(customFocusMins * 60);
    } else if (type === 'short_break') {
      setTimerMode(5);
      setTimeLeft(5 * 60);
    } else if (type === 'long_break') {
      setTimerMode(15);
      setTimeLeft(15 * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Milestone countdowns
  const todayObj = new Date(currentDate);
  const practicalDate = new Date('2026-11-26');
  const uniTheoryDate = new Date('2026-12-11');
  const crashDeadline = new Date('2026-12-31');
  const gateExamDate = new Date('2027-02-06');
  const diffDays = (target) => Math.ceil((target - todayObj) / (1000 * 60 * 60 * 24));

  const handleTogglePhase = (e, phaseKey) => {
    const nextVal = !currentStatus[phaseKey];
    const updated = {
      ...currentStatus,
      [phaseKey]: nextVal
    };
    
    if (updated.phase1 && updated.phase2 && updated.phase3 && updated.phase4) {
      updated.status = 'Done';
      fireFullDayConfetti();
    } else if (updated.phase1 || updated.phase2 || updated.phase3 || updated.phase4) {
      updated.status = 'In Progress';
      if (nextVal) {
        fireTaskConfetti(e);
      } else {
        playClick();
      }
    } else {
      updated.status = 'Not Started';
      playClick();
    }

    onUpdateDayStatus(currentDate, updated);
  };

  const handleMarkDayDone = (e) => {
    const isAlreadyDone = currentStatus.status === 'Done';
    const updated = {
      ...currentStatus,
      status: isAlreadyDone ? 'In Progress' : 'Done',
      phase1: !isAlreadyDone,
      phase2: !isAlreadyDone,
      phase3: !isAlreadyDone,
      phase4: !isAlreadyDone
    };

    if (!isAlreadyDone) {
      fireFullDayConfetti();
    } else {
      playClick();
    }

    onUpdateDayStatus(currentDate, updated);
  };

  const handleSaveNote = () => {
    playClick();
    onUpdateDayStatus(currentDate, { ...currentStatus, note: noteText });
  };

  // Date Navigation
  const currentIndex = masterSchedule.findIndex(m => m.date === currentDate);
  const handlePrevDay = () => {
    if (currentIndex > 0) {
      playClick();
      setCurrentDate(masterSchedule[currentIndex - 1].date);
    }
  };
  const handleNextDay = () => {
    if (currentIndex < masterSchedule.length - 1) {
      playClick();
      setCurrentDate(masterSchedule[currentIndex + 1].date);
    }
  };
  const handleJumpToToday = () => {
    playClick();
    setCurrentDate('2026-10-13');
  };

  return (
    <div style={{ padding: '0 18px 40px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Top Banner: Date Navigator & Strategy Header */}
      <div className="sketch-card" style={{ padding: '22px 24px', marginBottom: '22px' }}>
        <div className="tape-strip"></div>
        <div className="tape-strip tape-strip-right"></div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-sketch badge-sketch-yellow">
                DAY {currentIndex + 1} OF {masterSchedule.length}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--ink-secondary)' }}>
                {currentMasterItem?.type || 'GATE Learning'}
              </span>
              {currentStatus.status === 'Done' ? (
                <span className="badge-sketch badge-sketch-green">✓ DONE</span>
              ) : currentStatus.status === 'In Progress' ? (
                <span className="badge-sketch badge-sketch-orange">● IN PROGRESS</span>
              ) : (
                <span className="badge-sketch badge-sketch-pink">○ NOT STARTED</span>
              )}
            </div>

            <h1 className="font-title" style={{ fontSize: '1.9rem', margin: 0 }}>
              {currentMasterItem?.day}, {currentDate} — <span className="highlight-pen">{currentMasterItem?.subject}</span>
            </h1>
            <p style={{ fontSize: '1rem', marginTop: '4px', color: 'var(--ink-secondary)' }}>
              🎯 Today's Focus: <strong style={{ color: 'var(--ink-primary)' }}>{currentMasterItem?.mainFocus}</strong>
            </p>
          </div>

          {/* Date Navigator Buttons & Catch-up Helper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              className="btn-sketch" 
              onClick={handlePrevDay} 
              disabled={currentIndex <= 0}
              style={{ opacity: currentIndex <= 0 ? 0.4 : 1 }}
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <button 
              className="btn-sketch btn-sketch-primary" 
              onClick={handleJumpToToday}
            >
              Today (Oct 13)
            </button>
            <button 
              className="btn-sketch" 
              onClick={handleNextDay} 
              disabled={currentIndex >= masterSchedule.length - 1}
              style={{ opacity: currentIndex >= masterSchedule.length - 1 ? 0.4 : 1 }}
            >
              Next <ChevronRight size={16} />
            </button>
            <button 
              className="btn-sketch btn-sketch-pink"
              onClick={onOpenReschedule}
              title="Missed today's topic? Re-schedule with AI"
              style={{ marginLeft: '4px' }}
            >
              <Sparkles size={14} /> Missed? Reschedule
            </button>
          </div>
        </div>

        {/* Milestone Countdowns Strip */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '12px', 
          marginTop: '18px', 
          paddingTop: '16px', 
          borderTop: '2px dashed var(--ink-border)' 
        }}>
          <div className="sketch-card" style={{ padding: '10px 14px', background: 'var(--paper-card-subtle)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>PRACTICAL EXAMS (5th Sem)</div>
            <div className="font-title" style={{ fontSize: '1.25rem', color: '#0284C7' }}>
              {diffDays(practicalDate)} Days Left
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)' }}>Starts 26 Nov 2026 (2.5h/day)</div>
          </div>

          <div className="sketch-card" style={{ padding: '10px 14px', background: 'var(--paper-card-subtle)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>IPU THEORY EXAMS</div>
            <div className="font-title" style={{ fontSize: '1.25rem', color: '#D97706' }}>
              {diffDays(uniTheoryDate)} Days Left
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)' }}>11 Dec - 31 Dec (Evening 2-5 PM)</div>
          </div>

          <div className="sketch-card" style={{ padding: '10px 14px', background: 'var(--paper-card-subtle)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>CRASH SYLLABUS DEADLINE</div>
            <div className="font-title" style={{ fontSize: '1.25rem', color: '#16A34A' }}>
              {diffDays(crashDeadline)} Days Left
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)' }}>6 Core Sections + Daily Maths</div>
          </div>

          <div className="sketch-card" style={{ padding: '10px 14px', background: 'var(--paper-card-subtle)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>GATE 2027 EXAM DAY</div>
            <div className="font-title" style={{ fontSize: '1.25rem', color: '#9333EA' }}>
              {diffDays(gateExamDate)} Days Left
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)' }}>IIT Madras (Feb 2027)</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Mission Breakdown + Focus Pomodoro Suite */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: '22px' }}>
        
        {/* Left Column: 4-Phase Hand-Drawn Daily Mission Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Daily Motivational Quote Note */}
          <div className="sketch-card" style={{ 
            padding: '16px 20px', 
            background: 'var(--highlight-yellow)', 
            position: 'relative',
            border: '2px solid var(--ink-border)'
          }}>
            <div className="tape-strip"></div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>📌</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge-sketch" style={{ background: '#FEF9C3', fontSize: '0.75rem', fontWeight: 700 }}>
                      DAILY INSPIRATION • {currentQuote?.theme || 'Consistency'}
                    </span>
                  </div>
                  <blockquote style={{ 
                    margin: '8px 0 4px', 
                    fontSize: '1.05rem', 
                    fontStyle: 'italic', 
                    fontWeight: 600, 
                    color: '#1E293B',
                    lineHeight: 1.45
                  }}>
                    "{currentQuote?.quote}"
                  </blockquote>
                  <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                    — <span style={{ color: '#0F172A', fontWeight: 700 }}>{currentQuote?.author}</span> ({currentQuote?.role})
                  </div>
                </div>
              </div>

              <button 
                className="btn-sketch"
                onClick={handleShuffleQuote}
                title="Shuffle Daily Motivation"
                style={{ padding: '4px 8px', fontSize: '0.78rem', flexShrink: 0 }}
              >
                🔄 Shuffle
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <h2 className="font-title" style={{ fontSize: '1.35rem', margin: 0 }}>
              ✏️ Today's 4-Phase Study Mission
            </h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <a
                href={getTodayGoogleCalendarUrl(currentMasterItem, currentMathsItem, currentAptItem)}
                target="_blank"
                rel="noreferrer"
                className="btn-sketch"
                style={{ fontSize: '0.82rem', padding: '6px 12px', background: 'var(--paper-card)' }}
                title="Sync today's study schedule with Google Calendar"
              >
                <Calendar size={15} /> Add to Google Calendar
              </a>
              <button 
                className={`btn-sketch ${currentStatus.status === 'Done' ? 'btn-sketch-green' : 'btn-sketch-primary'}`}
                onClick={(e) => handleMarkDayDone(e)}
              >
                <CheckCheck size={18} />
                {currentStatus.status === 'Done' ? 'Day Completed!' : 'Mark Day Completed'}
              </button>
            </div>
          </div>

          {/* Phase 1: General Aptitude Warm-up */}
          <div className="sketch-card" style={{ 
            padding: '18px 20px', 
            background: currentStatus.phase1 ? 'var(--highlight-green)' : 'var(--paper-card)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div 
                  className={`sketch-check ${currentStatus.phase1 ? 'checked' : ''}`}
                  onClick={(e) => handleTogglePhase(e, 'phase1')}
                >
                  {currentStatus.phase1 && <span>✓</span>}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge-sketch badge-sketch-orange">Phase 1 • Easy Start ({currentMasterItem?.easyStartMin || 15} min)</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>General Aptitude</span>
                  </div>
                  <h3 className="font-title" style={{ fontSize: '1.15rem', marginTop: '6px' }}>
                    {currentAptItem ? currentAptItem.topic : 'Percentages & ratios'}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink-secondary)', marginTop: '4px' }}>
                    {currentAptItem?.whatToDo || 'Learn concept, note 2-3 shortcut tricks, solve 8-10 quick questions.'}
                  </p>
                  {currentAptItem?.source && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-blue)', marginTop: '4px', fontStyle: 'italic' }}>
                      📖 Planner Source: {currentAptItem.source}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Links from Planner */}
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                {currentAptItem?.sourceUrl && (
                  <a 
                    href={currentAptItem.sourceUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-sketch"
                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    title="Open Playlist / Source Course from Planner"
                  >
                    <ExternalLink size={14} /> Open Course
                  </a>
                )}
                {currentAptItem?.searchUrl && (
                  <a 
                    href={currentAptItem.searchUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-sketch"
                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    title="Search lecture on YouTube as specified in planner"
                  >
                    <Search size={14} /> Search
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Phase 2: Engineering Mathematics Daily Lecture */}
          <div className="sketch-card" style={{ 
            padding: '18px 20px', 
            background: currentStatus.phase2 ? 'var(--highlight-green)' : 'var(--paper-card)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div 
                  className={`sketch-check ${currentStatus.phase2 ? 'checked' : ''}`}
                  onClick={(e) => handleTogglePhase(e, 'phase2')}
                >
                  {currentStatus.phase2 && <span>✓</span>}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge-sketch badge-sketch-blue">Phase 2 • Maths Lecture ({currentMasterItem?.mathsMin || 30} min)</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Engineering Mathematics</span>
                  </div>
                  <h3 className="font-title" style={{ fontSize: '1.15rem', marginTop: '6px' }}>
                    {currentMathsItem ? currentMathsItem.lectureTopic : currentMasterItem?.mathsLecture || 'Propositional logic I: connectives & truth tables'}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink-secondary)', marginTop: '4px' }}>
                    {currentMathsItem?.whatsCovered || 'Propositions, connectives, truth tables, converse/inverse/contrapositive.'}
                  </p>
                  {currentMathsItem?.playlist && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-purple)', marginTop: '4px', fontStyle: 'italic' }}>
                      🎥 Planner Source: {currentMathsItem.playlist}
                    </div>
                  )}
                  {currentMathsItem?.quickPractice && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--ink-blue)', marginTop: '6px', fontWeight: 700 }}>
                      ⚡ Practice goal: {currentMathsItem.quickPractice}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Links from Planner */}
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                {currentMathsItem?.playlistUrl && (
                  <a 
                    href={currentMathsItem.playlistUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-sketch"
                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    title="Open GO Classes Playlist from Planner"
                  >
                    <ExternalLink size={14} /> Playlist
                  </a>
                )}
                {currentMathsItem?.searchUrl && (
                  <a 
                    href={currentMathsItem.searchUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-sketch"
                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    title="Search lecture video as listed in planner"
                  >
                    <Search size={14} /> Search
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Phase 3: Main Core Subject Block */}
          <div className="sketch-card" style={{ 
            padding: '18px 20px', 
            background: currentStatus.phase3 ? 'var(--highlight-green)' : 'var(--paper-card)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div 
                  className={`sketch-check ${currentStatus.phase3 ? 'checked' : ''}`}
                  onClick={(e) => handleTogglePhase(e, 'phase3')}
                >
                  {currentStatus.phase3 && <span>✓</span>}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge-sketch badge-sketch-yellow">Phase 3 • Core Block ({currentMasterItem?.mainBlockMin || 55} min)</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>{currentMasterItem?.subject}</span>
                  </div>
                  <h3 className="font-title" style={{ fontSize: '1.15rem', marginTop: '6px' }}>
                    {currentMasterItem?.mainFocus}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink-secondary)', marginTop: '4px' }}>
                    Deep lecture watching with pen & paper. Note syntax edge cases, pointer mechanics, and standard properties.
                  </p>
                  {currentMasterItem?.note && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--ink-amber)', marginTop: '6px' }}>
                      💡 Planner Tip: {currentMasterItem.note}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Links */}
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <a 
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(currentMasterItem?.subject + ' ' + currentMasterItem?.mainFocus + ' GATE')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-sketch"
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                  title="Search exact lecture on YouTube"
                >
                  <Search size={14} /> Search Video
                </a>
              </div>
            </div>
          </div>

          {/* Phase 4: Practice & Revision Block */}
          <div className="sketch-card" style={{ 
            padding: '18px 20px', 
            background: currentStatus.phase4 ? 'var(--highlight-green)' : 'var(--paper-card)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div 
                  className={`sketch-check ${currentStatus.phase4 ? 'checked' : ''}`}
                  onClick={(e) => handleTogglePhase(e, 'phase4')}
                >
                  {currentStatus.phase4 && <span>✓</span>}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge-sketch badge-sketch-green">Phase 4 • Practice & PYQ ({currentMasterItem?.practiceMin || 20} min)</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Active Problem Solving</span>
                  </div>
                  <h3 className="font-title" style={{ fontSize: '1.15rem', marginTop: '6px' }}>
                    GO-PDFs PYQ Solving & Error Logging
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink-secondary)', marginTop: '4px' }}>
                    Solve 5-8 previous year questions on today's concepts. If any mistake happens, log it immediately into the Error Log.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <a 
                  href="https://gateoverflow.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-sketch"
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                >
                  <ExternalLink size={14} /> GateOverflow
                </a>
              </div>
            </div>
          </div>

          {/* Quick Handwritten Notes for Today */}
          <div className="sketch-card" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="font-title" style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileEdit size={16} /> Today's Margin Notes & Doubts
              </span>
              <button 
                className="btn-sketch" 
                onClick={handleSaveNote}
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                Save Note
              </button>
            </div>
            <textarea
              className="input-sketch"
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Jot down formulas learned, tricky questions to review, or doubts for AI mentor..."
              style={{ resize: 'vertical' }}
            />
          </div>

        </div>

        {/* Right Column: Hand-Drawn Pomodoro & Focus Ambient Sounds */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="sketch-card" style={{ padding: '24px', textAlign: 'center', position: 'relative' }}>
            <div className="tape-strip"></div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
              <Clock size={22} />
              <h2 className="font-title" style={{ fontSize: '1.35rem', margin: 0 }}>Pomodoro Study Clock</h2>
            </div>

            {/* Mode Selector Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button
                className="btn-sketch"
                onClick={() => handleSelectSessionType('focus')}
                style={{
                  padding: '5px 12px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: sessionType === 'focus' ? 'var(--highlight-yellow)' : 'var(--paper-card)',
                  borderColor: sessionType === 'focus' ? 'var(--ink-primary)' : 'var(--ink-border)'
                }}
              >
                🎯 Focus ({customFocusMins}m)
              </button>
              <button
                className="btn-sketch"
                onClick={() => handleSelectSessionType('short_break')}
                style={{
                  padding: '5px 12px',
                  fontSize: '0.85rem',
                  background: sessionType === 'short_break' ? 'var(--highlight-blue)' : 'var(--paper-card)',
                  borderColor: sessionType === 'short_break' ? 'var(--ink-primary)' : 'var(--ink-border)'
                }}
              >
                <Coffee size={14} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} />
                Short Break (5m)
              </button>
              <button
                className="btn-sketch"
                onClick={() => handleSelectSessionType('long_break')}
                style={{
                  padding: '5px 12px',
                  fontSize: '0.85rem',
                  background: sessionType === 'long_break' ? 'var(--highlight-purple)' : 'var(--paper-card)',
                  borderColor: sessionType === 'long_break' ? 'var(--ink-primary)' : 'var(--ink-border)'
                }}
              >
                🧘 Long Break (15m)
              </button>
            </div>

            {/* In-App Celebratory Notification Banner */}
            {sessionCompletedBanner && (
              <div 
                className="sketch-card" 
                style={{ 
                  margin: '0 0 16px', 
                  padding: '12px 14px', 
                  background: sessionCompletedBanner.type === 'focus' ? 'var(--highlight-green)' : 'var(--highlight-blue)',
                  textAlign: 'left',
                  position: 'relative'
                }}
              >
                <button
                  onClick={() => setSessionCompletedBanner(null)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--ink-primary)'
                  }}
                  title="Dismiss"
                >
                  <X size={16} />
                </button>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} /> {sessionCompletedBanner.title}
                </div>
                <div style={{ fontSize: '0.82rem', marginTop: '2px', color: 'var(--ink-secondary)' }}>
                  {sessionCompletedBanner.message}
                </div>
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                  {sessionCompletedBanner.type === 'focus' ? (
                    <button
                      className="btn-sketch btn-sketch-primary"
                      onClick={() => {
                        handleSelectSessionType('short_break');
                        handleStartTimer();
                      }}
                      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                    >
                      ☕ Take 5m Break
                    </button>
                  ) : (
                    <button
                      className="btn-sketch btn-sketch-primary"
                      onClick={() => {
                        handleSelectSessionType('focus');
                        handleStartTimer();
                      }}
                      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                    >
                      🎯 Start Next Focus ({customFocusMins}m)
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Big Sketched Timer Display */}
            <div style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '3.6rem', 
              fontWeight: 700, 
              letterSpacing: '2px', 
              margin: '4px 0 6px',
              color: isRunning ? 'var(--ink-blue)' : 'var(--ink-primary)'
            }}>
              {formatTime(timeLeft)}
            </div>

            {/* Progress Bar */}
            {(() => {
              const totalSec = Math.max(1, timerMode * 60);
              const elapsedSec = Math.max(0, totalSec - timeLeft);
              const progressPct = Math.min(100, Math.round((elapsedSec / totalSec) * 100));
              return (
                <div style={{ margin: '0 auto 16px', maxWidth: '280px' }}>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: 'var(--paper-dark)',
                    border: '1.5px solid var(--ink-border)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${progressPct}%`,
                      height: '100%',
                      background: sessionType === 'focus' ? 'var(--ink-blue)' : 'var(--highlight-purple)',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '0.75rem', 
                    color: 'var(--ink-muted)', 
                    marginTop: '4px' 
                  }}>
                    <span>{sessionType === 'focus' ? '🎯 Study Block' : '☕ Rest Period'}</span>
                    <span>{progressPct}% elapsed</span>
                  </div>
                </div>
              );
            })()}

            {/* Primary Controls & Quick +/- 5m Adjust */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <button 
                className="btn-sketch" 
                onClick={() => handleAdjustTime(-5)}
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                title="Subtract 5 minutes"
              >
                <Minus size={14} style={{ marginRight: '2px' }} /> 5m
              </button>

              {!isRunning ? (
                <button 
                  className="btn-sketch btn-sketch-primary" 
                  onClick={handleStartTimer}
                  style={{ padding: '10px 24px', fontSize: '1.05rem', fontWeight: 700 }}
                >
                  <Play size={18} fill="currentColor" /> Start {sessionType === 'focus' ? 'Focus' : 'Break'}
                </button>
              ) : (
                <button 
                  className="btn-sketch btn-sketch-pink" 
                  onClick={handlePauseTimer}
                  style={{ padding: '10px 24px', fontSize: '1.05rem', fontWeight: 700 }}
                >
                  <Pause size={18} /> Pause
                </button>
              )}

              <button 
                className="btn-sketch" 
                onClick={() => handleResetTimer(timerMode)}
                style={{ padding: '10px 14px' }}
                title="Reset timer"
              >
                <RotateCcw size={18} />
              </button>

              <button 
                className="btn-sketch" 
                onClick={() => handleAdjustTime(5)}
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                title="Add 5 minutes"
              >
                <Plus size={14} style={{ marginRight: '2px' }} /> 5m
              </button>
            </div>

            {/* Study Time According to User Option */}
            <div style={{
              background: 'var(--paper-card-subtle)',
              border: '1.5px dashed var(--ink-border)',
              borderRadius: '8px',
              padding: '14px 12px',
              marginBottom: '18px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="font-title" style={{ fontSize: '0.92rem', fontWeight: 700 }}>
                  ⏱️ Study Time (Your Option):
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>
                  Current: <strong>{customFocusMins}m</strong>
                </span>
              </div>

              {/* Quick Presets */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {[15, 25, 30, 45, 60, 90, 120].map((mins) => (
                  <button
                    key={mins}
                    className="btn-sketch"
                    onClick={() => handleApplyCustomMinutes(mins)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.8rem',
                      fontWeight: customFocusMins === mins && sessionType === 'focus' ? 700 : 500,
                      background: customFocusMins === mins && sessionType === 'focus' ? 'var(--highlight-yellow)' : 'var(--paper-card)'
                    }}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              {/* Custom Number Input by User */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ position: 'relative', width: '90px' }}>
                  <input
                    type="number"
                    min="1"
                    max="240"
                    className="input-sketch"
                    value={customInputVal}
                    onChange={(e) => setCustomInputVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleApplyCustomMinutes(customInputVal);
                      }
                    }}
                    style={{
                      padding: '5px 8px',
                      fontSize: '0.88rem',
                      textAlign: 'center',
                      fontWeight: 700
                    }}
                    placeholder="Mins"
                  />
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--ink-secondary)' }}>minutes</span>

                <button
                  className="btn-sketch btn-sketch-primary"
                  onClick={() => handleApplyCustomMinutes(customInputVal)}
                  style={{
                    padding: '5px 12px',
                    fontSize: '0.82rem',
                    marginLeft: 'auto'
                  }}
                >
                  Set Duration
                </button>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', marginTop: '6px' }}>
                💡 Type any minutes (1-240) or pick a preset. Automatically saved for your future study sessions!
              </div>
            </div>

            {/* Ambient Focus Generator */}
            <div style={{ 
              paddingTop: '16px', 
              borderTop: '2px dashed var(--ink-border)', 
              textAlign: 'left' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="font-title" style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Headphones size={16} /> Ambient Focus Sounds
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>Offline Synth</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <button
                  className="btn-sketch"
                  onClick={() => toggleAmbient('white_noise')}
                  style={{
                    fontSize: '0.8rem',
                    padding: '8px 4px',
                    background: ambientType === 'white_noise' ? 'var(--highlight-blue)' : 'var(--paper-card)'
                  }}
                >
                  🌧️ Rain
                </button>
                <button
                  className="btn-sketch"
                  onClick={() => toggleAmbient('binaural_40hz')}
                  style={{
                    fontSize: '0.8rem',
                    padding: '8px 4px',
                    background: ambientType === 'binaural_40hz' ? 'var(--highlight-purple)' : 'var(--paper-card)'
                  }}
                >
                  🧠 40Hz
                </button>
                <button
                  className="btn-sketch"
                  onClick={() => toggleAmbient('drone')}
                  style={{
                    fontSize: '0.8rem',
                    padding: '8px 4px',
                    background: ambientType === 'drone' ? 'var(--highlight-yellow)' : 'var(--paper-card)'
                  }}
                >
                  🌌 Drone
                </button>
              </div>

              {ambientType !== 'none' && (
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Volume2 size={16} color="var(--ink-muted)" />
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={ambientVolume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setAmbientVolume(v);
                      startAmbientSound(ambientType, v);
                    }}
                    style={{ flex: 1, accentColor: 'var(--ink-primary)' }}
                  />
                  <button 
                    onClick={() => toggleAmbient('none')} 
                    style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer' }}
                  >
                    <VolumeX size={16} />
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Sticky Note Golden Rule */}
          <div className="sticky-paper">
            <h3 className="font-title" style={{ fontSize: '1.05rem', margin: '0 0 6px', fontWeight: 700 }}>
              📌 Non-Negotiable Study Rule:
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: '#1E293B' }}>
              Every single day requires <strong>exactly ONE Engineering Maths lecture (~30 min)</strong>. By 29 Dec, you will have completed all 52 Discrete, Linear Algebra, Probability, and Calculus lectures!
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
