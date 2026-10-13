import React, { useState } from 'react';
import { X, Brain, Check, Sparkles, ArrowRight, Target } from 'lucide-react';
import { playClick, playSuccessChime } from '../utils/audio';

export default function ActiveRecallModal({
  isOpen,
  onClose,
  phaseTitle,
  subject,
  onConfirmRecall
}) {
  if (!isOpen) return null;

  const [coreConcept, setCoreConcept] = useState('');
  const [attemptedCount, setAttemptedCount] = useState('');
  const [correctCount, setCorrectCount] = useState('');
  const [formulaNote, setFormulaNote] = useState('');

  const handleConfirm = (e) => {
    e.preventDefault();
    playSuccessChime();
    onConfirmRecall({
      coreConcept: coreConcept.trim(),
      attemptedCount: attemptedCount ? parseInt(attemptedCount, 10) : null,
      correctCount: correctCount ? parseInt(correctCount, 10) : null,
      formulaNote: formulaNote.trim()
    });
    onClose();
  };

  const handleSkip = () => {
    playClick();
    onConfirmRecall({
      coreConcept: '',
      skipped: true
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div 
        className="sketch-card"
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'var(--paper-card)',
          padding: '28px',
          borderRadius: '12px',
          border: '2.5px solid var(--ink-border)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          position: 'relative'
        }}
      >
        <div className="tape-strip"></div>
        <div className="tape-strip tape-strip-right"></div>

        <button
          onClick={() => { playClick(); onClose(); }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--ink-secondary)'
          }}
          title="Close"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge-sketch badge-sketch-pink">
            <Brain size={14} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} />
            ACTIVE RECALL GATEKEEPER
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)' }}>
            Anti-Passive Skimming
          </span>
        </div>

        <h2 className="font-title" style={{ fontSize: '1.45rem', margin: '4px 0 6px' }}>
          Verify Your Retention: {phaseTitle}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--ink-secondary)', margin: '0 0 16px', lineHeight: 1.4 }}>
          Before locking in your checkmark, retrieve what your brain actually retained. This 30-second friction converts short-term memory into permanent GATE rank.
        </p>

        <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
              🧠 What is the #1 core theorem, formula, or trap you learned?
            </label>
            <textarea
              className="input-sketch"
              rows={3}
              required
              value={coreConcept}
              onChange={(e) => setCoreConcept(e.target.value)}
              placeholder="e.g. Master Theorem does not apply when f(n) is not polynomially smaller/larger; Bayes denominator is total probability..."
              style={{ width: '100%', fontSize: '0.88rem' }}
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--ink-secondary)', marginBottom: '4px' }}>
                Questions Attempted (Optional):
              </label>
              <input
                type="number"
                min="0"
                className="input-sketch"
                placeholder="e.g. 10"
                value={attemptedCount}
                onChange={(e) => setAttemptedCount(e.target.value)}
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--ink-secondary)', marginBottom: '4px' }}>
                Correct on 1st Attempt:
              </label>
              <input
                type="number"
                min="0"
                className="input-sketch"
                placeholder="e.g. 7"
                value={correctCount}
                onChange={(e) => setCorrectCount(e.target.value)}
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '12px', borderTop: '1.5px dashed var(--ink-border)' }}>
            <button
              type="button"
              className="btn-sketch"
              onClick={handleSkip}
              style={{ padding: '8px 14px', fontSize: '0.82rem', color: 'var(--ink-muted)' }}
            >
              Skip (I'm in a rush)
            </button>

            <button
              type="submit"
              className="btn-sketch btn-sketch-primary"
              style={{ padding: '9px 20px', fontSize: '0.95rem', fontWeight: 700 }}
            >
              <Check size={16} /> Lock In & Check Off
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
