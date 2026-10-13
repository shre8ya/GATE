import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { playClick, playSuccessChime } from '../utils/audio';

export default function SyllabusMatrixView({ 
  officialSyllabus, 
  syllabusProgress, 
  onUpdateSyllabusProgress 
}) {
  const [activeTab, setActiveTab] = useState('cs');
  const [expandedSections, setExpandedSections] = useState({
    'Section 1: Engineering Mathematics': true,
    'Section 4: Programming and Data Structures': true,
    'Section 5: Algorithms': true
  });

  const toggleExpand = (title) => {
    playClick();
    setExpandedSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const sections = activeTab === 'cs' ? officialSyllabus.cs : officialSyllabus.ga;

  const handleToggleCheck = (topicKey, checkField) => {
    playClick();
    const curr = syllabusProgress[topicKey] || { watched: false, notes: false, pyqs: false, mastered: false };
    const updated = { ...curr, [checkField]: !curr[checkField] };
    if (checkField === 'mastered' && updated.mastered) {
      playSuccessChime();
    }
    onUpdateSyllabusProgress(topicKey, updated);
  };

  return (
    <div style={{ padding: '0 18px 40px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="sketch-card" style={{ padding: '24px', marginBottom: '22px' }}>
        <div className="tape-strip"></div>
        <div className="tape-strip tape-strip-right"></div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-sketch badge-sketch-blue">IIT MADRAS OFFICIAL</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Parsed from CS_GATE2027_Syllabus.pdf</span>
            </div>
            <h1 className="font-title" style={{ fontSize: '1.9rem', margin: '6px 0 0' }}>
              🗺️ GATE 2027 Official Syllabus Matrix
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              Track comprehensive coverage: Lectures → Short Notes → PYQ Mastery for every syllabus topic.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn-sketch ${activeTab === 'cs' ? 'btn-sketch-primary' : ''}`}
              onClick={() => { playClick(); setActiveTab('cs'); }}
            >
              💻 Computer Science (10 Sections)
            </button>
            <button
              className={`btn-sketch ${activeTab === 'ga' ? 'btn-sketch-primary' : ''}`}
              onClick={() => { playClick(); setActiveTab('ga'); }}
            >
              🧩 General Aptitude (4 Sections)
            </button>
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sections.map((sec, idx) => {
          const isExpanded = expandedSections[sec.title];
          const clauses = sec.content
            .split(/(?<=[.;:])\s+/)
            .filter(c => c.trim().length > 10);

          const totalChecks = clauses.length * 4;
          let checkedCount = 0;
          clauses.forEach((c, cIdx) => {
            const key = `${sec.title}-c${cIdx}`;
            const p = syllabusProgress[key] || {};
            if (p.watched) checkedCount++;
            if (p.notes) checkedCount++;
            if (p.pyqs) checkedCount++;
            if (p.mastered) checkedCount++;
          });
          const sectionPct = totalChecks > 0 ? Math.round((checkedCount / totalChecks) * 100) : 0;

          return (
            <div key={sec.title} className="sketch-card" style={{ overflow: 'hidden' }}>
              
              <div 
                onClick={() => toggleExpand(sec.title)}
                style={{ 
                  padding: '16px 22px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                  background: isExpanded ? 'var(--highlight-yellow)' : 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: 'var(--sketch-radius-sm)', 
                    background: 'var(--paper-card)',
                    border: '1.5px solid var(--ink-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}>
                    {idx + 1}
                  </div>
                  <div>
                    <h2 className="font-title" style={{ fontSize: '1.25rem', margin: 0 }}>
                      {sec.title}
                    </h2>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)' }}>
                      {clauses.length} Sub-areas defined
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>Covered</div>
                    <div className="font-title" style={{ fontSize: '1.05rem', color: sectionPct > 0 ? 'var(--ink-green)' : 'var(--ink-muted)' }}>
                      {sectionPct}%
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {isExpanded && (
                <div style={{ padding: '0 22px 20px', borderTop: '2px dashed var(--ink-border)' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'minmax(250px, 1fr) 90px 90px 90px 90px', 
                    gap: '10px', 
                    padding: '12px 0 8px',
                    fontSize: '0.8rem', 
                    fontWeight: 700, 
                    borderBottom: '2px solid var(--ink-border)'
                  }}>
                    <span>TOPIC / SYLLABUS DIRECTIVE</span>
                    <span style={{ textAlign: 'center' }}>LECTURE</span>
                    <span style={{ textAlign: 'center' }}>NOTES</span>
                    <span style={{ textAlign: 'center' }}>PYQS</span>
                    <span style={{ textAlign: 'center' }}>MASTERED</span>
                  </div>

                  {clauses.map((clause, cIdx) => {
                    const key = `${sec.title}-c${cIdx}`;
                    const prog = syllabusProgress[key] || { watched: false, notes: false, pyqs: false, mastered: false };

                    return (
                      <div 
                        key={cIdx}
                        style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'minmax(250px, 1fr) 90px 90px 90px 90px', 
                          gap: '10px', 
                          padding: '10px 0',
                          alignItems: 'center',
                          borderBottom: '1px dashed var(--ink-border)'
                        }}
                      >
                        <div style={{ fontSize: '0.95rem', lineHeight: 1.4 }}>
                          {clause}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => handleToggleCheck(key, 'watched')}
                            className="btn-sketch"
                            style={{ 
                              background: prog.watched ? 'var(--highlight-blue)' : 'var(--paper-card)',
                              padding: '2px 8px',
                              fontSize: '0.8rem'
                            }}
                          >
                            {prog.watched ? '✓ Done' : '○ Pending'}
                          </button>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => handleToggleCheck(key, 'notes')}
                            className="btn-sketch"
                            style={{ 
                              background: prog.notes ? 'var(--highlight-green)' : 'var(--paper-card)',
                              padding: '2px 8px',
                              fontSize: '0.8rem'
                            }}
                          >
                            {prog.notes ? '✓ Ready' : '○ Notes'}
                          </button>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => handleToggleCheck(key, 'pyqs')}
                            className="btn-sketch"
                            style={{ 
                              background: prog.pyqs ? 'var(--highlight-yellow)' : 'var(--paper-card)',
                              padding: '2px 8px',
                              fontSize: '0.8rem'
                            }}
                          >
                            {prog.pyqs ? '✓ Solved' : '○ Solved'}
                          </button>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => handleToggleCheck(key, 'mastered')}
                            className="btn-sketch"
                            style={{ 
                              background: prog.mastered ? 'var(--highlight-pink)' : 'var(--paper-card)',
                              padding: '2px 8px',
                              fontSize: '0.8rem',
                              fontWeight: 700
                            }}
                          >
                            {prog.mastered ? '★ Master' : '☆ Learn'}
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
