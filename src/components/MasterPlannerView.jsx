import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Search, 
  Clock, 
  ArrowUpRight,
  BookOpen,
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';
import { playClick, playSuccessChime } from '../utils/audio';

export default function MasterPlannerView({ 
  masterSchedule, 
  dayStatus, 
  onUpdateDayStatus, 
  onSelectDate,
  onOpenReschedule
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  const subjects = useMemo(() => {
    const set = new Set();
    masterSchedule.forEach(item => {
      if (item.subject) set.add(item.subject);
    });
    return Array.from(set);
  }, [masterSchedule]);

  const filteredSchedule = useMemo(() => {
    return masterSchedule.filter(item => {
      const statusObj = dayStatus[item.date] || { status: 'Not Started' };
      const currentStatus = statusObj.status;

      if (selectedSubject !== 'ALL' && item.subject !== selectedSubject) return false;
      if (selectedStatus === 'DONE' && currentStatus !== 'Done') return false;
      if (selectedStatus === 'PENDING' && currentStatus === 'Done') return false;
      if (selectedType !== 'ALL' && !item.type.toLowerCase().includes(selectedType.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSubject = item.subject?.toLowerCase().includes(q);
        const matchFocus = item.mainFocus?.toLowerCase().includes(q);
        const matchMaths = item.mathsLecture?.toLowerCase().includes(q);
        const matchDate = item.date?.toLowerCase().includes(q);
        if (!matchSubject && !matchFocus && !matchMaths && !matchDate) return false;
      }
      return true;
    });
  }, [masterSchedule, dayStatus, selectedSubject, selectedStatus, selectedType, searchQuery]);

  const totalDays = masterSchedule.length;
  const completedDays = masterSchedule.filter(item => (dayStatus[item.date]?.status === 'Done')).length;
  const progressPercent = Math.round((completedDays / totalDays) * 100);
  const totalHours = masterSchedule.reduce((acc, curr) => acc + (curr.totalHrs || 0), 0);
  const completedHours = masterSchedule.reduce((acc, curr) => {
    return dayStatus[curr.date]?.status === 'Done' ? acc + (curr.totalHrs || 0) : acc;
  }, 0);

  const toggleDayStatus = (date) => {
    playClick();
    const current = dayStatus[date] || { status: 'Not Started' };
    const nextStatus = current.status === 'Done' ? 'Not Started' : 'Done';
    const isDone = nextStatus === 'Done';

    if (isDone) {
      playSuccessChime();
      try { confetti({ particleCount: 50, spread: 60 }); } catch (e) {}
    }

    onUpdateDayStatus(date, {
      ...current,
      status: nextStatus,
      phase1: isDone,
      phase2: isDone,
      phase3: isDone,
      phase4: isDone
    });
  };

  return (
    <div style={{ padding: '0 18px 40px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Header Card */}
      <div className="sketch-card" style={{ padding: '24px', marginBottom: '22px' }}>
        <div className="tape-strip"></div>
        <div className="tape-strip tape-strip-right"></div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="font-title" style={{ fontSize: '1.9rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={22} color="#000" strokeWidth={2.2} /> Master 80-Day Calendar & Planner
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              Every day scheduled with minute allocations, daily Maths lectures, and core blocks.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn-sketch"
              onClick={onOpenReschedule}
              style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Sparkles size={15} color="#000" strokeWidth={2} /> AI Dynamic Reschedule
            </button>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>COMPLETED</div>
              <div className="font-title" style={{ fontSize: '1.35rem', color: 'var(--ink-green)' }}>
                {completedDays} / {totalDays} Days
              </div>
            </div>
            <div style={{ textAlign: 'right', borderLeft: '2px dashed var(--ink-border)', paddingLeft: '14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>STUDY HOURS</div>
              <div className="font-title" style={{ fontSize: '1.35rem', color: 'var(--ink-blue)' }}>
                {completedHours.toFixed(1)} / {totalHours.toFixed(1)}h
              </div>
            </div>
          </div>
        </div>

        {/* Sketched Progress Bar */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--ink-secondary)' }}>Overall Schedule Progress</span>
            <span style={{ fontWeight: 700 }}>{progressPercent}%</span>
          </div>
          <div style={{ height: '10px', background: 'var(--paper-card-subtle)', border: '2px solid var(--ink-border)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: `${progressPercent}%`, 
              background: 'var(--highlight-green)',
              transition: 'width 0.4s ease-out'
            }} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="sketch-card" style={{ padding: '14px 18px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--ink-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input 
              type="text"
              className="input-sketch"
              placeholder="Search topic, lecture, date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <select 
            className="input-sketch"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="ALL">All Subjects ({subjects.length})</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select 
            className="input-sketch"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending Only</option>
            <option value="DONE">Completed Only</option>
          </select>

          <select 
            className="input-sketch"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="ALL">All Day Types</option>
            <option value="learning">GATE Learning</option>
            <option value="sunday">Sunday Test</option>
            <option value="uni">University Exam / Revision</option>
            <option value="consolidation">Consolidation</option>
          </select>

        </div>
      </div>

      {/* Schedule Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredSchedule.map((item) => {
          const statusObj = dayStatus[item.date] || { status: 'Not Started' };
          const isDone = statusObj.status === 'Done';

          return (
            <div 
              key={item.id || item.date}
              className="sketch-card"
              style={{ 
                padding: '16px 20px', 
                background: isDone ? 'var(--highlight-green)' : 'var(--paper-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div 
                    className={`sketch-check ${isDone ? 'checked' : ''}`}
                    onClick={() => toggleDayStatus(item.date)}
                    style={{ marginTop: '2px' }}
                    title={isDone ? "Mark as Incomplete" : "Mark as Completed"}
                  >
                    {isDone && <span>✓</span>}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>
                        {item.date} ({item.day})
                      </span>
                      <span className="badge-sketch badge-sketch-yellow">{item.subject}</span>
                      <span className="badge-sketch badge-sketch-blue">{item.type}</span>
                      <span className="badge-sketch" style={{ background: 'var(--paper-card-subtle)' }}>
                        <Clock size={12} color="#000" /> {item.totalHrs}h
                      </span>
                      {item.shiftStatus?.type === 'shifted_out' && (
                        <span className="badge-sketch" style={{ background: '#FEF3C7', border: '1.5px solid #000', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <ArrowRight size={11} color="#000" strokeWidth={2.5} /> Shifted → {item.shiftStatus.targetDate} ({item.shiftStatus.targetDay || 'Target'})
                        </span>
                      )}
                      {item.shiftStatus?.type === 'shifted_in' && (
                        <span className="badge-sketch" style={{ background: '#D1FAE5', border: '1.5px solid #000', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Zap size={11} color="#000" strokeWidth={2.5} /> Catch-Up ← {item.shiftStatus.originDate}
                        </span>
                      )}
                    </div>

                    <h3 className="font-title" style={{ 
                      fontSize: '1.15rem', 
                      marginTop: '6px',
                      textDecoration: isDone ? 'line-through' : 'none',
                      color: isDone ? 'var(--ink-muted)' : 'var(--ink-primary)'
                    }}>
                      {item.mainFocus}
                    </h3>

                    {/* Explicit Task Shift Destination & Origin Card */}
                    {item.shiftStatus && (
                      <div style={{ 
                        margin: '8px 0', 
                        padding: '8px 12px', 
                        background: item.shiftStatus.type === 'shifted_out' ? '#FFFBEB' : '#ECFDF5', 
                        border: '1.5px solid #000', 
                        borderRadius: '4px',
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        {item.shiftStatus.type === 'shifted_out' ? (
                          <>
                            <ArrowRight size={14} color="#000" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                            <span>
                              <strong>TASK SHIFTED TO ANOTHER SLOT:</strong> <em>"{item.shiftStatus.movedTopic || item.mainFocus}"</em> was shifted to <strong>{item.shiftStatus.targetDate} ({item.shiftStatus.targetDay || 'Target'})</strong> via {item.shiftStatus.strategy || 'AI Shift'}.
                            </span>
                          </>
                        ) : (
                          <>
                            <Zap size={14} color="#000" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                            <span>
                              <strong>ABSORBED CATCH-UP WORKLOAD:</strong> Slot absorbed shifted task from <strong>{item.shiftStatus.originDate}</strong> ({item.shiftStatus.originSubject ? `${item.shiftStatus.originSubject}: ` : ''}<em>"{item.shiftStatus.originTopic}"</em>) via {item.shiftStatus.strategy || 'AI Catch-Up'}.
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {item.mathsLecture && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--ink-blue)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <BookOpen size={14} color="#000" />
                        <span>Maths: {item.mathsLecture}</span>
                      </div>
                    )}

                    <div style={{ 
                      display: 'flex', 
                      gap: '12px', 
                      fontSize: '0.8rem', 
                      color: 'var(--ink-secondary)', 
                      marginTop: '6px' 
                    }}>
                      <span>Warmup: {item.easyStartMin}m</span>
                      <span>•</span>
                      <span>Maths: {item.mathsMin}m</span>
                      <span>•</span>
                      <span>Core: {item.mainBlockMin}m</span>
                      <span>•</span>
                      <span>Practice: {item.practiceMin}m</span>
                    </div>

                    {item.note && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--ink-amber)', marginTop: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Zap size={13} color="#000" strokeWidth={2} />
                        <span>Note: {item.note}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ alignSelf: 'center' }}>
                  <button 
                    className="btn-sketch btn-sketch-primary"
                    onClick={() => onSelectDate(item.date)}
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  >
                    <ArrowUpRight size={14} /> Open Mission
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
