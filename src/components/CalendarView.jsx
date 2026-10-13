import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  Clock, 
  GraduationCap, 
  AlertTriangle, 
  ExternalLink, 
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  X,
  Download,
  Share2,
  CalendarPlus,
  Check,
  CheckCheck,
  Tag
} from 'lucide-react';
import { playClick, playSuccessChime } from '../utils/audio';
import { fireTaskConfetti } from '../utils/confetti';
import { createGoogleCalendarUrl, downloadIcsSchedule } from '../utils/googleCalendar';

export default function CalendarView({ 
  masterSchedule, 
  dayStatus, 
  currentDate, 
  onSelectDate, 
  onOpenReschedule,
  onUpdateDayStatus
}) {
  // Available months across the study campaign: Oct 2026 to Feb 2027
  const months = [
    { name: 'October 2026', year: 2026, month: 9 }, // 0-indexed: 9 = October
    { name: 'November 2026', year: 2026, month: 10 },
    { name: 'December 2026', year: 2026, month: 11 },
    { name: 'January 2027', year: 2027, month: 0 },
    { name: 'February 2027', year: 2027, month: 1 }
  ];

  // Default to the month of currentDate (October 2026)
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);
  const currentMonthData = months[selectedMonthIdx];

  // Persistent Custom Calendar Events & Tasks
  const [customEvents, setCustomEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('gate_custom_calendar_events_v1');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const saveCustomEvents = (updated) => {
    setCustomEvents(updated);
    try {
      localStorage.setItem('gate_custom_calendar_events_v1', JSON.stringify(updated));
    } catch (e) {}
  };

  // Interactive Day Inspector & Customizer Modal State
  const [modalDay, setModalDay] = useState(null); // When not null, modal is open
  const [newCustomTitle, setNewCustomTitle] = useState('');
  const [newCustomCategory, setNewCustomCategory] = useState('Study / PYQs');
  const [newCustomHours, setNewCustomHours] = useState('1');
  const [newCustomNotes, setNewCustomNotes] = useState('');

  const handlePrevMonth = () => {
    playClick();
    setSelectedMonthIdx(prev => Math.max(0, prev - 1));
  };

  const handleNextMonth = () => {
    playClick();
    setSelectedMonthIdx(prev => Math.min(months.length - 1, prev + 1));
  };

  // Helper to build the calendar grid for currentMonthData
  const year = currentMonthData.year;
  const month = currentMonthData.month;
  
  // First day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  // Total days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create date cells array
  const dateCells = [];
  // 1. Empty padding cells for days before the 1st
  for (let i = 0; i < firstDayOfWeek; i++) {
    dateCells.push({ empty: true, id: `pad-${i}` });
  }

  // 2. Days of this month
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const formattedDay = String(dayNum).padStart(2, '0');
    const formattedMonth = String(month + 1).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    // Find in master schedule
    const scheduleItem = masterSchedule.find(m => m.date === dateStr);
    const statusObj = dayStatus[dateStr] || { status: 'Not Started' };
    const dayCustomEvents = customEvents[dateStr] || [];

    // Check special event flags
    const isToday = dateStr === currentDate;
    const isSunday = new Date(year, month, dayNum).getDay() === 0;
    
    // IPU Exam flags (Nov 24 - Dec 28)
    const isIpuExam = scheduleItem?.subject?.includes('IPU') || 
                      scheduleItem?.type?.includes('Uni') ||
                      dateStr === '2026-11-26' || dateStr === '2026-12-15' || 
                      dateStr === '2026-12-17' || dateStr === '2026-12-19' || 
                      dateStr === '2026-12-22' || dateStr === '2026-12-24' || dateStr === '2026-12-28';

    // GATE 2027 Exam Day flag (Feb 13, 2027)
    const isGateExam = dateStr === '2027-02-13';

    dateCells.push({
      empty: false,
      dayNum,
      dateStr,
      scheduleItem,
      status: statusObj.status,
      dayCustomEvents,
      isToday,
      isSunday,
      isIpuExam,
      isGateExam
    });
  }

  // Month Statistics
  const daysInThisMonthSchedule = masterSchedule.filter(m => {
    const [y, mth] = m.date.split('-');
    return parseInt(y) === year && parseInt(mth) === month + 1;
  });
  
  const completedThisMonth = daysInThisMonthSchedule.filter(m => dayStatus[m.date]?.status === 'Done').length;
  const monthPercent = daysInThisMonthSchedule.length > 0 
    ? Math.round((completedThisMonth / daysInThisMonthSchedule.length) * 100) 
    : 0;

  // Handle Day Click -> Open Interactive Day Modal
  const handleCellClick = (cell) => {
    playClick();
    setModalDay(cell);
  };

  // Add Custom Task for inspected day
  const handleAddCustomTask = (e) => {
    e.preventDefault();
    if (!newCustomTitle.trim() || !modalDay) return;

    playClick();
    const newTask = {
      id: `task-${Date.now()}`,
      title: newCustomTitle.trim(),
      category: newCustomCategory,
      plannedHrs: parseFloat(newCustomHours) || 1.0,
      notes: newCustomNotes.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    const dateStr = modalDay.dateStr;
    const existing = customEvents[dateStr] || [];
    const updated = {
      ...customEvents,
      [dateStr]: [...existing, newTask]
    };

    saveCustomEvents(updated);
    setNewCustomTitle('');
    setNewCustomNotes('');

    // Update modalDay state as well
    setModalDay(prev => ({
      ...prev,
      dayCustomEvents: [...(prev.dayCustomEvents || []), newTask]
    }));
  };

  // Toggle Custom Task completion
  const handleToggleCustomTask = (e, taskId) => {
    e.stopPropagation();
    if (!modalDay) return;
    const dateStr = modalDay.dateStr;
    const existing = customEvents[dateStr] || [];
    const updatedTasks = existing.map(t => {
      if (t.id === taskId) {
        const next = !t.completed;
        if (next) fireTaskConfetti(e);
        return { ...t, completed: next };
      }
      return t;
    });

    const updated = { ...customEvents, [dateStr]: updatedTasks };
    saveCustomEvents(updated);
    setModalDay(prev => ({ ...prev, dayCustomEvents: updatedTasks }));
  };

  // Delete Custom Task
  const handleDeleteCustomTask = (taskId) => {
    playClick();
    if (!modalDay) return;
    const dateStr = modalDay.dateStr;
    const existing = customEvents[dateStr] || [];
    const updatedTasks = existing.filter(t => t.id !== taskId);
    const updated = { ...customEvents, [dateStr]: updatedTasks };
    saveCustomEvents(updated);
    setModalDay(prev => ({ ...prev, dayCustomEvents: updatedTasks }));
  };

  // Toggle Master Day Status from modal
  const handleToggleDayStatus = (e) => {
    if (!modalDay || !onUpdateDayStatus) return;
    const dateStr = modalDay.dateStr;
    const curr = dayStatus[dateStr] || { status: 'Not Started' };
    const nextStatus = curr.status === 'Done' ? 'Not Started' : 'Done';

    if (nextStatus === 'Done') {
      fireTaskConfetti(e);
      playSuccessChime();
    } else {
      playClick();
    }

    onUpdateDayStatus(dateStr, { ...curr, status: nextStatus });
    setModalDay(prev => ({ ...prev, status: nextStatus }));
  };

  // Export entire schedule to .ICS for Google Calendar
  const handleExportIcs = () => {
    playClick();
    downloadIcsSchedule(masterSchedule, customEvents);
  };

  return (
    <div style={{ padding: '0 18px 40px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Top Header Card */}
      <div className="sketch-card" style={{ padding: '24px', marginBottom: '22px' }}>
        <div className="tape-strip"></div>
        <div className="tape-strip tape-strip-right"></div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-sketch badge-sketch-blue">DESK CALENDAR • CLICKABLE</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Master Schedule & Custom Plan Editor</span>
            </div>
            <h1 className="font-title" style={{ fontSize: '1.9rem', margin: '6px 0 0' }}>
              🗓️ GATE 2027 Study Desk Calendar
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              Click any date to inspect details, add personal college/study tasks, toggle completion, or sync directly to Google Calendar.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn-sketch btn-sketch-primary"
              onClick={handleExportIcs}
              title="Download RFC 5545 iCalendar (.ICS) file to import into Google Calendar"
              style={{ fontSize: '0.85rem' }}
            >
              <Download size={15} /> Export to Google Calendar (.ICS)
            </button>
            <button 
              className="btn-sketch"
              onClick={() => {
                playClick();
                setSelectedMonthIdx(0); // Jump back to Oct 2026
              }}
              style={{ fontSize: '0.85rem' }}
            >
              🎯 Current Month (Oct)
            </button>
          </div>
        </div>

        {/* Month Navigation & Progress Bar */}
        <div style={{ 
          marginTop: '18px', 
          paddingTop: '16px', 
          borderTop: '2px dashed var(--ink-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className="btn-sketch" 
              onClick={handlePrevMonth} 
              disabled={selectedMonthIdx === 0}
              style={{ padding: '6px 12px', opacity: selectedMonthIdx === 0 ? 0.4 : 1 }}
            >
              <ChevronLeft size={16} /> Prev Month
            </button>
            <h2 className="font-title" style={{ fontSize: '1.4rem', margin: 0, minWidth: '180px', textAlign: 'center' }}>
              {currentMonthData.name}
            </h2>
            <button 
              className="btn-sketch" 
              onClick={handleNextMonth} 
              disabled={selectedMonthIdx === months.length - 1}
              style={{ padding: '6px 12px', opacity: selectedMonthIdx === months.length - 1 ? 0.4 : 1 }}
            >
              Next Month <ChevronRight size={16} />
            </button>
          </div>

          {/* Month Completion Chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>
              Month Completion: <strong>{completedThisMonth}</strong> / {daysInThisMonthSchedule.length} days ({monthPercent}%)
            </span>
            <div style={{ 
              width: '140px', 
              height: '10px', 
              background: 'var(--paper-card-subtle)', 
              borderRadius: '6px', 
              border: '1.5px solid var(--ink-border)',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${monthPercent}%`, 
                height: '100%', 
                background: 'var(--ink-green)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Desk Calendar Spiral Frame */}
      <div className="sketch-card" style={{ padding: '28px 20px 24px', position: 'relative' }}>
        
        {/* Desk Spiral Binder Rings decoration */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          position: 'absolute', 
          top: '-14px', 
          left: '20px', 
          right: '20px', 
          pointerEvents: 'none' 
        }}>
          {[...Array(14)].map((_, i) => (
            <div 
              key={i} 
              style={{ 
                width: '16px', 
                height: '28px', 
                background: 'linear-gradient(to right, #475569, #94A3B8, #334155)', 
                borderRadius: '8px', 
                border: '1.5px solid #0F172A',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
              }} 
            />
          ))}
        </div>

        {/* Aligned Scrollable Grid Container */}
        <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '6px' }}>
          <div style={{ minWidth: '700px' }}>

            {/* Days of Week Header */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              gap: '8px', 
              marginBottom: '10px',
              marginTop: '10px',
              textAlign: 'center',
              fontWeight: 800,
              fontSize: '0.9rem'
            }}>
              <div style={{ color: '#DC2626', padding: '4px 0', background: 'var(--paper-card-subtle)', borderRadius: '6px' }}>SUN</div>
              <div style={{ padding: '4px 0', background: 'var(--paper-card-subtle)', borderRadius: '6px' }}>MON</div>
              <div style={{ padding: '4px 0', background: 'var(--paper-card-subtle)', borderRadius: '6px' }}>TUE</div>
              <div style={{ padding: '4px 0', background: 'var(--paper-card-subtle)', borderRadius: '6px' }}>WED</div>
              <div style={{ padding: '4px 0', background: 'var(--paper-card-subtle)', borderRadius: '6px' }}>THU</div>
              <div style={{ padding: '4px 0', background: 'var(--paper-card-subtle)', borderRadius: '6px' }}>FRI</div>
              <div style={{ color: '#2563EB', padding: '4px 0', background: 'var(--paper-card-subtle)', borderRadius: '6px' }}>SAT</div>
            </div>

            {/* 7-Column Calendar Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              gap: '8px' 
            }}>
          {dateCells.map((cell, idx) => {
            if (cell.empty) {
              return (
                <div 
                  key={cell.id} 
                  style={{ 
                    minHeight: '94px', 
                    background: 'rgba(0,0,0,0.02)', 
                    border: '1px dashed rgba(0,0,0,0.1)', 
                    borderRadius: '8px' 
                  }} 
                />
              );
            }

            const customTasksCount = cell.dayCustomEvents.length;
            let bg = 'var(--paper-card)';
            if (cell.status === 'Done') bg = 'var(--highlight-green)';
            else if (cell.status === 'In Progress') bg = 'var(--highlight-blue)';
            else if (cell.isGateExam) bg = 'var(--highlight-yellow)';
            else if (cell.isIpuExam) bg = 'var(--highlight-pink)';
            else if (cell.isSunday) bg = 'var(--highlight-orange)';

            return (
              <div
                key={cell.dateStr}
                onClick={() => handleCellClick(cell)}
                style={{
                  minHeight: '94px',
                  padding: '6px 8px',
                  background: bg,
                  border: cell.isToday ? '2px solid #2563EB' : '1.5px solid var(--ink-border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: cell.isToday ? '0 0 0 2px #93C5FD' : '1px 1px 0px rgba(0,0,0,0.06)',
                  transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                  position: 'relative'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '2px 3px 0px var(--ink-border)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = cell.isToday ? '0 0 0 2px #93C5FD' : '1px 1px 0px rgba(0,0,0,0.06)';
                }}
              >
                {/* Top: Date Number & Badges */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span 
                    style={{ 
                      fontWeight: 700, 
                      fontSize: '0.95rem',
                      background: cell.isToday ? '#2563EB' : 'transparent',
                      color: cell.isToday ? '#FFFFFF' : cell.isSunday ? '#DC2626' : 'var(--ink-primary)',
                      padding: cell.isToday ? '1px 6px' : '0',
                      borderRadius: cell.isToday ? '4px' : '0'
                    }}
                  >
                    {cell.dayNum}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {/* Status Stamp */}
                    {cell.status === 'Done' ? (
                      <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 800 }}>✓</span>
                    ) : cell.status === 'In Progress' ? (
                      <span style={{ fontSize: '0.7rem', color: '#1E40AF', fontWeight: 800 }}>●</span>
                    ) : cell.isGateExam ? (
                      <span style={{ fontSize: '0.75rem' }}>🏆</span>
                    ) : cell.isIpuExam ? (
                      <span style={{ fontSize: '0.75rem' }}>🏛️</span>
                    ) : cell.isSunday ? (
                      <span style={{ fontSize: '0.75rem' }}>🎯</span>
                    ) : null}

                    {/* Custom task indicator */}
                    {customTasksCount > 0 && (
                      <span className="badge-sketch" style={{ fontSize: '0.65rem', padding: '1px 3px', background: '#FEF08A' }}>
                        +{customTasksCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle: Subject / Focus snippet */}
                {cell.scheduleItem ? (
                  <div style={{ marginTop: '3px', lineHeight: 1.2 }}>
                    <div style={{ 
                      fontSize: '0.72rem', 
                      fontWeight: 700, 
                      color: 'var(--ink-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {cell.scheduleItem.subject}
                    </div>
                    <div style={{ 
                      fontSize: '0.65rem', 
                      color: 'var(--ink-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {cell.scheduleItem.mainFocus}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.68rem', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                    {cell.isGateExam ? 'GATE 2027 D-DAY' : cell.isSunday ? 'Revision Test' : 'Open Buffer'}
                  </div>
                )}

                {/* Bottom: Hours indicator */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.62rem', color: 'var(--ink-muted)' }}>
                  <span>{cell.dayCustomEvents.length > 0 ? '📝 tasks' : ''}</span>
                {cell.scheduleItem && <span>⏱️ {cell.scheduleItem.totalHrs}h</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

        {/* Calendar Legend */}
        <div style={{ 
          marginTop: '16px', 
          paddingTop: '12px', 
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '16px', 
          flexWrap: 'wrap',
          fontSize: '0.8rem' 
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '12px', background: 'var(--highlight-green)', border: '1px solid #166534', borderRadius: '3px' }}></span> Done (Completed)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '12px', background: 'var(--highlight-blue)', border: '1px solid #1E40AF', borderRadius: '3px' }}></span> In Progress
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '12px', background: 'var(--highlight-pink)', border: '1px solid #9F1239', borderRadius: '3px' }}></span> IPU Exam Milestone
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '12px', background: 'var(--highlight-orange)', border: '1px solid #9A3412', borderRadius: '3px' }}></span> Sunday Test Block
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '12px', background: '#FEF08A', border: '1px solid #CA8A04', borderRadius: '3px' }}></span> User Custom Task
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Interactive Day Inspector & Customizer Modal (Clickable Calendar) */}
      {/* ========================================================================= */}
      {modalDay && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div 
            className="sketch-card" 
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '2.5px solid var(--ink-border)'
            }}
          >
            <div className="tape-strip"></div>
            <div className="tape-strip tape-strip-right"></div>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge-sketch badge-sketch-yellow" style={{ fontSize: '0.85rem' }}>
                    📅 {modalDay.dateStr}
                  </span>
                  <span className="badge-sketch" style={{ 
                    background: modalDay.status === 'Done' ? 'var(--highlight-green)' : 'var(--highlight-blue)',
                    fontWeight: 700 
                  }}>
                    {modalDay.status}
                  </span>
                  {modalDay.isToday && (
                    <span className="badge-sketch badge-sketch-blue">TODAY</span>
                  )}
                </div>
                <h2 className="font-title" style={{ fontSize: '1.6rem', margin: '6px 0 0' }}>
                  Day Plan & Custom Events
                </h2>
              </div>

              <button
                className="btn-sketch"
                onClick={() => { playClick(); setModalDay(null); }}
                style={{ padding: '6px 10px', fontSize: '0.9rem' }}
              >
                <X size={16} /> Close
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
              <a
                href={createGoogleCalendarUrl({
                  title: modalDay.scheduleItem ? `GATE 2027: ${modalDay.scheduleItem.subject}` : `GATE Study Day: ${modalDay.dateStr}`,
                  description: modalDay.scheduleItem ? `Focus: ${modalDay.scheduleItem.mainFocus}\\nMaths: ${modalDay.scheduleItem.mathsLecture}` : 'GATE Revision Day',
                  startDate: modalDay.dateStr,
                  durationMinutes: Math.round((modalDay.scheduleItem?.totalHrs || 2.5) * 60)
                })}
                target="_blank"
                rel="noreferrer"
                className="btn-sketch"
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                title="Add this day to your Google Calendar"
              >
                <CalendarPlus size={15} /> Add to Google Calendar
              </a>

              <button
                className={`btn-sketch ${modalDay.status === 'Done' ? 'btn-sketch-green' : 'btn-sketch-primary'}`}
                onClick={(e) => handleToggleDayStatus(e)}
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
              >
                <CheckCheck size={15} />
                {modalDay.status === 'Done' ? 'Mark Incomplete' : 'Mark Day Completed'}
              </button>

              <button
                className="btn-sketch"
                onClick={() => {
                  playClick();
                  onSelectDate(modalDay.dateStr);
                }}
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
              >
                <BookOpen size={15} /> Open in Today's Mission
              </button>
            </div>

            {/* Master Schedule Details (if scheduled) */}
            {modalDay.scheduleItem && (
              <div style={{ 
                padding: '14px 16px', 
                background: 'var(--paper-card)', 
                borderRadius: '8px', 
                border: '1.5px solid var(--ink-border)',
                marginBottom: '18px'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--ink-secondary)', textTransform: 'uppercase' }}>
                  GATE Master Planner Topic
                </div>
                <div className="font-title" style={{ fontSize: '1.25rem', marginTop: '4px' }}>
                  {modalDay.scheduleItem.subject}: {modalDay.scheduleItem.mainFocus}
                </div>
                {modalDay.scheduleItem.mathsLecture && (
                  <div style={{ fontSize: '0.88rem', color: 'var(--ink-blue)', marginTop: '4px' }}>
                    📐 <strong>Maths:</strong> {modalDay.scheduleItem.mathsLecture}
                  </div>
                )}
                <div style={{ fontSize: '0.82rem', color: 'var(--ink-secondary)', marginTop: '4px' }}>
                  ⏱️ <strong>Target Hours:</strong> {modalDay.scheduleItem.totalHrs} hrs | <strong>Easy Start:</strong> {modalDay.scheduleItem.easyStartMin}m
                </div>
              </div>
            )}

            {/* Custom User Tasks & Notes Section */}
            <div style={{ marginTop: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 className="font-title" style={{ fontSize: '1.15rem', margin: 0 }}>
                  📝 My Custom Tasks & Notes ({modalDay.dayCustomEvents?.length || 0})
                </h3>
              </div>

              {/* Tasks List */}
              {modalDay.dayCustomEvents && modalDay.dayCustomEvents.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  {modalDay.dayCustomEvents.map((task) => (
                    <div 
                      key={task.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        background: task.completed ? 'var(--highlight-green)' : 'var(--paper-card)',
                        border: '1.5px solid var(--ink-border)',
                        borderRadius: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div 
                          className={`sketch-check ${task.completed ? 'checked' : ''}`}
                          onClick={(e) => handleToggleCustomTask(e, task.id)}
                          style={{ width: '20px', height: '20px', fontSize: '0.75rem' }}
                        >
                          {task.completed && <span>✓</span>}
                        </div>
                        <div>
                          <div style={{ 
                            fontWeight: 700, 
                            fontSize: '0.92rem',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? 'var(--ink-muted)' : 'var(--ink-primary)'
                          }}>
                            {task.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                            <span className="badge-sketch" style={{ padding: '1px 5px', fontSize: '0.7rem' }}>{task.category}</span>
                            <span>⏱️ {task.plannedHrs}h</span>
                            {task.notes && <span>• {task.notes}</span>}
                          </div>
                        </div>
                      </div>

                      <button
                        className="btn-sketch"
                        onClick={() => handleDeleteCustomTask(task.id)}
                        style={{ padding: '4px 8px', color: '#DC2626' }}
                        title="Delete task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  padding: '12px', 
                  background: 'var(--paper-card-subtle)', 
                  borderRadius: '6px', 
                  border: '1px dashed var(--ink-border)',
                  fontSize: '0.85rem',
                  color: 'var(--ink-muted)',
                  textAlign: 'center',
                  marginBottom: '14px'
                }}>
                  No custom tasks logged for this day yet. Add one below!
                </div>
              )}

              {/* Add Custom Task Form */}
              <form 
                onSubmit={handleAddCustomTask}
                style={{ 
                  padding: '14px', 
                  background: 'var(--paper-card-subtle)', 
                  borderRadius: '8px', 
                  border: '1.5px solid var(--ink-border)' 
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px', color: 'var(--ink-primary)' }}>
                  ➕ Add New Task or Note for {modalDay.dateStr}
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="e.g. College Lab Viva / Extra 30 PYQs / Review notes..."
                    value={newCustomTitle}
                    onChange={e => setNewCustomTitle(e.target.value)}
                    required
                    style={{
                      flex: 1,
                      minWidth: '220px',
                      padding: '8px 12px',
                      border: '1.5px solid var(--ink-border)',
                      borderRadius: '6px',
                      fontFamily: 'inherit',
                      fontSize: '0.88rem'
                    }}
                  />

                  <select
                    value={newCustomCategory}
                    onChange={e => setNewCustomCategory(e.target.value)}
                    style={{
                      padding: '8px 10px',
                      border: '1.5px solid var(--ink-border)',
                      borderRadius: '6px',
                      fontFamily: 'inherit',
                      fontSize: '0.85rem',
                      background: 'var(--paper-card)'
                    }}
                  >
                    <option value="Study / PYQs">Study / PYQs</option>
                    <option value="College Exam / Viva">College Exam / Viva</option>
                    <option value="Formula Revision">Formula Revision</option>
                    <option value="Personal Milestone">Personal Milestone</option>
                  </select>

                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="12"
                    placeholder="Hours"
                    value={newCustomHours}
                    onChange={e => setNewCustomHours(e.target.value)}
                    style={{
                      width: '80px',
                      padding: '8px 10px',
                      border: '1.5px solid var(--ink-border)',
                      borderRadius: '6px',
                      fontFamily: 'inherit',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Optional notes or details..."
                    value={newCustomNotes}
                    onChange={e => setNewCustomNotes(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '6px 12px',
                      border: '1.5px solid var(--ink-border)',
                      borderRadius: '6px',
                      fontFamily: 'inherit',
                      fontSize: '0.82rem'
                    }}
                  />
                  <button 
                    type="submit"
                    className="btn-sketch btn-sketch-primary"
                    style={{ padding: '6px 14px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                  >
                    <Plus size={15} /> Add to Calendar
                  </button>
                </div>
              </form>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
