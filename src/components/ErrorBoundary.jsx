import React from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("GATE Matrix ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetStorage = () => {
    if (window.confirm("This will clear cached dashboard settings to restore clean defaults. Your core planner and syllabus will stay intact. Proceed?")) {
      try {
        // Clear GATE MATRIX keys
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('GATE_MATRIX_2027_') || k.startsWith('gate_'))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
      } catch (e) {
        console.error("Error clearing storage:", e);
      }
      window.location.href = window.location.pathname;
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'var(--paper-bg, #FAF6EE)',
          fontFamily: "'Architects Daughter', cursive, sans-serif"
        }}>
          <div className="sketch-card" style={{
            maxWidth: '620px',
            width: '100%',
            padding: '32px 28px',
            background: 'var(--paper-card, #FFFDF8)',
            border: '2.5px solid var(--ink-border, #1E293B)',
            boxShadow: '4px 4px 0px var(--ink-border, #1E293B)',
            borderRadius: '12px',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '2.4rem' }}>⚠️</span>
              <div>
                <h1 style={{
                  fontSize: '1.6rem',
                  margin: 0,
                  color: 'var(--ink-primary, #0F172A)',
                  fontWeight: 700
                }}>
                  Self-Healing Shield Activated
                </h1>
                <div style={{ fontSize: '0.9rem', color: 'var(--ink-secondary, #475569)' }}>
                  A cached browser state or network glitch paused the dashboard.
                </div>
              </div>
            </div>

            <div style={{
              padding: '12px 16px',
              background: 'var(--paper-card-subtle, #F1EAD8)',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.85rem',
              color: '#854D0E',
              border: '1px dashed #CA8A04'
            }}>
              <strong>Error Details:</strong> {this.state.error?.message || 'Unexpected state mismatch'}
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--ink-primary, #1E293B)', lineHeight: 1.5, marginBottom: '22px' }}>
              Your syllabus roadmap and notes are safe! Click below to perform a clean reload or reset corrupt cache:
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                style={{
                  background: 'var(--highlight-yellow, #FEF08A)',
                  border: '2px solid var(--ink-border, #1E293B)',
                  boxShadow: '2px 2px 0px var(--ink-border, #1E293B)',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={16} /> Hard Reload Page
              </button>

              <button
                onClick={this.handleResetStorage}
                style={{
                  background: 'var(--paper-card, #FFF)',
                  border: '2px solid var(--ink-border, #1E293B)',
                  boxShadow: '2px 2px 0px var(--ink-border, #1E293B)',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#9F1239'
                }}
              >
                <Trash2 size={16} /> Clear Cached State & Restore
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
