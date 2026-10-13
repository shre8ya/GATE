import React from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  BookOpen 
} from 'lucide-react';
import { playClick, playSuccessChime } from '../utils/audio';

export default function UniversitySyncView({ 
  universityExamsData, 
  uniStatus, 
  onUpdateUniStatus 
}) {
  const handleToggle = (id) => {
    playClick();
    const curr = uniStatus[id] || { status: 'Not Started' };
    const nextStatus = curr.status === 'Done' ? 'Not Started' : 'Done';
    
    if (nextStatus === 'Done') {
      playSuccessChime();
    }

    onUpdateUniStatus(id, { ...curr, status: nextStatus });
  };

  const completedCount = universityExamsData.filter(u => uniStatus[u.id]?.status === 'Done').length;

  return (
    <div style={{ padding: '0 18px 40px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="sketch-card" style={{ padding: '24px', marginBottom: '22px' }}>
        <div className="tape-strip"></div>
        <div className="tape-strip tape-strip-right"></div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-sketch badge-sketch-orange">IPU 5TH SEM END-TERMS</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Exam Slot: Evening 2:00 PM – 5:00 PM</span>
            </div>
            <h1 className="font-title" style={{ fontSize: '1.9rem', margin: '6px 0 0' }}>
              🏛️ University Exam & GATE Synergy Roadmap
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              Zero conflict schedule: Prepares you for IPU 5th Sem end-terms while simultaneously consolidating core GATE CSE subjects.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>PREP DAYS DONE</div>
            <div className="font-title" style={{ fontSize: '1.4rem', color: 'var(--ink-green)' }}>
              {completedCount} / {universityExamsData.length}
            </div>
          </div>
        </div>

        {/* Exam Dates Key Strip */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '10px', 
          marginTop: '18px', 
          paddingTop: '16px', 
          borderTop: '2px dashed var(--ink-border)' 
        }}>
          <div className="sketch-card" style={{ padding: '10px', background: 'var(--highlight-yellow)' }}>
            <div style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 700 }}>15 DEC (TUE)</div>
            <div className="font-title" style={{ fontSize: '1rem' }}>CIC-311 DAA</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)' }}>Algorithms Exam</div>
          </div>

          <div className="sketch-card" style={{ padding: '10px', background: 'var(--highlight-yellow)' }}>
            <div style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 700 }}>17 DEC (THU)</div>
            <div className="font-title" style={{ fontSize: '1rem' }}>CIC-303 CD</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)' }}>Compiler Design Exam</div>
          </div>

          <div className="sketch-card" style={{ padding: '10px', background: 'var(--highlight-yellow)' }}>
            <div style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 700 }}>19 DEC (SAT)</div>
            <div className="font-title" style={{ fontSize: '1rem' }}>CIC-305 OS</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)' }}>Operating Systems Exam</div>
          </div>

          <div className="sketch-card" style={{ padding: '10px', background: 'var(--highlight-yellow)' }}>
            <div style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 700 }}>22 DEC (TUE)</div>
            <div className="font-title" style={{ fontSize: '1rem' }}>CIC-307 CN</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)' }}>Computer Networks Exam</div>
          </div>

          <div className="sketch-card" style={{ padding: '10px', background: 'var(--highlight-yellow)' }}>
            <div style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 700 }}>24 & 28 DEC</div>
            <div className="font-title" style={{ fontSize: '1rem' }}>SE & Economics</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)' }}>Software Engg & Econ</div>
          </div>
        </div>
      </div>

      {/* Day by Day Plan List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {universityExamsData.map((item) => {
          const isDone = uniStatus[item.id]?.status === 'Done';
          const isExamDay = item.event?.includes('UNI EXAM');

          return (
            <div 
              key={item.id}
              className="sketch-card"
              style={{ 
                padding: '18px 22px',
                background: isExamDay 
                  ? 'var(--highlight-yellow)' 
                  : isDone 
                  ? 'var(--highlight-green)' 
                  : 'var(--paper-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div 
                    className={`sketch-check ${isDone ? 'checked' : ''}`}
                    onClick={() => handleToggle(item.id)}
                    style={{ marginTop: '2px' }}
                  >
                    {isDone && <span>✓</span>}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className={`badge-sketch ${isExamDay ? 'badge-sketch-orange' : 'badge-sketch-blue'}`}>
                        {item.event}
                      </span>
                      <span style={{ fontWeight: 700 }}>
                        {item.date} ({item.dayOfWeek})
                      </span>
                      <span className="badge-sketch badge-sketch-pink">{item.subject}</span>
                      <span className="badge-sketch" style={{ background: 'var(--paper-card-subtle)' }}>
                        <Clock size={12} /> {item.plannedHrs} hrs
                      </span>
                    </div>

                    <h3 className="font-title" style={{ 
                      fontSize: '1.2rem', 
                      marginTop: '8px',
                      textDecoration: isDone ? 'line-through' : 'none',
                      color: isDone ? 'var(--ink-muted)' : 'var(--ink-primary)'
                    }}>
                      {item.focus}
                    </h3>

                    <p style={{ fontSize: '0.9rem', color: 'var(--ink-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                      {item.detailedPlan}
                    </p>

                    {item.resources && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--ink-blue)', marginTop: '6px' }}>
                        📚 Recommended Materials: {item.resources}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ alignSelf: 'center' }}>
                  <span className={`badge-sketch ${isDone ? 'badge-sketch-green' : 'badge-sketch-pink'}`}>
                    {isDone ? '✓ Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
