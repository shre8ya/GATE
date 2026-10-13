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
  Bot,
  User,
  MapPin
} from 'lucide-react';
import { calculateAiReschedulePlan, fetchGeminiRescheduleAdvice } from '../utils/rescheduler';
import { playClick, playSuccessChime } from '../utils/audio';

export default function RescheduleModal({ 
  currentDate, 
  masterSchedule, 
  dayStatus, 
  onApplyRescheduledSchedule, 
  onClose,
  userProfile = {}
}) {
  const [selectedDate, setSelectedDate] = useState(currentDate || '2026-10-13');
  const [selectedStrategy, setSelectedStrategy] = useState('SUNDAY_BUFFER');
  const [geminiAdvice, setGeminiAdvice] = useState(null);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);

  const planResult = calculateAiReschedulePlan({
    missedDate: selectedDate,
    masterSchedule,
    dayStatus,
    strategy: selectedStrategy,
    userProfile
  });

  const handleFetchAiAdvice = async () => {
    playClick();
    setIsLoadingGemini(true);
    const advice = await fetchGeminiRescheduleAdvice({
      missedDate: selectedDate,
      missedTopic: planResult?.missedItem?.mainFocus || 'Missed lecture',
      userProfile
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
        
        {/* Header - Black Outline Icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '6px',
              border: '2px solid #000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--paper-card-subtle)'
            }}>
              <Bot size={22} color="#000" strokeWidth={2} />
            </div>
            <div>
              <h2 className="font-title" style={{ fontSize: '1.35rem', margin: 0, color: '#000' }}>
                Personalized AI Task Shifter & Catch-Up Planner
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-secondary)' }}>
                Targeting {userProfile?.targetRank || 'AIR < 100'} • {userProfile?.dailyGoalHours || 3.5}h daily limit • Zero exam conflicts
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
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
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
          <div className="sketch-card" style={{ padding: '12px 16px', marginBottom: '16px', background: 'var(--paper-card-subtle)', border: '1.5px solid var(--ink-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#000', textTransform: 'uppercase' }}>
              MISSED TASK DETAILS:
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '2px', color: '#000' }}>
              {planResult.missedItem.subject}: {planResult.missedItem.mainFocus}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--ink-secondary)', marginTop: '2px' }}>
              Maths: {planResult.missedItem.mathsLecture || 'None'} • Duration: {planResult.missedItem.totalHrs || 2.0} hrs
            </div>
          </div>
        )}

        {/* 3 AI Strategies Picker */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
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
                borderColor: selectedStrategy === 'SUNDAY_BUFFER' ? '#000' : 'var(--ink-border)',
                borderWidth: selectedStrategy === 'SUNDAY_BUFFER' ? '2px' : '1px'
              }}
            >
              <span className="badge-sketch" style={{ fontSize: '0.68rem', fontWeight: 800, border: '1px solid #000' }}>
                RECOMMENDED
              </span>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', marginTop: '4px' }}>Sunday Buffer</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--ink-secondary)', marginTop: '2px' }}>
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
                borderColor: selectedStrategy === 'MICRO_SPRINT' ? '#000' : 'var(--ink-border)',
                borderWidth: selectedStrategy === 'MICRO_SPRINT' ? '2px' : '1px'
              }}
            >
              <span className="badge-sketch" style={{ fontSize: '0.68rem', fontWeight: 800, border: '1px solid #000' }}>
                FAST RECOVERY
              </span>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', marginTop: '4px' }}>Micro-Sprint</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                Adds micro-minutes over 3 days. Catch up in 72h.
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
                borderColor: selectedStrategy === 'SMART_SHIFT' ? '#000' : 'var(--ink-border)',
                borderWidth: selectedStrategy === 'SMART_SHIFT' ? '2px' : '1px'
              }}
            >
              <span className="badge-sketch" style={{ fontSize: '0.68rem', fontWeight: 800, border: '1px solid #000' }}>
                CALENDAR SHIFT
              </span>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', marginTop: '4px' }}>Smart Shift</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                Slides schedule forward while protecting exam milestones.
              </div>
            </button>

          </div>
        </div>

        {/* EXACT TASK SHIFT MOVEMENT ROUTE (Shows where it has shifted the task!) */}
        {planResult?.shiftRouting && (
          <div className="sketch-card" style={{ 
            padding: '14px 16px', 
            marginBottom: '16px', 
            background: 'var(--paper-card)', 
            border: '2px solid #000',
            boxShadow: '3px 3px 0px #000'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="#000" strokeWidth={2.5} />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#000', letterSpacing: '0.03em' }}>
                  EXACT TASK SHIFT ROUTE:
                </span>
              </div>
              <span className="badge-sketch" style={{ fontSize: '0.7rem', border: '1px solid #000' }}>
                {planResult.impactSummary.strategyName}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '10px', alignItems: 'center' }}>
              {/* Origin */}
              <div style={{ 
                padding: '10px 12px', 
                background: 'var(--paper-card-subtle)', 
                border: '1px solid var(--ink-border)', 
                borderRadius: '6px' 
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--ink-muted)' }}>
                  ORIGIN (MISSED):
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', marginTop: '2px' }}>
                  {planResult.shiftRouting.origin.date} ({planResult.shiftRouting.origin.day})
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                  {planResult.shiftRouting.origin.subject} — {planResult.shiftRouting.origin.topic}
                </div>
              </div>

              {/* Arrow */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#000' }}>➔</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#000', letterSpacing: '0.05em' }}>SHIFTED TO</span>
              </div>

              {/* Destination */}
              <div style={{ 
                padding: '10px 12px', 
                background: 'var(--highlight-yellow, #FEF08A)', 
                border: '1.5px solid #000', 
                borderRadius: '6px' 
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#000' }}>
                  SHIFTED DESTINATION:
                </div>
                <div style={{ fontWeight: 900, fontSize: '0.92rem', marginTop: '2px', color: '#000' }}>
                  {planResult.shiftRouting.destination.date} ({planResult.shiftRouting.destination.day})
                </div>
                <div style={{ fontSize: '0.78rem', color: '#000', marginTop: '2px', fontWeight: 600 }}>
                  {planResult.shiftRouting.destination.details}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Rationale Box */}
        {planResult && (
          <div className="sketch-card" style={{ padding: '14px 16px', marginBottom: '16px', background: 'var(--paper-card-subtle)', border: '1px solid var(--ink-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Sparkles size={15} color="#000" strokeWidth={2} />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#000' }}>
                AI Reschedule Analysis:
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--ink-primary)', lineHeight: 1.45, margin: 0 }}>
              {planResult.explanation}
            </p>
          </div>
        )}

        {/* Personalized Gemini Live Advice */}
        <div style={{ marginBottom: '16px' }}>
          {!geminiAdvice ? (
            <button 
              type="button" 
              className="btn-sketch" 
              onClick={handleFetchAiAdvice}
              disabled={isLoadingGemini}
              style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Bot size={15} color="#000" strokeWidth={2} />
              <span>{isLoadingGemini ? "Asking Personalized AI..." : `Ask AI for ${userProfile?.name || 'Aspirant'} Catch-Up Rationale`}</span>
            </button>
          ) : (
            <div className="sketch-card" style={{ padding: '12px 14px', background: 'var(--paper-card)', border: '1.5px solid #000' }}>
              <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#000' }}>
                PERSONALIZED AI CATCH-UP RATIONALE ({userProfile?.name || 'Aspirant'}):
              </div>
              <div style={{ fontSize: '0.84rem', marginTop: '4px', whiteSpace: 'pre-line', color: 'var(--ink-primary)' }}>
                {geminiAdvice}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px dashed var(--ink-border)' }}>
          <button type="button" className="btn-sketch" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn-sketch btn-sketch-primary"
            onClick={handleApply}
            style={{ padding: '8px 18px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Check size={16} color="#000" strokeWidth={2} />
            <span>Apply Rescheduled Plan</span>
          </button>
        </div>

      </div>
    </div>
  );
}
