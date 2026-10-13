import React, { useState } from 'react';
import { AlertTriangle, Zap, CheckCircle, FileText, Sparkles } from 'lucide-react';
import ErrorLogView from './ErrorLogView';
import FormulaVaultView from './FormulaVaultView';
import SundayRevisionView from './SundayRevisionView';
import { playClick } from '../utils/audio';

export default function VaultWorkspace({
  errorLog,
  onAddErrorItem,
  onUpdateErrorItem,
  onDeleteErrorItem,
  formulaData,
  customFormulas,
  onAddCustomFormula,
  onDeleteCustomFormula,
  sundayRevisionData,
  sundayStatus,
  onUpdateSundayStatus,
  mockTests,
  onAddMockTest,
  onDeleteMockTest
}) {
  const [activeSubTab, setActiveSubTab] = useState('errorlog'); // 'errorlog' | 'formulas' | 'papers'

  const subTabs = [
    { 
      id: 'errorlog', 
      label: 'Error & Mistake Log (Spaced Review)', 
      icon: AlertTriangle, 
      count: errorLog.filter(e => !e.resolved).length,
      badge: 'High Impact'
    },
    { 
      id: 'formulas', 
      label: 'Formula Vault & Photo Scans', 
      icon: Zap,
      count: (formulaData?.length || 0) + (customFormulas?.length || 0)
    },
    { 
      id: 'papers', 
      label: 'Question Papers Hub & Mocks', 
      icon: CheckCircle,
      badge: '180m Simulator'
    }
  ];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 18px 40px' }}>
      
      {/* Workspace Header & Sub-Navigation */}
      <div className="sketch-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div className="tape-strip"></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-sketch badge-sketch-pink">REVISION & DIAGNOSTICS</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>
                Your Weakness Eraser Suite
              </span>
            </div>
            <h1 className="font-title" style={{ fontSize: '1.75rem', margin: '4px 0 0' }}>
              🛡️ Weapon Vault & Diagnostic Center
            </h1>
          </div>

          {/* Sub-tab pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {subTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className="btn-sketch"
                  onClick={() => { playClick(); setActiveSubTab(tab.id); }}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 700 : 500,
                    background: isActive ? 'var(--highlight-yellow)' : 'var(--paper-card)',
                    borderColor: isActive ? 'var(--ink-primary)' : 'var(--ink-border)',
                    boxShadow: isActive ? '2px 3px 0px var(--ink-border)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span style={{
                      fontSize: '0.72rem',
                      background: isActive ? 'var(--ink-primary)' : 'var(--paper-dark)',
                      color: isActive ? '#fff' : 'var(--ink-primary)',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      fontWeight: 700
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Sub-Tab View */}
      {activeSubTab === 'errorlog' && (
        <ErrorLogView 
          errorLog={errorLog}
          onAddErrorItem={onAddErrorItem}
          onUpdateErrorItem={onUpdateErrorItem}
          onDeleteErrorItem={onDeleteErrorItem}
        />
      )}

      {activeSubTab === 'formulas' && (
        <FormulaVaultView 
          formulaData={formulaData}
          customFormulas={customFormulas}
          onAddCustomFormula={onAddCustomFormula}
          onDeleteCustomFormula={onDeleteCustomFormula}
        />
      )}

      {activeSubTab === 'papers' && (
        <SundayRevisionView 
          sundayRevisionData={sundayRevisionData}
          sundayStatus={sundayStatus}
          onUpdateSundayStatus={onUpdateSundayStatus}
          mockTests={mockTests}
          onAddMockTest={onAddMockTest}
          onDeleteMockTest={onDeleteMockTest}
        />
      )}

    </div>
  );
}
