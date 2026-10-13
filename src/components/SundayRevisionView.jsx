import React, { useState } from 'react';
import { 
  Clock, 
  Award, 
  Play, 
  Plus, 
  Trash2, 
  Pause, 
  RotateCcw,
  BookOpen,
  FileText,
  ExternalLink,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { playClick, playSuccessChime, playBell } from '../utils/audio';
import { fireTaskConfetti, fireFullDayConfetti } from '../utils/confetti';

export default function SundayRevisionView({ 
  sundayRevisionData, 
  sundayStatus, 
  onUpdateSundayStatus,
  mockTests,
  onAddMockTest,
  onDeleteMockTest
}) {
  const [viewTab, setViewTab] = useState('protocols'); // 'protocols' | 'papers'
  const [testTimeLeft, setTestTimeLeft] = useState(90 * 60);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [activeSessionName, setActiveSessionName] = useState('Sunday Timed Mock Test');

  // Add Mock Test Score Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formTestName, setFormTestName] = useState('Sunday Mock Test');
  const [formScore, setFormScore] = useState('');
  const [formTotal, setFormTotal] = useState('50');
  const [formCorrect, setFormCorrect] = useState('');
  const [formWrong, setFormWrong] = useState('');
  const [formWeakTopic, setFormWeakTopic] = useState('');

  // Paper filter
  const [paperFilter, setPaperFilter] = useState('ALL'); // 'ALL' | 'GATE' | 'IPU'

  // Pre-loaded Official Question Papers Dataset
  const OFFICIAL_PAPERS = [
    {
      id: 'gate-2024-s1',
      title: 'GATE CSE 2024 (Set 1)',
      organizer: 'IISc Bangalore',
      type: 'GATE',
      totalMarks: 100,
      totalQuestions: 65,
      durationMin: 180,
      cutoff: '27.6 Marks',
      url: 'https://gateoverflow.in/previous-years',
      keyTopics: 'Discrete Maths, C & Pointers, Cache Memory, Paging, Graph Algorithms'
    },
    {
      id: 'gate-2024-s2',
      title: 'GATE CSE 2024 (Set 2)',
      organizer: 'IISc Bangalore',
      type: 'GATE',
      totalMarks: 100,
      totalQuestions: 65,
      durationMin: 180,
      cutoff: '27.6 Marks',
      url: 'https://gateoverflow.in/previous-years',
      keyTopics: 'TOC Decidability, Dijkstra, B-Trees, TCP Congestion Control'
    },
    {
      id: 'gate-2023',
      title: 'GATE CSE 2023',
      organizer: 'IIT Kanpur',
      type: 'GATE',
      totalMarks: 100,
      totalQuestions: 65,
      durationMin: 180,
      cutoff: '32.5 Marks',
      url: 'https://gateoverflow.in/previous-years',
      keyTopics: 'Linear Algebra, First Order Logic, Virtual Memory, Process Synchronization'
    },
    {
      id: 'gate-2022',
      title: 'GATE CSE 2022',
      organizer: 'IIT Kharagpur',
      type: 'GATE',
      totalMarks: 100,
      totalQuestions: 65,
      durationMin: 180,
      cutoff: '25.0 Marks',
      url: 'https://gateoverflow.in/previous-years',
      keyTopics: 'Probability Distributions, LL(1) Parsing, Pipeline Hazards, Subnetting'
    },
    {
      id: 'gate-2021-s1',
      title: 'GATE CSE 2021 (Set 1)',
      organizer: 'IIT Bombay',
      type: 'GATE',
      totalMarks: 100,
      totalQuestions: 65,
      durationMin: 180,
      cutoff: '26.1 Marks',
      url: 'https://gateoverflow.in/previous-years',
      keyTopics: 'Master Theorem, Counting & Permutations, Deadlocks, SQL & Normalization'
    },
    {
      id: 'gate-2020',
      title: 'GATE CSE 2020',
      organizer: 'IIT Delhi',
      type: 'GATE',
      totalMarks: 100,
      totalQuestions: 65,
      durationMin: 180,
      cutoff: '28.5 Marks',
      url: 'https://gateoverflow.in/previous-years',
      keyTopics: 'Regular Expressions, Turing Machines, Flow Control Sliding Window'
    },
    {
      id: 'ipu-daa-2024',
      title: 'IPU 5th Sem DAA (Algorithms) End-Term Paper',
      organizer: 'GGSIPU (CIC-311)',
      type: 'IPU',
      totalMarks: 75,
      totalQuestions: 8,
      durationMin: 180,
      cutoff: '40% Pass',
      url: 'https://www.google.com/search?q=IPU+DAA+CIC-311+previous+year+question+paper',
      keyTopics: 'Dynamic Programming (0/1 Knapsack, LCS), Greedy MST, Backtracking N-Queens, NP-Completeness'
    },
    {
      id: 'ipu-cd-2024',
      title: 'IPU 5th Sem Compiler Design End-Term Paper',
      organizer: 'GGSIPU (CIC-303)',
      type: 'IPU',
      totalMarks: 75,
      totalQuestions: 8,
      durationMin: 180,
      cutoff: '40% Pass',
      url: 'https://www.google.com/search?q=IPU+Compiler+Design+CIC-303+previous+year+question+paper',
      keyTopics: 'Lexical Analysis, FIRST & FOLLOW Computation, Shift-Reduce Conflicts, 3-Address Code'
    },
    {
      id: 'ipu-os-2024',
      title: 'IPU 5th Sem Operating Systems End-Term Paper',
      organizer: 'GGSIPU (CIC-305)',
      type: 'IPU',
      totalMarks: 75,
      totalQuestions: 8,
      durationMin: 180,
      cutoff: '40% Pass',
      url: 'https://www.google.com/search?q=IPU+Operating+Systems+CIC-305+previous+year+question+paper',
      keyTopics: 'Semaphores & Dining Philosophers, Banker Algorithm, Page Replacement FIFO/LRU/Optimal'
    },
    {
      id: 'ipu-cn-2024',
      title: 'IPU 5th Sem Computer Networks End-Term Paper',
      organizer: 'GGSIPU (CIC-307)',
      type: 'IPU',
      totalMarks: 75,
      totalQuestions: 8,
      durationMin: 180,
      cutoff: '40% Pass',
      url: 'https://www.google.com/search?q=IPU+Computer+Networks+CIC-307+previous+year+question+paper',
      keyTopics: 'OSI vs TCP/IP Models, Hamming Distance, Go-Back-N vs Selective Repeat, Distance Vector Routing'
    }
  ];

  React.useEffect(() => {
    let timer = null;
    if (isTestRunning && testTimeLeft > 0) {
      timer = setInterval(() => setTestTimeLeft(prev => prev - 1), 1000);
    } else if (isTestRunning && testTimeLeft === 0) {
      setIsTestRunning(false);
      playBell();
      fireFullDayConfetti();
      alert("⏱️ Timed Test Finished! Take a short break, then review your error log.");
    }
    return () => clearInterval(timer);
  }, [isTestRunning, testTimeLeft]);

  const formatTimer = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleSunday = (e, id) => {
    const curr = sundayStatus[id] || { status: 'Not Started' };
    const nextStatus = curr.status === 'Done' ? 'Not Started' : 'Done';
    
    if (nextStatus === 'Done') {
      fireTaskConfetti(e);
    } else {
      playClick();
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
    fireFullDayConfetti();
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

  const filteredPapers = OFFICIAL_PAPERS.filter(p => {
    if (paperFilter === 'GATE') return p.type === 'GATE';
    if (paperFilter === 'IPU') return p.type === 'IPU';
    return true;
  });

  return (
    <div style={{ padding: '0 18px 40px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Top Banner */}
      <div className="sketch-card" style={{ padding: '24px', marginBottom: '22px' }}>
        <div className="tape-strip"></div>
        <div className="tape-strip tape-strip-right"></div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-sketch badge-sketch-pink">WEEKLY CONSOLIDATION & QUESTION PAPERS VAULT</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Protocol: 30m Notes → 90m Timed Test → 60m Error Redo</span>
            </div>
            <h1 className="font-title" style={{ fontSize: '1.9rem', margin: '6px 0 0' }}>
              📝 Sunday Revision & Official Question Papers Hub
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              Practice full-length previous year GATE question papers and IPU End-Term exams with integrated clock timers.
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

        {/* Section Navigation Tabs: Protocols vs Question Papers */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
          <button 
            className={`btn-sketch ${viewTab === 'protocols' ? 'btn-sketch-primary' : ''}`}
            onClick={() => setViewTab('protocols')}
          >
            📋 Weekly Sunday Revision Schedule
          </button>
          <button 
            className={`btn-sketch ${viewTab === 'papers' ? 'btn-sketch-primary' : ''}`}
            onClick={() => setViewTab('papers')}
          >
            📜 Official GATE & IPU Question Papers ({OFFICIAL_PAPERS.length})
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: '22px' }}>
        
        {/* Left Column: Protocols OR Question Papers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {viewTab === 'protocols' ? (
            <>
              <h2 className="font-title" style={{ fontSize: '1.35rem', margin: 0 }}>
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
                          onClick={(e) => handleToggleSunday(e, sun.id)}
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
            </>
          ) : (
            /* Question Papers Vault List */
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <h2 className="font-title" style={{ fontSize: '1.35rem', margin: 0 }}>
                  📜 Previous Year & University Question Papers
                </h2>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button 
                    className={`btn-sketch ${paperFilter === 'ALL' ? 'btn-sketch-primary' : ''}`}
                    onClick={() => setPaperFilter('ALL')}
                    style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                  >
                    All Papers
                  </button>
                  <button 
                    className={`btn-sketch ${paperFilter === 'GATE' ? 'btn-sketch-primary' : ''}`}
                    onClick={() => setPaperFilter('GATE')}
                    style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                  >
                    GATE Papers
                  </button>
                  <button 
                    className={`btn-sketch ${paperFilter === 'IPU' ? 'btn-sketch-primary' : ''}`}
                    onClick={() => setPaperFilter('IPU')}
                    style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                  >
                    IPU University
                  </button>
                </div>
              </div>

              {filteredPapers.map(paper => (
                <div key={paper.id} className="sketch-card" style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className={`badge-sketch ${paper.type === 'GATE' ? 'badge-sketch-yellow' : 'badge-sketch-pink'}`}>
                          {paper.type === 'GATE' ? 'Official GATE Paper' : 'IPU End-Term Exam'}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)', fontWeight: 600 }}>
                          {paper.organizer}
                        </span>
                        <span className="badge-sketch" style={{ background: 'var(--paper-card-subtle)' }}>
                          {paper.totalQuestions} Questions • {paper.totalMarks} Marks
                        </span>
                      </div>

                      <h3 className="font-title" style={{ fontSize: '1.25rem', marginTop: '6px', marginBottom: '4px' }}>
                        {paper.title}
                      </h3>

                      <div style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>
                        🎯 <strong>High-Weightage Topics:</strong> {paper.keyTopics}
                      </div>

                      {paper.cutoff && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--ink-green)', marginTop: '4px', fontWeight: 600 }}>
                          📊 Benchmark Cutoff: {paper.cutoff}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <a 
                        href={paper.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn-sketch"
                        style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                      >
                        <ExternalLink size={14} /> Open Paper ↗
                      </a>
                      <button 
                        className="btn-sketch btn-sketch-primary"
                        onClick={() => {
                          playClick();
                          setActiveSessionName(paper.title);
                          setTestTimeLeft(paper.durationMin * 60);
                          setIsTestRunning(true);
                        }}
                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      >
                        <Play size={14} fill="currentColor" /> Sim Clock ({paper.durationMin}m)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

        </div>

        {/* Right Column: Timed Test Simulator & Mock Scorecard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="sketch-card" style={{ padding: '24px', textAlign: 'center' }}>
            <div className="tape-strip"></div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Clock size={20} />
              <h2 className="font-title" style={{ fontSize: '1.3rem', margin: 0 }}>Test Simulator Clock</h2>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)', marginTop: '4px' }}>
              {activeSessionName}
            </div>

            {/* Giant Handwriting Digital Timer */}
            <div className="font-title" style={{ 
              fontSize: '3.6rem', 
              letterSpacing: '3px', 
              color: testTimeLeft < 300 ? '#DC2626' : 'var(--ink-primary)',
              margin: '14px 0' 
            }}>
              {formatTimer(testTimeLeft)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {!isTestRunning ? (
                <button 
                  className="btn-sketch btn-sketch-primary" 
                  onClick={() => { playClick(); setIsTestRunning(true); }}
                >
                  <Play size={16} fill="currentColor" /> Start Test
                </button>
              ) : (
                <button 
                  className="btn-sketch" 
                  onClick={() => { playClick(); setIsTestRunning(false); }}
                >
                  <Pause size={16} /> Pause
                </button>
              )}

              <button 
                className="btn-sketch" 
                onClick={() => {
                  playClick();
                  setIsTestRunning(false);
                  setTestTimeLeft(90 * 60);
                }}
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>

            <div style={{ 
              marginTop: '16px', 
              fontSize: '0.8rem', 
              color: 'var(--ink-muted)', 
              background: 'var(--paper-card-subtle)', 
              padding: '8px', 
              borderRadius: '6px' 
            }}>
              🔒 Close books, put phone on silent. Follow virtual GATE calculator rules only.
            </div>
          </div>

          {/* Mock Scorecard Log */}
          <div className="sketch-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={18} color="#D97706" />
                <h3 className="font-title" style={{ fontSize: '1.2rem', margin: 0 }}>Mock & Paper Scorecards</h3>
              </div>
              <button 
                className="btn-sketch btn-sketch-primary"
                onClick={() => { playClick(); setShowAddModal(true); }}
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              >
                <Plus size={14} /> Log Score
              </button>
            </div>

            {mockTests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ink-muted)', fontSize: '0.85rem' }}>
                No test scores recorded yet.<br/>
                Complete your first 90-min test or PYQ paper and log your results!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mockTests.map((t) => (
                  <div 
                    key={t.id} 
                    className="sketch-card" 
                    style={{ 
                      padding: '12px 14px', 
                      background: 'var(--paper-card-subtle)',
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.testName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                        {t.date} • Correct: {t.correctCount || '-'} • Wrong: {t.wrongCount || '-'}
                      </div>
                      {t.weakTopics && (
                        <div style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: '2px' }}>
                          ⚠️ Weak: {t.weakTopics}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div className="font-title" style={{ fontSize: '1.2rem', color: 'var(--ink-primary)' }}>
                          {t.score} / {t.totalMarks}
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: t.accuracy >= 75 ? 'var(--ink-green)' : '#D97706' }}>
                          {t.accuracy}% Accuracy
                        </div>
                      </div>

                      <button 
                        onClick={() => onDeleteMockTest(t.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer', padding: '4px' }}
                        title="Delete score"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Log Mock Score Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-sketch" onClick={e => e.stopPropagation()} style={{ padding: '24px' }}>
            <h2 className="font-title" style={{ fontSize: '1.4rem', marginBottom: '16px' }}>
              Log Test / Question Paper Score
            </h2>

            <form onSubmit={handleSaveMockScore} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Test / Paper Name</label>
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
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Score Obtained</label>
                  <input 
                    type="number" 
                    step="0.25"
                    className="input-sketch" 
                    placeholder="e.g. 38.67" 
                    value={formScore} 
                    onChange={e => setFormScore(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Total Marks</label>
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
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Correct Questions</label>
                  <input 
                    type="number" 
                    className="input-sketch" 
                    placeholder="e.g. 24" 
                    value={formCorrect} 
                    onChange={e => setFormCorrect(e.target.value)} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Wrong Questions</label>
                  <input 
                    type="number" 
                    className="input-sketch" 
                    placeholder="e.g. 6" 
                    value={formWrong} 
                    onChange={e => setFormWrong(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Identified Weak Topics (To add to Error Log)</label>
                <input 
                  type="text" 
                  className="input-sketch" 
                  placeholder="e.g. Cache associativity, Karnaugh maps" 
                  value={formWeakTopic} 
                  onChange={e => setFormWeakTopic(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-sketch" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-sketch btn-sketch-primary">
                  ✓ Save Scorecard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
