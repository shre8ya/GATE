import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Camera, 
  Image as ImageIcon, 
  Download, 
  Maximize2, 
  X,
  Sparkles,
  BookOpen
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
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'PICTURE' | 'TEXT'
  const [copiedId, setCopiedId] = useState(null);
  
  // Add Formula Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState('text'); // 'text' | 'picture'
  const [formSubject, setFormSubject] = useState('Engineering Mathematics');
  const [formTopic, setFormTopic] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formFormula, setFormFormula] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formImage, setFormImage] = useState(null);
  const [imageFileName, setImageFileName] = useState('');

  // Image Lightbox State
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  const allFormulas = [...preloadedFormulas, ...customFormulas];

  const filteredFormulas = allFormulas.filter(f => {
    // Subject filter
    if (selectedSubject !== 'ALL' && f.subject !== selectedSubject) return false;
    
    // Type filter
    if (filterType === 'PICTURE' && !f.imageUrl) return false;
    if (filterType === 'TEXT' && f.imageUrl) return false;

    // Search query
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

  // Image File Upload with Canvas Compression
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress to max 1000px width/height to keep storage tidy
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const scaleSize = MAX_WIDTH / Math.max(img.width, img.height);
        const targetWidth = scaleSize < 1 ? img.width * scaleSize : img.width;
        const targetHeight = scaleSize < 1 ? img.height * scaleSize : img.height;

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setFormImage(compressedDataUrl);
      };
      img.src = event.target?.result;
    };
    reader.readAsText ? reader.readAsDataURL(file) : null;
  };

  const handleCreateFormula = (e) => {
    e.preventDefault();
    playClick();
    const newFormula = {
      id: 'cust-f-' + Date.now(),
      subject: formSubject,
      topic: formTopic,
      title: formTitle,
      formula: formFormula || (formImage ? '[📸 Handwritten Photo Formula attached]' : ''),
      notes: formNotes,
      imageUrl: formImage || null,
      isCustom: true,
      createdAt: new Date().toISOString()
    };
    onAddCustomFormula(newFormula);
    playSuccessChime();
    setShowAddModal(false);
    
    // Reset form
    setFormTopic('');
    setFormTitle('');
    setFormFormula('');
    setFormNotes('');
    setFormImage(null);
    setImageFileName('');
    setAddMode('text');
  };

  // Export formula database
  const handleExportFormulas = () => {
    playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allFormulas, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `GATE_Formula_Vault_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  const subjectsList = [
    'ALL',
    'Engineering Mathematics',
    'Algorithms',
    'Operating Systems',
    'Computer Networks',
    'Compiler Design',
    'C Programming',
    'Data Structures',
    'General Aptitude'
  ];

  return (
    <div style={{ padding: '0 18px 40px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="sketch-card" style={{ padding: '24px', marginBottom: '22px' }}>
        <div className="tape-strip"></div>
        <div className="tape-strip tape-strip-right"></div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-sketch badge-sketch-yellow">HIGH-YIELD CHEAT SHEETS & PHOTO VAULT</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>Pre-compiled & Handwritten Equations</span>
            </div>
            <h1 className="font-title" style={{ fontSize: '1.9rem', margin: '6px 0 0' }}>
              ⚡ GATE CSE Formula & Theorem Vault
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              Instant recall sheets for Discrete Maths, Algorithms, OS, Networks, plus direct camera photo uploads for your personal notes.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              className="btn-sketch"
              onClick={handleExportFormulas}
              title="Export all formulas as JSON file"
            >
              <Download size={15} /> Export Vault
            </button>
            <button 
              className="btn-sketch btn-sketch-primary"
              onClick={() => { playClick(); setShowAddModal(true); }}
            >
              <Plus size={16} /> Add Formula (Text / Photo)
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="sketch-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        
        {/* Search & Subject Dropdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '12px', marginBottom: '14px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--ink-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input 
              type="text"
              className="input-sketch"
              placeholder="Search formula, theorem, topic (e.g. Euler, Paging, Dijkstra, Hamming)..."
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
            {subjectsList.map(s => (
              <option key={s} value={s}>{s === 'ALL' ? 'All Subjects' : s}</option>
            ))}
          </select>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className={`btn-sketch ${filterType === 'ALL' ? 'btn-sketch-primary' : ''}`}
              onClick={() => setFilterType('ALL')}
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              All Formulas ({allFormulas.length})
            </button>
            <button
              className={`btn-sketch ${filterType === 'PICTURE' ? 'btn-sketch-primary' : ''}`}
              onClick={() => setFilterType('PICTURE')}
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              📸 Photo Notes ({allFormulas.filter(f => f.imageUrl).length})
            </button>
            <button
              className={`btn-sketch ${filterType === 'TEXT' ? 'btn-sketch-primary' : ''}`}
              onClick={() => setFilterType('TEXT')}
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              📝 Text & Equations ({allFormulas.filter(f => !f.imageUrl).length})
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>
            Showing <strong>{filteredFormulas.length}</strong> formula sheets
          </div>
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

              {/* Photo Formula Display */}
              {item.imageUrl ? (
                <div style={{ marginTop: '12px' }}>
                  <div 
                    style={{ 
                      position: 'relative', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      border: '2px solid var(--ink-border)',
                      cursor: 'pointer',
                      maxHeight: '260px',
                      background: '#000'
                    }}
                    onClick={() => setActiveLightboxImg({ url: item.imageUrl, title: item.title, notes: item.notes })}
                    title="Click to view full image in high resolution"
                  >
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      style={{ width: '100%', height: 'auto', maxHeight: '260px', objectFit: 'contain', display: 'block' }}
                    />
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '8px', 
                      right: '8px', 
                      background: 'rgba(0,0,0,0.7)', 
                      color: '#FFF', 
                      padding: '3px 8px', 
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Maximize2 size={12} /> View Full Photo
                    </div>
                  </div>
                  {item.formula && item.formula !== '[📸 Handwritten Photo Formula attached]' && (
                    <div style={{ 
                      background: 'var(--paper-card-subtle)', 
                      padding: '8px 10px', 
                      marginTop: '8px',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem'
                    }}>
                      {item.formula}
                    </div>
                  )}
                </div>
              ) : (
                /* Sketched Text Formula Box */
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
              )}

              {item.notes && (
                <div style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)', marginTop: '10px', lineHeight: 1.5 }}>
                  💡 <strong>Key Insight:</strong> {item.notes}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px', paddingTop: '10px', borderTop: '1px dashed var(--ink-border)' }}>
              {item.formula && !item.imageUrl && (
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
              )}

              {item.imageUrl && (
                <button 
                  className="btn-sketch"
                  onClick={() => setActiveLightboxImg({ url: item.imageUrl, title: item.title, notes: item.notes })}
                  style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                >
                  <Maximize2 size={13} /> Open Image
                </button>
              )}

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

      {/* Add Custom Formula Modal (Text OR Picture) */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-sketch" onClick={e => e.stopPropagation()} style={{ padding: '26px', maxWidth: '640px' }}>
            <div className="tape-strip"></div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 className="font-title" style={{ fontSize: '1.4rem', margin: 0 }}>
                ⚡ Add Formula to Vault
              </h2>
              <button className="btn-sketch" onClick={() => setShowAddModal(false)} style={{ padding: '4px 8px' }}>
                ✕
              </button>
            </div>

            {/* Mode Tabs: Text vs Picture */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              <button 
                type="button"
                className={`btn-sketch ${addMode === 'text' ? 'btn-sketch-primary' : ''}`}
                onClick={() => setAddMode('text')}
                style={{ fontSize: '0.85rem' }}
              >
                ✏️ Type Text / LaTeX Formula
              </button>
              <button 
                type="button"
                className={`btn-sketch ${addMode === 'picture' ? 'btn-sketch-primary' : ''}`}
                onClick={() => setAddMode('picture')}
                style={{ fontSize: '0.85rem' }}
              >
                📸 Upload Handwritten Photo
              </button>
            </div>

            <form onSubmit={handleCreateFormula} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Subject:</label>
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
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Topic / Chapter:</label>
                  <input 
                    type="text" 
                    className="input-sketch" 
                    placeholder="e.g. Graph Theory, Cache Memory, Paging" 
                    value={formTopic} 
                    onChange={e => setFormTopic(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Formula / Theorem Title:</label>
                <input 
                  type="text" 
                  className="input-sketch" 
                  placeholder="e.g. Effective Memory Access Time (EMAT) with 2-Level Paging" 
                  value={formTitle} 
                  onChange={e => setFormTitle(e.target.value)} 
                  required 
                />
              </div>

              {/* Mode 1: Text Formula */}
              {addMode === 'text' && (
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Formula / Equation Expression:</label>
                  <textarea 
                    className="input-sketch" 
                    rows={3} 
                    placeholder="e.g. EMAT = h * (t_TLB + t_m) + (1 - h) * (t_TLB + 2*t_m)" 
                    value={formFormula} 
                    onChange={e => setFormFormula(e.target.value)} 
                    required={addMode === 'text'}
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                </div>
              )}

              {/* Mode 2: Picture Upload */}
              {addMode === 'picture' && (
                <div className="sketch-card" style={{ padding: '16px', background: 'var(--highlight-blue)', textAlign: 'center' }}>
                  <ImageIcon size={32} color="#1D4ED8" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Upload Photo of Notes or Textbook</div>
                  <div style={{ fontSize: '0.8rem', color: '#334155', marginBottom: '12px' }}>
                    Snap a picture from your phone or choose an image from your computer
                  </div>

                  <label className="btn-sketch btn-sketch-primary" style={{ cursor: 'pointer', display: 'inline-block' }}>
                    <Camera size={14} /> Choose Photo / Snapshot
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      style={{ display: 'none' }} 
                    />
                  </label>

                  {imageFileName && (
                    <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#1E40AF', fontWeight: 600 }}>
                      ✓ Selected: {imageFileName}
                    </div>
                  )}

                  {formImage && (
                    <div style={{ marginTop: '12px', border: '2px solid var(--ink-border)', borderRadius: '6px', overflow: 'hidden', maxHeight: '180px' }}>
                      <img src={formImage} alt="Preview" style={{ width: '100%', maxHeight: '180px', objectFit: 'contain' }} />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Key Insight / Memory Trick (Optional):</label>
                <textarea 
                  className="input-sketch" 
                  rows={2} 
                  placeholder="e.g. Watch out for whether page fault servicing includes CPU context switch overhead." 
                  value={formNotes} 
                  onChange={e => setFormNotes(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-sketch" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-sketch btn-sketch-primary">
                  ✓ Save to Formula Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* High-Res Image Lightbox Modal */}
      {activeLightboxImg && (
        <div 
          className="modal-overlay" 
          onClick={() => setActiveLightboxImg(null)}
          style={{ zIndex: 1000, background: 'rgba(0, 0, 0, 0.85)' }}
        >
          <div 
            onClick={e => e.stopPropagation()} 
            style={{ 
              maxWidth: '90vw', 
              maxHeight: '90vh', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <div style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              color: '#FFF', 
              marginBottom: '10px' 
            }}>
              <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>
                📸 {activeLightboxImg.title}
              </div>
              <button 
                onClick={() => setActiveLightboxImg(null)}
                style={{ 
                  background: '#FFF', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '32px', 
                  height: '32px', 
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            <img 
              src={activeLightboxImg.url} 
              alt={activeLightboxImg.title} 
              style={{ 
                maxWidth: '90vw', 
                maxHeight: '75vh', 
                borderRadius: '8px', 
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)', 
                objectFit: 'contain',
                background: '#FFF'
              }} 
            />

            {activeLightboxImg.notes && (
              <div style={{ 
                color: '#FFF', 
                marginTop: '12px', 
                textAlign: 'center', 
                background: 'rgba(0,0,0,0.6)', 
                padding: '8px 16px', 
                borderRadius: '6px',
                fontSize: '0.9rem' 
              }}>
                💡 {activeLightboxImg.notes}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
