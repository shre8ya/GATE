import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Check 
} from 'lucide-react';
import { playClick, playSuccessChime } from '../utils/audio';
import { fireTaskConfetti } from '../utils/confetti';

export default function ErrorLogView({ 
  errorLog, 
  onAddErrorItem, 
  onUpdateErrorItem, 
  onDeleteErrorItem 
}) {
  const [filterType, setFilterType] = useState('ALL');
  const [filterDueOnly, setFilterDueOnly] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formSubject, setFormSubject] = useState('C Programming');
  const [formTopic, setFormTopic] = useState('');
  const [formQuestionRef, setFormQuestionRef] = useState('');
  const [formCategory, setFormCategory] = useState('Conceptual');
  const [formWhyWrong, setFormWhyWrong] = useState('');
  const [formCorrectConcept, setFormCorrectConcept] = useState('');

  const todayStr = '2026-10-13';

  const categories = [
    { id: 'Conceptual', label: 'Conceptual Trap', color: 'badge-sketch-pink' },
    { id: 'Calculation', label: 'Calculation / Silly', color: 'badge-sketch-orange' },
    { id: 'Misread', label: 'Misread Question', color: 'badge-sketch-blue' },
    { id: 'Formula', label: 'Formula Forgotten', color: 'badge-sketch-yellow' },
    { id: 'TimePressure', label: 'Time Pressure', color: 'badge-sketch' },
  ];

  const intervals = [1, 3, 7, 21, 60];

  const handleCreateError = (e) => {
    e.preventDefault();
    playClick();

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);

    const newItem = {
      id: 'err-' + Date.now(),
      dateAdded: todayStr,
      subject: formSubject,
      topic: formTopic,
      questionRef: formQuestionRef,
      category: formCategory,
      whyWrong: formWhyWrong,
      correctConcept: formCorrectConcept,
      intervalStep: 0,
      nextReviewDate: nextDate.toISOString().split('T')[0],
      resolved: false
    };

    onAddErrorItem(newItem);
    playSuccessChime();
    setShowAddModal(false);
    setFormTopic('');
    setFormQuestionRef('');
    setFormWhyWrong('');
    setFormCorrectConcept('');
  };

  const handleAdvanceReview = (item) => {
    playClick();
    const nextStep = item.intervalStep + 1;
    if (nextStep >= intervals.length) {
      fireTaskConfetti();
      onUpdateErrorItem(item.id, {
        ...item,
        intervalStep: nextStep,
        resolved: true
      });
    } else {
      const daysToAdd = intervals[nextStep];
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + daysToAdd);
      
      onUpdateErrorItem(item.id, {
        ...item,
        intervalStep: nextStep,
        nextReviewDate: nextDate.toISOString().split('T')[0]
      });
    }
  };

  const filteredErrors = errorLog.filter(item => {
    if (filterType !== 'ALL' && item.category !== filterType) return false;
    if (filterDueOnly && item.resolved) return false;
    return true;
  });

  const dueCount = errorLog.filter(item => !item.resolved && item.nextReviewDate <= todayStr).length;

  return (
    <div style={{ padding: '0 18px 40px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="sketch-card" style={{ padding: '24px', marginBottom: '22px' }}>
        <div className="tape-strip"></div>
        <div className="tape-strip tape-strip-right"></div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-sketch badge-sketch-pink">ACTIVE RECALL ENGINE</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Spaced Intervals: 1d → 3d → 7d → 21d → 60d</span>
            </div>
            <h1 className="font-title" style={{ fontSize: '1.9rem', margin: '6px 0 0' }}>
              🎯 GATE Error Log & Mistake Notebook
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              Never repeat a mistake twice. Every error is systematically reviewed until permanent mastery.
            </p>
          </div>

          <button 
            className="btn-sketch btn-sketch-primary"
            onClick={() => { playClick(); setShowAddModal(true); }}
          >
            <Plus size={16} /> Log New Mistake
          </button>
        </div>

        {/* Status Strip */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginTop: '16px', 
          paddingTop: '14px', 
          borderTop: '2px dashed var(--ink-border)',
          flexWrap: 'wrap'
        }}>
          <div className="badge-sketch badge-sketch-pink" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
            <span>⚡ Due for Active Recall Today: <strong>{dueCount}</strong></span>
          </div>
          <div className="badge-sketch badge-sketch-blue" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
            <span>Total Errors Logged: <strong>{errorLog.length}</strong></span>
          </div>
          <div className="badge-sketch badge-sketch-green" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
            <span>Mastered Concepts: <strong>{errorLog.filter(e => e.resolved).length}</strong></span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sketch-card" style={{ padding: '10px 14px', marginBottom: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          className={`btn-sketch ${filterType === 'ALL' ? 'btn-sketch-primary' : ''}`}
          onClick={() => setFilterType('ALL')}
          style={{ fontSize: '0.85rem', padding: '6px 12px' }}
        >
          All Mistakes ({errorLog.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`btn-sketch ${filterType === cat.id ? 'btn-sketch-primary' : ''}`}
            onClick={() => setFilterType(cat.id)}
            style={{ fontSize: '0.85rem', padding: '6px 12px' }}
          >
            {cat.label} ({errorLog.filter(e => e.category === cat.id).length})
          </button>
        ))}
      </div>

      {/* Error Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredErrors.length === 0 ? (
          <div className="sketch-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--ink-muted)' }}>
            No errors match the current filter. Log mistakes whenever you miss a PYQ or practice question!
          </div>
        ) : (
          filteredErrors.map((err) => {
            const isDue = !err.resolved && err.nextReviewDate <= todayStr;
            const catObj = categories.find(c => c.id === err.category) || categories[0];

            return (
              <div 
                key={err.id}
                className="sketch-card"
                style={{ 
                  padding: '18px 22px',
                  background: isDue ? 'var(--highlight-pink)' : err.resolved ? 'var(--highlight-green)' : 'var(--paper-card)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className={`badge-sketch ${catObj.color}`}>{catObj.label}</span>
                      <span className="badge-sketch badge-sketch-yellow">{err.subject}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                        {err.questionRef || 'Practice Q'}
                      </span>
                      {err.resolved ? (
                        <span className="badge-sketch badge-sketch-green">✓ Mastered</span>
                      ) : isDue ? (
                        <span className="badge-sketch badge-sketch-pink">⚡ Review Due Today</span>
                      ) : (
                        <span className="badge-sketch" style={{ background: 'var(--paper-card-subtle)' }}>
                          Next review: {err.nextReviewDate}
                        </span>
                      )}
                    </div>

                    <h3 className="font-title" style={{ fontSize: '1.2rem', marginTop: '8px' }}>
                      {err.topic}
                    </h3>

                    <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="sketch-card" style={{ background: 'var(--paper-card)', padding: '10px 12px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#DC2626' }}>❌ WHY I GOT IT WRONG:</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--ink-primary)', marginTop: '4px', lineHeight: 1.5 }}>
                          {err.whyWrong}
                        </div>
                      </div>

                      <div className="sketch-card" style={{ background: 'var(--paper-card)', padding: '10px 12px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16A34A' }}>💡 CORRECT CONCEPT / TRICK:</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--ink-primary)', marginTop: '4px', lineHeight: 1.5 }}>
                          {err.correctConcept}
                        </div>
                      </div>
                    </div>

                    {/* Progress Dots */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>Spaced Recall Stage:</span>
                      {intervals.map((intv, idx) => (
                        <span 
                          key={idx}
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            border: '1.5px solid var(--ink-border)',
                            background: idx < err.intervalStep ? 'var(--ink-green)' : idx === err.intervalStep ? 'var(--highlight-yellow)' : 'transparent'
                          }}
                          title={`Review #${idx + 1} (${intv}d interval)`}
                        />
                      ))}
                    </div>

                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'center' }}>
                    {!err.resolved && (
                      <button 
                        className="btn-sketch btn-sketch-green"
                        onClick={() => handleAdvanceReview(err)}
                        style={{ fontSize: '0.85rem', padding: '6px 14px' }}
                      >
                        <Check size={16} /> Re-Solved Correctly
                      </button>
                    )}
                    <button 
                      onClick={() => onDeleteErrorItem(err.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer', padding: '6px' }}
                      title="Delete entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Mistake Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-sketch" onClick={e => e.stopPropagation()} style={{ padding: '24px' }}>
            <h2 className="font-title" style={{ fontSize: '1.4rem', marginBottom: '16px' }}>
              Log Mistake for Spaced Recall
            </h2>

            <form onSubmit={handleCreateError} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Subject</label>
                  <select 
                    className="input-sketch" 
                    value={formSubject} 
                    onChange={e => setFormSubject(e.target.value)}
                  >
                    <option value="C Programming">C Programming</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Algorithms (DAA)">Algorithms (DAA)</option>
                    <option value="Compiler Design">Compiler Design</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Computer Networks">Computer Networks</option>
                    <option value="Engineering Mathematics">Engineering Mathematics</option>
                    <option value="General Aptitude">General Aptitude</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Mistake Category</label>
                  <select 
                    className="input-sketch" 
                    value={formCategory} 
                    onChange={e => setFormCategory(e.target.value)}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Topic</label>
                <input 
                  type="text" 
                  className="input-sketch" 
                  placeholder="e.g. Master Theorem Case 3, Pointers with Arrays" 
                  value={formTopic} 
                  onChange={e => setFormTopic(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Question Reference</label>
                <input 
                  type="text" 
                  className="input-sketch" 
                  placeholder="e.g. GATE 2022 Q34, GO-PDF Test 2" 
                  value={formQuestionRef} 
                  onChange={e => setFormQuestionRef(e.target.value)} 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Why did you get it wrong? (Root Cause)</label>
                <textarea 
                  className="input-sketch" 
                  rows={2}
                  placeholder="e.g. Assumed quicksort was stable, forgot pointer decaying" 
                  value={formWhyWrong} 
                  onChange={e => setFormWhyWrong(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Correct Concept / Key Lesson</label>
                <textarea 
                  className="input-sketch" 
                  rows={2}
                  placeholder="e.g. Quicksort is unstable because partitioning can swap equal elements across the pivot" 
                  value={formCorrectConcept} 
                  onChange={e => setFormCorrectConcept(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-sketch" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-sketch btn-sketch-primary">
                  Save to Error Notebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
