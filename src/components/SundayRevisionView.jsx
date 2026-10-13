import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  Award, 
  Play, 
  Plus, 
  Trash2, 
  Pause, 
  RotateCcw 
} from 'lucide-react';
import { playClick, playSuccessChime, playBell } from '../utils/audio';

export default function SundayRevisionView({ 
  sundayRevisionData, 
  sundayStatus, 
  onUpdateSundayStatus,
  mockTests,
  onAddMockTest,
  onDeleteMockTest
}) {
  const [testTimeLeft, setTestTimeLeft] = useState(90 * 60);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [activeSessionName, setActiveSessionName] = useState('Sunday Timed Mock Test');

  const [showAddModal, setShowAddModal] = useState(false);
  const [formTestName, setFormTestName] = useState('Sunday Mock Test');
  const [formScore, setFormScore] = useState('');
  const [formTotal, setFormTotal] = useState('50');
  const [formCorrect, setFormCorrect] = useState('');
  const [formWrong, setFormWrong] = useState('');
  const [formWeakTopic, setFormWeakTopic] = useState('');

  React.useEffect(() => {
    let timer = null;
    if (isTestRunning && testTimeLeft > 0) {
      timer = setInterval(() => setTestTimeLeft(prev => prev - 1), 1000);
    } else if (isTestRunning && testTimeLeft === 0) {
      setIsTestRunning(false);
      playBell();
      alert("⏱️ 90-Minute Timed Test Complete! Now spend 60 minutes logging errors and re-solving.");
    }
    return () => clearInterval(timer);
  }, [isTestRunning, testTimeLeft]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleSunday = (id) => {
    playClick();
    const curr = sundayStatus[id] || { status: 'Not Started' };
    const nextStatus = curr.status === 'Done' ? 'Not Started' : 'Done';
    
    if (nextStatus === 'Done') {
      playSuccessChime();
      try { confetti({ particleCount: 50, spread: 60 }); } catch (e) {}
    }

    onUpdateSundayStatus(id, { ...curr, status: nextStatus });
  };

  const handleSaveMockScore = (e) => {
    e.preventDefault();
    playClick();
    const scoreVal = parseFloat(formScore) || 0;
    const totalVal = parseFloat(formTotal) || 50;
    const correctVal = parseInt(formCorrect) || 0;
    const wrongVal = parseInt(formWrong) || 0;
    const accuracyVal = (correctVal + wrongVal > 0) 
      ? Math.round((correctVal / (correctVal + wrongVal)) * 100) 
      : Math.round((scoreVal / totalVal) * 100);

    const newTest = {
      id: 'mock-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      testName: formTestName,
      score: scoreVal,
      totalMarks: totalVal,
      correctCount: correctVal,
      wrongCount: wrongVal,
      accuracy: accuracyVal,
      weakTopics: formWeakTopic
    };

    onAddMockTest(newTest);
    playSuccessChime();
    setShowAddModal(false);
    setFormScore('');
    setFormCorrect('');
    setFormWrong('');
    setFormWeakTopic('');
  };

  const completedCount = sundayRevisionData.filter(s => sundayStatus[s.id]?.status === 'Done').length;
  const avgMockScore = mockTests.length > 0 
    ? (mockTests.reduce((acc, curr) => acc + (curr.score / curr.totalMarks * 100), 0) / mockTests.length).toFixed(1)
    : 0;

  return (
    <div style={{ padding: '0 18px 40px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Top Banner */}
      <div className="sketch-card" style={{ padding: '24px', marginBottom: '22px' }}>
        <div className="tape-strip"></div>
        <div className="tape-strip tape-strip-right"></div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-sketch badge-sketch-pink">WEEKLY CONSOLIDATION</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Protocol: 30m Notes → 90m Timed Test → 60m Error Redo</span>
            </div>
            <h1 className="font-title" style={{ fontSize: '1.9rem', margin: '6px 0 0' }}>
              📝 Sunday Revision & Mock Test Center
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              25 core subject questions + 10 Engineering Maths PYQs (~3 min/question).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>REVISIONS DONE</div>
              <div className="font-title" style={{ fontSize: '1.4rem', color: 'var(--ink-green)' }}>
                {completedCount} / {sundayRevisionData.length}
              </div>
            </div>
            <div style={{ textAlign: 'right', borderLeft: '2px dashed var(--ink-border)', paddingLeft: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>AVG MOCK ACCURACY</div>
              <div className="font-title" style={{ fontSize: '1.4rem', color: 'var(--ink-blue)' }}>
                {avgMockScore}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sunday Schedule & Timed Test / Scorecard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: '22px' }}>
        
        {/* Left Column: Sunday Protocols */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 className="font-title" style={{ fontSize: '1.35rem' }}>
            Scheduled Sunday Revision Sessions
          </h2>

          {sundayRevisionData.map((sun, idx) => {
            const isDone = sundayStatus[sun.id]?.status === 'Done';

            return (
              <div 
                key={sun.id}
                className="sketch-card"
                style={{ 
                  padding: '18px 20px',
                  background: isDone ? 'var(--highlight-green)' : 'var(--paper-card)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div 
                      className={`sketch-check ${isDone ? 'checked' : ''}`}
                      onClick={() => handleToggleSunday(sun.id)}
                      style={{ marginTop: '2px' }}
                    >
                      {isDone && <span>✓</span>}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="badge-sketch badge-sketch-yellow">SUNDAY #{idx + 1}</span>
                        <span style={{ fontWeight: 700 }}>{sun.date}</span>
                        <span className="badge-sketch" style={{ background: 'var(--paper-card-subtle)' }}>
                          <Clock size={12} /> {sun.plannedHrs} hrs total
                        </span>
                      </div>

                      <div style={{ 
                        marginTop: '8px', 
                        fontSize: '0.95rem', 
                        fontWeight: 700, 
                        whiteSpace: 'pre-line',
                        lineHeight: 1.5,
                        color: isDone ? 'var(--ink-muted)' : 'var(--ink-primary)'
                      }}>
                        {sun.topicsToRevise}
                      </div>

                      {/* 3 Step Protocol Cards */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                        gap: '8px', 
                        marginTop: '12px',
                        fontSize: '0.85rem' 
                      }}>
                        <div className="sketch-card" style={{ background: 'var(--highlight-yellow)', padding: '8px 10px' }}>
                          <div style={{ fontWeight: 700 }}>1. Notes (30m)</div>
                          <div style={{ color: 'var(--ink-secondary)', marginTop: '2px' }}>{sun.task1Notes}</div>
                        </div>

                        <div className="sketch-card" style={{ background: 'var(--highlight-blue)', padding: '8px 10px' }}>
                          <div style={{ fontWeight: 700 }}>2. Timed Test (90m)</div>
                          <div style={{ color: 'var(--ink-secondary)', marginTop: '2px' }}>{sun.task2TimedTest}</div>
                        </div>

                        <div className="sketch-card" style={{ background: 'var(--highlight-pink)', padding: '8px 10px' }}>
                          <div style={{ fontWeight: 700 }}>3. Error Redo (60m)</div>
                          <div style={{ color: 'var(--ink-secondary)', marginTop: '2px' }}>{sun.task3ErrorLog}</div>
                        </div>
                      </div>

                    </div>
                  </div>

                  <button 
                    className="btn-sketch btn-sketch-primary"
                    onClick={() => {
                      playClick();
                      setActiveSessionName(`Sunday #${idx + 1} Timed Test`);
                      setTestTimeLeft(90 * 60);
                      setIsTestRunning(true);
                    }}
                    style={{ fontSize: '0.8rem', padding: '6px 12px', flexShrink: 0 }}
                  >
                    <Play size={14} fill="currentColor" /> Launch 90m Test
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Timed Test Simulator & Mock Scorecard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="sketch-card" style={{ padding: '24px', textAlign: 'center' }}>
            <div className="tape-strip"></div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Clock size={20} />
              <h2 className="font-title" style={{ fontSize: '1.3rem', margin: 0 }}>90-Min Exam Clock</h2>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)', marginTop: '4px' }}>
              {activeSessionName} (35 Qs Total)
            </div>

            <div style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '3.6rem', 
              fontWeight: 700, 
              letterSpacing: '2px', 
              margin: '12px 0 16px',
              color: isTestRunning ? 'var(--ink-blue)' : 'var(--ink-primary)'
            }}>
              {formatTimer(testTimeLeft)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {!isTestRunning ? (
                <button 
                  className="btn-sketch btn-sketch-primary" 
                  onClick={() => { playClick(); setIsTestRunning(true); }}
                >
                  <Play size={18} fill="currentColor" /> Start Test
                </button>
              ) : (
                <button 
                  className="btn-sketch btn-sketch-pink" 
                  onClick={() => { playClick(); setIsTestRunning(false); }}
                >
                  <Pause size={18} /> Pause
                </button>
              )}
              <button 
                className="btn-sketch" 
                onClick={() => { playClick(); setIsTestRunning(false); setTestTimeLeft(90 * 60); }}
              >
                <RotateCcw size={18} /> Reset
              </button>
            </div>
          </div>

          {/* Mock Score History Card */}
          <div className="sketch-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 className="font-title" style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} /> Mock Test Scorecard
              </h3>
              <button 
                className="btn-sketch btn-sketch-green" 
                onClick={() => setShowAddModal(true)}
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                <Plus size={14} /> Log Score
              </button>
            </div>

            {mockTests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--ink-muted)', fontSize: '0.9rem' }}>
                No mock test scores logged yet. Complete a Sunday test and record your score!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mockTests.map((t) => (
                  <div 
                    key={t.id}
                    className="sketch-card"
                    style={{ 
                      padding: '12px 14px', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--paper-card-subtle)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.testName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)' }}>
                        {t.date} • Correct: {t.correctCount} | Wrong: {t.wrongCount}
                      </div>
                      {t.weakTopics && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--ink-red)', marginTop: '2px' }}>
                          Weak: {t.weakTopics}
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div>
                        <div className="font-title" style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--ink-green)' }}>
                          {t.score} / {t.totalMarks}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--ink-blue)', fontWeight: 600 }}>
                          {t.accuracy}% Acc
                        </div>
                      </div>
                      <button 
                        onClick={() => onDeleteMockTest(t.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer' }}
                        title="Delete log"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Log Mock Test Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-sketch" onClick={e => e.stopPropagation()} style={{ padding: '24px' }}>
            <h2 className="font-title" style={{ fontSize: '1.4rem', marginBottom: '16px' }}>
              Log Test / Mock Performance
            </h2>

            <form onSubmit={handleSaveMockScore} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Test / Quiz Name</label>
                <input 
                  type="text" 
                  className="input-sketch" 
                  value={formTestName} 
                  onChange={e => setFormTestName(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Your Marks</label>
                  <input 
                    type="number" 
                    step="0.25"
                    className="input-sketch" 
                    placeholder="e.g. 38.5" 
                    value={formScore} 
                    onChange={e => setFormScore(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Total Marks</label>
                  <input 
                    type="number" 
                    className="input-sketch" 
                    value={formTotal} 
                    onChange={e => setFormTotal(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Correct Qs</label>
                  <input 
                    type="number" 
                    className="input-sketch" 
                    placeholder="e.g. 22" 
                    value={formCorrect} 
                    onChange={e => setFormCorrect(e.target.value)} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Wrong Qs (Negative Marks)</label>
                  <input 
                    type="number" 
                    className="input-sketch" 
                    placeholder="e.g. 5" 
                    value={formWrong} 
                    onChange={e => setFormWrong(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Weak Topics Noticed</label>
                <input 
                  type="text" 
                  className="input-sketch" 
                  placeholder="e.g. Pointer arithmetic, Master theorem case 2" 
                  value={formWeakTopic} 
                  onChange={e => setFormWeakTopic(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-sketch" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-sketch btn-sketch-primary">
                  Save Scorecard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
