import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Calendar, 
  Check, 
  AlertTriangle, 
  Zap, 
  ArrowRight, 
  Clock, 
  Bot 
} from 'lucide-react';
import { calculateAiReschedulePlan, fetchGeminiRescheduleAdvice } from '../utils/rescheduler';
import { playClick, playSuccessChime } from '../utils/audio';

export default function RescheduleModal({ 
  currentDate, 
  masterSchedule, 
  dayStatus, 
  onApplyRescheduledSchedule, 
  onClose 
}) {
  const [selectedDate, setSelectedDate] = useState(currentDate || '2026-10-13');
  const [selectedStrategy, setSelectedStrategy] = useState('SUNDAY_BUFFER');
  const [geminiAdvice, setGeminiAdvice] = useState(null);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);

  const planResult = calculateAiReschedulePlan({
    missedDate: selectedDate,
    masterSchedule,
    dayStatus,
    strategy: selectedStrategy
  });

  const handleFetchAiAdvice = async () => {
    playClick();
    setIsLoadingGemini(true);
    const advice = await fetchGeminiRescheduleAdvice({
      missedDate: selectedDate,
      missedTopic: planResult?.missedItem?.mainFocus || 'Missed lecture'
    });
    setGeminiAdvice(advice || "Review the high-yield core sub-topics during your Sunday buffer session.");
    setIsLoadingGemini(false);
  };

  const handleApply = () => {
    if (!planResult) return;
    playClick();
    playSuccessChime();
    onApplyRescheduledSchedule(planResult.newSchedule);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sketch" onClick={e => e.stopPropagation()} style={{ padding: '26px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>🤖</span>
            <div>
              <h2 className="font-title" style={{ fontSize: '1.4rem', margin: 0 }}>
                AI Dynamic Catch-Up & Rescheduler
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
                Missed a topic or a study day? The AI reorganizes your schedule with zero exam conflicts.
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="btn-sketch"
            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
          >
            ✕
          </button>
        </div>

        {/* Missed Day Selection */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
            Select Which Day / Topic Was Missed:
          </label>
          <select 
            className="input-sketch"
            value={selectedDate}
            onChange={(e) => { playClick(); setSelectedDate(e.target.value); }}
          >
            {masterSchedule.map(item => (
              <option key={item.date} value={item.date}>
                {item.date} ({item.day}) — {item.subject}: {item.mainFocus}
              </option>
            ))}
          </select>
        </div>

        {/* Missed Details Card */}
        {planResult?.missedItem && (
          <div className="sketch-card" style={{ padding: '14px 18px', marginBottom: '18px', background: 'var(--highlight-pink)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9F1239' }}>MISSED TOPIC DETAILS:</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '2px', color: '#1E293B' }}>
              {planResult.missedItem.subject}: {planResult.missedItem.mainFocus}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '2px' }}>
              Maths: {planResult.missedItem.mathsLecture} • Duration: {planResult.missedItem.totalHrs} hrs
            </div>
          </div>
        )}

        {/* 3 AI Strategies Picker */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
            Choose AI Recovery Strategy:
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            
            {/* Strategy 1: Sunday Buffer */}
            <button
              type="button"
              onClick={() => { playClick(); setSelectedStrategy('SUNDAY_BUFFER'); }}
              className="btn-sketch"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                padding: '12px',
                background: selectedStrategy === 'SUNDAY_BUFFER' ? 'var(--highlight-yellow)' : 'var(--paper-card)',
                borderColor: 'var(--ink-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="badge-sketch badge-sketch-green" style={{ fontSize: '0.7rem' }}>RECOMMENDED</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '4px' }}>Sunday Buffer</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                Absorbs into upcoming Sunday without shifting weekdays.
              </div>
            </button>

            {/* Strategy 2: Micro Sprint */}
            <button
              type="button"
              onClick={() => { playClick(); setSelectedStrategy('MICRO_SPRINT'); }}
              className="btn-sketch"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                padding: '12px',
                background: selectedStrategy === 'MICRO_SPRINT' ? 'var(--highlight-yellow)' : 'var(--paper-card)',
                borderColor: 'var(--ink-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="badge-sketch badge-sketch-orange" style={{ fontSize: '0.7rem' }}>FAST RECOVERY</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '4px' }}>Micro-Sprint</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                Adds +25 min/day over next 3 days. Catch up in 72h.
              </div>
            </button>

            {/* Strategy 3: Smart Shift */}
            <button
              type="button"
              onClick={() => { playClick(); setSelectedStrategy('SMART_SHIFT'); }}
              className="btn-sketch"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                padding: '12px',
                background: selectedStrategy === 'SMART_SHIFT' ? 'var(--highlight-yellow)' : 'var(--paper-card)',
                borderColor: 'var(--ink-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="badge-sketch badge-sketch-blue" style={{ fontSize: '0.7rem' }}>CALENDAR SHIFT</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '4px' }}>Smart Shift</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                Slides schedule forward while protecting exam milestones.
              </div>
            </button>

          </div>
        </div>

        {/* AI Rationale Box */}
        {planResult && (
          <div className="sketch-card" style={{ padding: '16px 18px', marginBottom: '20px', background: 'var(--highlight-blue)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={16} color="#2563EB" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E40AF' }}>
                AI Reschedule Analysis:
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#1E293B', lineHeight: 1.5 }}>
              {planResult.explanation}
            </p>

            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              marginTop: '10px', 
              paddingTop: '8px', 
              borderTop: '1px dashed rgba(30, 64, 175, 0.3)',
              fontSize: '0.78rem',
              color: '#1E40AF',
              fontWeight: 600
            }}>
              <span>✓ Target Catch-Up Date: {planResult.impactSummary.recoveredByDate}</span>
              <span>•</span>
              <span>✓ Exam Milestone Protection: Active</span>
            </div>
          </div>
        )}

        {/* Gemini Live Advice */}
        <div style={{ marginBottom: '18px' }}>
          {!geminiAdvice ? (
            <button 
              type="button" 
              className="btn-sketch btn-sketch-blue" 
              onClick={handleFetchAiAdvice}
              disabled={isLoadingGemini}
              style={{ fontSize: '0.85rem' }}
            >
              <Bot size={16} />
              {isLoadingGemini ? "Asking Gemini Assistant..." : "⚡ Ask AI for Catch-Up Strategy Rationale"}
            </button>
          ) : (
            <div className="sketch-card" style={{ padding: '14px', background: '#F5F3FF', border: '2px solid #7C3AED' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#6D28D9' }}>AI CATCH-UP RATIONALE:</div>
              <div style={{ fontSize: '0.85rem', marginTop: '4px', whiteSpace: 'pre-line' }}>{geminiAdvice}</div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '2px solid var(--ink-border)' }}>
          <button type="button" className="btn-sketch" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn-sketch btn-sketch-primary"
            onClick={handleApply}
            style={{ padding: '10px 22px', fontSize: '1rem' }}
          >
            <Check size={18} /> Apply Rescheduled Plan
          </button>
        </div>

      </div>
    </div>
  );
}
