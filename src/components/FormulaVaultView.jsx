import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  Plus, 
  Copy, 
  Check, 
  Trash2 
} from 'lucide-react';
import { playClick, playSuccessChime } from '../utils/audio';

export default function FormulaVaultView({ 
  preloadedFormulas, 
  customFormulas, 
  onAddCustomFormula, 
  onDeleteCustomFormula 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formSubject, setFormSubject] = useState('Engineering Mathematics');
  const [formTopic, setFormTopic] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formFormula, setFormFormula] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const allFormulas = [...preloadedFormulas, ...customFormulas];

  const filteredFormulas = allFormulas.filter(f => {
    if (selectedSubject !== 'ALL' && f.subject !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = f.title?.toLowerCase().includes(q);
      const matchFormula = f.formula?.toLowerCase().includes(q);
      const matchTopic = f.topic?.toLowerCase().includes(q);
      const matchNotes = f.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchFormula && !matchTopic && !matchNotes) return false;
    }
    return true;
  });

  const handleCopy = (id, text) => {
    playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateFormula = (e) => {
    e.preventDefault();
    playClick();
    const newFormula = {
      id: 'cust-f-' + Date.now(),
      subject: formSubject,
      topic: formTopic,
      title: formTitle,
      formula: formFormula,
      notes: formNotes,
      isCustom: true
    };
    onAddCustomFormula(newFormula);
    playSuccessChime();
    setShowAddModal(false);
    setFormTopic('');
    setFormTitle('');
    setFormFormula('');
    setFormNotes('');
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
              <span className="badge-sketch badge-sketch-yellow">HIGH-YIELD CHEAT SHEETS</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Pre-compiled Theorems & Equations</span>
            </div>
            <h1 className="font-title" style={{ fontSize: '1.9rem', margin: '6px 0 0' }}>
              ⚡ GATE CSE Formula & Theorem Vault
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              Instant recall sheets for Discrete Maths, Linear Algebra, OS Paging, Networks, and Algorithms.
            </p>
          </div>

          <button 
            className="btn-sketch btn-sketch-primary"
            onClick={() => { playClick(); setShowAddModal(true); }}
          >
            <Plus size={16} /> Add Custom Formula
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="sketch-card" style={{ padding: '14px 18px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px' }}>
          
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--ink-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input 
              type="text"
              className="input-sketch"
              placeholder="Search formula, theorem, topic (e.g. Euler, Paging, Dijkstra)..."
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
            <option value="ALL">All Subjects</option>
            <option value="Engineering Mathematics">Engineering Mathematics</option>
            <option value="Algorithms">Algorithms</option>
            <option value="Operating Systems">Operating Systems</option>
            <option value="Computer Networks">Computer Networks</option>
            <option value="Compiler Design">Compiler Design</option>
          </select>

        </div>
      </div>

      {/* Formulas Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px' }}>
        {filteredFormulas.map((item) => (
          <div 
            key={item.id}
            className="sketch-card"
            style={{ 
              padding: '20px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span className="badge-sketch badge-sketch-yellow">{item.subject}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>{item.topic}</span>
              </div>

              <h2 className="font-title" style={{ fontSize: '1.25rem', marginTop: '10px' }}>
                {item.title}
              </h2>

              {/* Sketched Formula Box */}
              <div style={{ 
                background: 'var(--paper-card-subtle)', 
                padding: '12px 14px', 
                border: '2px solid var(--ink-border)',
                borderRadius: 'var(--sketch-radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                color: 'var(--ink-primary)',
                whiteSpace: 'pre-wrap',
                marginTop: '12px',
                lineHeight: 1.5
              }}>
                {item.formula}
              </div>

              {item.notes && (
                <div style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)', marginTop: '10px', lineHeight: 1.5 }}>
                  💡 <strong>Key Insight:</strong> {item.notes}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px', paddingTop: '10px', borderTop: '1px dashed var(--ink-border)' }}>
              <button 
                className="btn-sketch"
                onClick={() => handleCopy(item.id, item.formula)}
                style={{ fontSize: '0.8rem', padding: '4px 10px' }}
              >
                {copiedId === item.id ? (
                  <>
                    <Check size={14} color="#15803D" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy Formula
                  </>
                )}
              </button>

              {item.isCustom && (
                <button 
                  onClick={() => onDeleteCustomFormula(item.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer', padding: '4px 8px' }}
                  title="Delete formula"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Formula Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-sketch" onClick={e => e.stopPropagation()} style={{ padding: '24px' }}>
            <h2 className="font-title" style={{ fontSize: '1.4rem', marginBottom: '16px' }}>
              Add Personal Formula / Theorem
            </h2>

            <form onSubmit={handleCreateFormula} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Subject</label>
                  <select 
                    className="input-sketch" 
                    value={formSubject} 
                    onChange={e => setFormSubject(e.target.value)}
                  >
                    <option value="Engineering Mathematics">Engineering Mathematics</option>
                    <option value="C Programming">C Programming</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Algorithms">Algorithms</option>
                    <option value="Compiler Design">Compiler Design</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Computer Networks">Computer Networks</option>
                    <option value="General Aptitude">General Aptitude</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Topic</label>
                  <input 
                    type="text" 
                    className="input-sketch" 
                    placeholder="e.g. Graph Theory, Cache Memory" 
                    value={formTopic} 
                    onChange={e => setFormTopic(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Formula / Theorem Title</label>
                <input 
                  type="text" 
                  className="input-sketch" 
                  placeholder="e.g. Handshaking Lemma, EAT formula" 
                  value={formTitle} 
                  onChange={e => setFormTitle(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Formula / Math Expression</label>
                <textarea 
                  className="input-sketch" 
                  rows={3}
                  placeholder="e.g. Sum of degrees = 2 * |E|" 
                  value={formFormula} 
                  onChange={e => setFormFormula(e.target.value)} 
                  required 
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Notes / Tricks / Conditions</label>
                <textarea 
                  className="input-sketch" 
                  rows={2}
                  placeholder="e.g. Holds for directed as well if in-degree + out-degree" 
                  value={formNotes} 
                  onChange={e => setFormNotes(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-sketch" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-sketch btn-sketch-primary">
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
