import React, { useState } from 'react';
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
  BookOpen
} from 'lucide-react';
import { playClick } from '../utils/audio';

export default function CalendarView({ 
  masterSchedule, 
  dayStatus, 
  currentDate, 
  onSelectDate, 
  onOpenReschedule 
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

    // Check special event flags
    const isToday = dateStr === currentDate;
    const isSunday = new Date(year, month, dayNum).getDay() === 0;
    
    // IPU Exam flags (Nov 24 - Dec 28)
    const isIpuExam = scheduleItem?.subject?.includes('IPU') || 
                      scheduleItem?.type?.includes('Uni') ||
                      dateStr === '2026-11-26' || dateStr === '2026-12-15' || 
                      dateStr === '2026-12-17' || dateStr === '2026-12-19' || 
                      dateStr === '2026-12-22' || dateStr === '2026-12-24' || dateStr === '2026-12-28';

    dateCells.push({
      empty: false,
      dayNum,
      dateStr,
      scheduleItem,
      status: statusObj.status,
      isToday,
      isSunday,
      isIpuExam
    });
  }

  // Month Statistics
  const daysInThisMonthSchedule = masterSchedule.filter(m => {
    const [y, mth] = m.date.split('-');
    return parseInt(y) === year && parseInt(mth) === month + 1;
  });
  
  const completedInThisMonth = daysInThisMonthSchedule.filter(m => dayStatus[m.date]?.status === 'Done').length;
  const inProgressInThisMonth = daysInThisMonthSchedule.filter(m => dayStatus[m.date]?.status === 'In Progress').length;

  const [inspectDay, setInspectDay] = useState(() => {
    return dateCells.find(c => !c.empty && c.isToday) || dateCells.find(c => !c.empty && c.scheduleItem);
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '16px 20px 40px' }}>
      
      {/* Top Banner & Header */}
      <div className="sketch-card" style={{ marginBottom: '20px', padding: '20px 24px' }}>
        <div className="tape-strip"></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--sketch-radius-sm)',
              background: 'var(--highlight-yellow)',
              border: '2px solid var(--ink-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              boxShadow: '2px 2px 0px var(--ink-border)'
            }}>
              📅
            </div>
            <div>
              <h1 className="font-title" style={{ fontSize: '1.7rem', margin: 0 }}>
                GATE 2027 Master Calendar & Monthly Desk Planner
              </h1>
              <div style={{ fontSize: '0.9rem', color: 'var(--ink-secondary)' }}>
                Visual month-by-month itinerary from Day 1 (Oct 13, 2026) through University Exams & GATE 2027
              </div>
            </div>
          </div>

          {/* Month Navigator Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className="btn-sketch" 
              onClick={handlePrevMonth}
              disabled={selectedMonthIdx === 0}
              style={{ opacity: selectedMonthIdx === 0 ? 0.4 : 1 }}
            >
              <ChevronLeft size={16} /> Prev Month
            </button>
            <div className="badge-sketch badge-sketch-yellow" style={{ fontSize: '1.1rem', fontWeight: 700, padding: '6px 16px' }}>
              {currentMonthData.name}
            </div>
            <button 
              className="btn-sketch" 
              onClick={handleNextMonth}
              disabled={selectedMonthIdx === months.length - 1}
              style={{ opacity: selectedMonthIdx === months.length - 1 ? 0.4 : 1 }}
            >
              Next Month <ChevronRight size={16} />
            </button>
          </div>

        </div>

        {/* Month Summary Bar */}
        <div style={{ 
          marginTop: '16px', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '10px' 
        }}>
          <div className="sketch-card" style={{ padding: '8px 14px', background: 'var(--highlight-green)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>MONTH COMPLETION</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              {completedInThisMonth} / {daysInThisMonthSchedule.length} Days Done
            </div>
          </div>
          <div className="sketch-card" style={{ padding: '8px 14px', background: 'var(--highlight-blue)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E40AF' }}>IN PROGRESS</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              {inProgressInThisMonth} Active Days
            </div>
          </div>
          <div className="sketch-card" style={{ padding: '8px 14px', background: 'var(--highlight-pink)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9F1239' }}>UNIVERSITY MILESTONE</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              {selectedMonthIdx === 1 ? 'Nov 26: Practical Exams' : selectedMonthIdx === 2 ? 'Dec 11–28: Theory Exams' : 'Dedicated GATE Blocks'}
            </div>
          </div>
          <div className="sketch-card" style={{ padding: '8px 14px', background: 'var(--highlight-orange)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9A3412' }}>MISSED A DAY?</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Rebalance with AI</div>
            </div>
            <button 
              className="btn-sketch btn-sketch-primary" 
              onClick={onOpenReschedule}
              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
            >
              <Sparkles size={12} /> Reschedule
            </button>
          </div>
        </div>

      </div>

      {/* Main Calendar Layout: Grid + Inspect Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        
        {/* Calendar Grid Sheet */}
        <div className="sketch-card" style={{ padding: '20px' }}>
          
          {/* Day of week headers */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            textAlign: 'center', 
            fontWeight: 700, 
            fontSize: '0.95rem',
            marginBottom: '10px',
            borderBottom: '2px dashed var(--ink-border)',
            paddingBottom: '8px'
          }}>
            <div style={{ color: '#DC2626' }}>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div style={{ color: '#2563EB' }}>Sat</div>
          </div>

          {/* Calendar Day Cells */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '8px' 
          }}>
            {dateCells.map(cell => {
              if (cell.empty) {
                return (
                  <div 
                    key={cell.id} 
                    style={{ 
                      minHeight: '85px', 
                      background: 'rgba(0,0,0,0.02)', 
                      borderRadius: '8px' 
                    }} 
                  />
                );
              }

              const isInspected = inspectDay?.dateStr === cell.dateStr;
              let bg = 'var(--paper-card)';
              if (cell.status === 'Done') bg = 'var(--highlight-green)';
              else if (cell.status === 'In Progress') bg = 'var(--highlight-blue)';
              else if (cell.isIpuExam) bg = 'var(--highlight-pink)';
              else if (cell.isSunday) bg = 'var(--highlight-orange)';

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => {
                    playClick();
                    setInspectDay(cell);
                  }}
                  style={{
                    minHeight: '88px',
                    padding: '6px 8px',
                    background: bg,
                    border: isInspected ? '2px solid #2563EB' : '1.5px solid var(--ink-border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isInspected ? '0 0 0 2px #93C5FD' : 'none',
                    transition: 'transform 0.1s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* Top: Date Number & Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span 
                      style={{ 
                        fontWeight: 700, 
                        fontSize: '0.95rem',
                        background: cell.isToday ? '#2563EB' : 'transparent',
                        color: cell.isToday ? '#FFFFFF' : cell.isSunday ? '#DC2626' : 'var(--ink-primary)',
                        padding: cell.isToday ? '1px 5px' : '0',
                        borderRadius: cell.isToday ? '4px' : '0'
                      }}
                    >
                      {cell.dayNum}
                    </span>

                    {/* Status Stamp */}
                    {cell.status === 'Done' ? (
                      <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 800 }}>✓</span>
                    ) : cell.status === 'In Progress' ? (
                      <span style={{ fontSize: '0.7rem', color: '#1E40AF', fontWeight: 800 }}>●</span>
                    ) : cell.isIpuExam ? (
                      <span style={{ fontSize: '0.75rem' }}>🏛️</span>
                    ) : cell.isSunday ? (
                      <span style={{ fontSize: '0.75rem' }}>🎯</span>
                    ) : null}
                  </div>

                  {/* Middle: Subject / Focus snippet */}
                  {cell.scheduleItem ? (
                    <div style={{ marginTop: '4px', lineHeight: 1.2 }}>
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
                      {cell.isSunday ? 'Revision Test' : 'Open Buffer'}
                    </div>
                  )}

                  {/* Bottom: Hours indicator */}
                  {cell.scheduleItem && (
                    <div style={{ fontSize: '0.62rem', color: 'var(--ink-muted)', textAlign: 'right' }}>
                      ⏱️ {cell.scheduleItem.totalHrs}h
                    </div>
                  )}
                </div>
              );
            })}
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
          </div>

        </div>

        {/* Selected Day Inspect Sidebar Card */}
        <div className="sketch-card" style={{ padding: '20px', alignSelf: 'start' }}>
          <div className="tape-strip"></div>
          
          <h3 className="font-title" style={{ fontSize: '1.25rem', marginTop: '6px', marginBottom: '8px' }}>
            Day Inspector
          </h3>

          {inspectDay?.scheduleItem ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge-sketch badge-sketch-yellow">
                  {inspectDay.dateStr} ({inspectDay.scheduleItem.day})
                </span>
                <span className="badge-sketch" style={{ background: inspectDay.status === 'Done' ? 'var(--highlight-green)' : 'var(--highlight-blue)' }}>
                  {inspectDay.status}
                </span>
              </div>

              <div style={{ marginTop: '12px', padding: '12px', background: 'var(--paper-card-subtle)', borderRadius: '8px', border: '1.5px solid var(--ink-border)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)', fontWeight: 600 }}>SUBJECT:</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink-primary)' }}>
                  {inspectDay.scheduleItem.subject}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)', fontWeight: 600, marginTop: '8px' }}>TODAY'S MAIN FOCUS:</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  {inspectDay.scheduleItem.mainFocus}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)', fontWeight: 600, marginTop: '8px' }}>ENGINEERING MATHS:</div>
                <div style={{ fontSize: '0.85rem' }}>
                  {inspectDay.scheduleItem.mathsLecture || 'No scheduled slot'}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)', fontWeight: 600, marginTop: '8px' }}>TIME ALLOCATION:</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--ink-primary)' }}>
                  ⏱️ {inspectDay.scheduleItem.totalHrs} Hours (Daily target: 3–3.5h)
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                <button 
                  className="btn-sketch btn-sketch-primary"
                  onClick={() => {
                    playClick();
                    onSelectDate(inspectDay.dateStr);
                  }}
                  style={{ width: '100%', fontSize: '0.95rem' }}
                >
                  <BookOpen size={16} /> Open in Today's Journal ↗
                </button>

                <button 
                  className="btn-sketch btn-sketch-pink"
                  onClick={() => {
                    playClick();
                    onOpenReschedule();
                  }}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                >
                  <Sparkles size={14} /> Reschedule This Day
                </button>
              </div>

            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--ink-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📌</div>
              <p style={{ fontSize: '0.9rem' }}>
                {inspectDay ? `${inspectDay.dateStr} is a revision buffer or open day.` : 'Click any date in the calendar to view topic details and jump directly into study mode.'}
              </p>
            </div>
          )}

          {/* Quick Shortcuts */}
          <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px dashed var(--ink-border)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>CALENDAR SHORTCUTS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button 
                className="btn-sketch"
                onClick={() => {
                  playClick();
                  onSelectDate('2026-10-13');
                }}
                style={{ fontSize: '0.8rem', justifyContent: 'flex-start' }}
              >
                📍 Jump to Day 1 (13 Oct 2026)
              </button>
              <button 
                className="btn-sketch"
                onClick={() => {
                  playClick();
                  onSelectDate('2026-11-26');
                }}
                style={{ fontSize: '0.8rem', justifyContent: 'flex-start' }}
              >
                🔬 Practical Exams Kickoff (26 Nov)
              </button>
              <button 
                className="btn-sketch"
                onClick={() => {
                  playClick();
                  onSelectDate('2026-12-15');
                }}
                style={{ fontSize: '0.8rem', justifyContent: 'flex-start' }}
              >
                🏛️ Theory End-Term Day 1 (15 Dec)
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
