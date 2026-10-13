import React, { useState } from 'react';
import { X, ExternalLink, FileEdit, Check, Sparkles, BookOpen, Clock } from 'lucide-react';
import { playClick, playSuccessChime } from '../utils/audio';

export default function VideoPlayerModal({ 
  isOpen, 
  onClose, 
  title, 
  subject, 
  sourceUrl, 
  searchUrl,
  currentDate,
  onSaveNoteToToday,
  onAddFormula
}) {
  if (!isOpen) return null;

  const [scratchNotes, setScratchNotes] = useState('');
  const [formulaName, setFormulaName] = useState('');
  const [formulaLatex, setFormulaLatex] = useState('');
  const [showFormulaForm, setShowFormulaForm] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  // Extract YouTube embed URL
  const getEmbedInfo = (url) => {
    if (!url) return null;

    // 1. YouTube Playlist: list=PL...
    const playlistMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    if (playlistMatch && playlistMatch[1]) {
      return {
        type: 'playlist',
        embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistMatch[1]}&rel=0&modestbranding=1`,
        playlistId: playlistMatch[1]
      };
    }

    // 2. Standard YouTube video: v=...
    const videoMatch = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    if (videoMatch && videoMatch[1]) {
      return {
        type: 'video',
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoMatch[1]}?rel=0&modestbranding=1`,
        videoId: videoMatch[1]
      };
    }

    return null;
  };

  const embedInfo = getEmbedInfo(sourceUrl);

  const handleSaveNotes = () => {
    if (!scratchNotes.trim()) return;
    playClick();
    if (onSaveNoteToToday) {
      onSaveNoteToToday(`[${subject}] ${title}: ${scratchNotes.trim()}`);
    }
    setSavedSuccessMsg('Notes saved to Today\'s Margin Notes!');
    setTimeout(() => setSavedSuccessMsg(''), 3000);
  };

  const handleSaveFormula = (e) => {
    e.preventDefault();
    if (!formulaName.trim() || !formulaLatex.trim()) return;
    playSuccessChime();
    if (onAddFormula) {
      onAddFormula({
        id: `form-${Date.now()}`,
        name: formulaName.trim(),
        subject: subject || 'GATE Core',
        topic: title || 'Key Formula',
        latex: formulaLatex.trim(),
        tags: ['Lecture Capture', subject],
        dateAdded: currentDate
      });
    }
    setFormulaName('');
    setFormulaLatex('');
    setShowFormulaForm(false);
    setSavedSuccessMsg('Formula captured to Vault!');
    setTimeout(() => setSavedSuccessMsg(''), 3000);
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
          maxWidth: '1040px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--paper-card)',
          padding: '24px',
          borderRadius: '12px',
          border: '2.5px solid var(--ink-border)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          position: 'relative',
          overflowY: 'auto'
        }}
      >
        <div className="tape-strip"></div>
        <div className="tape-strip tape-strip-right"></div>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge-sketch badge-sketch-green">DISTRACTION-FREE LECTURE DESK</span>
              <span className="badge-sketch badge-sketch-yellow">{subject}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>No YouTube feeds or shorts</span>
            </div>
            <h2 className="font-title" style={{ fontSize: '1.45rem', margin: '6px 0 0' }}>
              {title}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-sketch"
                style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                title="Open directly on YouTube in external tab"
              >
                <ExternalLink size={14} /> Open External
              </a>
            )}
            <button
              className="btn-sketch"
              onClick={() => { playClick(); onClose(); }}
              style={{ padding: '6px 10px', fontSize: '0.85rem' }}
              title="Close Player"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Saved Success Notification */}
        {savedSuccessMsg && (
          <div style={{
            background: 'var(--highlight-green)',
            border: '1.5px solid #166534',
            borderRadius: '6px',
            padding: '8px 12px',
            marginBottom: '12px',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={16} /> {savedSuccessMsg}
          </div>
        )}

        {/* Main Workspace: 16:9 Video Player + Lecture Notes Split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '18px', flex: 1, minHeight: '400px' }}>
          
          {/* Left Column: Embed Player */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {embedInfo ? (
              <div style={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', // 16:9 aspect ratio
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#0F172A',
                border: '2px solid var(--ink-border)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <iframe
                  src={embedInfo.embedUrl}
                  title={title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div style={{
                height: '320px',
                background: 'var(--paper-card-subtle)',
                borderRadius: '8px',
                border: '2px dashed var(--ink-border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center'
              }}>
                <BookOpen size={36} color="var(--ink-secondary)" style={{ marginBottom: '12px' }} />
                <h3 className="font-title" style={{ fontSize: '1.2rem', margin: '0 0 6px' }}>
                  Playlist Search Ready
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-secondary)', maxWidth: '420px', margin: '0 0 16px' }}>
                  This topic references custom lecture playlists or curated YouTube collections. Launch it directly in focused mode:
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {sourceUrl && (
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-sketch btn-sketch-primary"
                      style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                    >
                      <ExternalLink size={16} /> Open Course Playlist
                    </a>
                  )}
                  {searchUrl && (
                    <a
                      href={searchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-sketch"
                      style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                    >
                      🔎 Search Specific Topic
                    </a>
                  )}
                </div>
              </div>
            )}

            <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginTop: '8px', textAlign: 'center' }}>
              🛡️ Privacy-enhanced mode active. Recommendations, social feeds, and comments are blocked to preserve focus.
            </div>
          </div>

          {/* Right Column: In-Lecture Scratchpad & Formula Capture */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Real-time Lecture Notes */}
            <div className="sketch-card" style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="font-title" style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileEdit size={15} /> Lecture Notes & Traps
                </span>
                <button
                  className="btn-sketch btn-sketch-primary"
                  onClick={handleSaveNotes}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  <Check size={14} /> Save to Day
                </button>
              </div>

              <textarea
                className="input-sketch"
                rows={5}
                value={scratchNotes}
                onChange={(e) => setScratchNotes(e.target.value)}
                placeholder="Jot down formulas, tricky definitions, edge cases, or GATE question traps while listening..."
                style={{ flex: 1, resize: 'none', fontSize: '0.85rem' }}
              />
            </div>

            {/* Quick 1-Click Formula Capture */}
            <div className="sketch-card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="font-title" style={{ fontSize: '0.92rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={15} color="var(--ink-blue)" /> Quick Formula Vault Capture
                </span>
                <button
                  className="btn-sketch"
                  onClick={() => setShowFormulaForm(!showFormulaForm)}
                  style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                >
                  {showFormulaForm ? 'Cancel' : '+ Add Formula'}
                </button>
              </div>

              {showFormulaForm && (
                <form onSubmit={handleSaveFormula} style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    className="input-sketch"
                    placeholder="Formula Name (e.g. Bayes Theorem, Page Table Size)"
                    value={formulaName}
                    onChange={(e) => setFormulaName(e.target.value)}
                    style={{ fontSize: '0.82rem', padding: '6px 8px' }}
                    required
                  />
                  <input
                    type="text"
                    className="input-sketch"
                    placeholder="LaTeX / Formula (e.g. P(A|B) = [P(B|A)P(A)] / P(B))"
                    value={formulaLatex}
                    onChange={(e) => setFormulaLatex(e.target.value)}
                    style={{ fontSize: '0.82rem', padding: '6px 8px', fontFamily: 'var(--font-mono)' }}
                    required
                  />
                  <button
                    type="submit"
                    className="btn-sketch btn-sketch-primary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', alignSelf: 'flex-start' }}
                  >
                    Save to Formula Vault
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
