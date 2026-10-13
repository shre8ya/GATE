import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  FileCode, 
  Check, 
  AlertTriangle, 
  Calendar, 
  Brain, 
  Zap, 
  X, 
  Table, 
  Copy, 
  CheckCheck,
  Sparkles,
  ArrowRight,
  Database
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { playClick, playSuccessChime } from '../utils/audio';
import { fireTaskConfetti } from '../utils/confetti';

export default function FileImportModal({
  isOpen,
  onClose,
  currentDate,
  onAppendNoteToToday,
  onAddFormulaItem,
  onAddErrorItem,
  onAddCalendarTask,
  onRestoreBackup
}) {
  if (!isOpen) return null;

  const [dragActive, setDragActive] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const fileInputRef = useRef(null);

  // Reset state on close
  const handleClose = () => {
    playClick();
    setFileData(null);
    setErrorMsg('');
    setSuccessMsg('');
    onClose();
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    playClick();

    const fileName = file.name;
    const extension = fileName.split('.').pop().toLowerCase();

    try {
      if (['xlsx', 'xls', 'csv', 'tsv'].includes(extension)) {
        // Parse Spreadsheet via SheetJS
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheets = workbook.SheetNames.map(sheetName => {
          const sheet = workbook.Sheets[sheetName];
          const jsonRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
          return {
            name: sheetName,
            rows: jsonRows,
            rowCount: jsonRows.length
          };
        });

        setFileData({
          type: 'spreadsheet',
          name: fileName,
          extension,
          sizeKb: Math.round(file.size / 1024),
          sheets,
          activeSheet: sheets[0] || null
        });
        playSuccessChime();
      } else if (['txt', 'md'].includes(extension)) {
        // Parse Text or Markdown
        const text = await file.text();
        setFileData({
          type: 'text',
          name: fileName,
          extension,
          sizeKb: Math.round(file.size / 1024),
          text,
          lines: text.split('\n').filter(l => l.trim().length > 0)
        });
        playSuccessChime();
      } else if (extension === 'json') {
        // Parse JSON
        const text = await file.text();
        let parsed = null;
        try {
          parsed = JSON.parse(text);
        } catch (e) {
          throw new Error('Invalid JSON format');
        }
        setFileData({
          type: 'json',
          name: fileName,
          extension,
          sizeKb: Math.round(file.size / 1024),
          rawJson: parsed,
          text: JSON.stringify(parsed, null, 2)
        });
        playSuccessChime();
      } else if (extension === 'pdf') {
        // Extract basic text stream or structure
        const arrayBuf = await file.arrayBuffer();
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const rawContent = decoder.decode(arrayBuf);
        // Simple plain text stream extraction from PDF stream chunks
        const textBlocks = rawContent.match(/\(([^()]{3,})\)[\s]*Tj/g) || [];
        let extracted = textBlocks.map(b => b.replace(/^\(|\)[\s]*Tj$/g, '').trim()).filter(Boolean).join(' ');
        
        if (!extracted || extracted.length < 20) {
          extracted = `[PDF Document: ${fileName} (${Math.round(file.size / 1024)} KB)]\nDocument imported successfully. You can attach references to today's study plan or formulas.`;
        }

        setFileData({
          type: 'pdf',
          name: fileName,
          extension,
          sizeKb: Math.round(file.size / 1024),
          text: extracted,
          lines: extracted.split('\n').filter(Boolean)
        });
        playSuccessChime();
      } else {
        throw new Error(`Unsupported file format (.${extension}). Please upload .xlsx, .csv, .pdf, .txt, .md, or .json.`);
      }
    } catch (err) {
      console.error('File parsing error:', err);
      setErrorMsg(err.message || 'Error parsing file. Please check format.');
    } finally {
      setLoading(false);
    }
  };

  // Actions for Spreadsheet
  const handleImportSheetAsCalendarTasks = () => {
    if (!fileData || !fileData.sheets) return;
    playClick();
    const sheet = fileData.sheets[activeSheetIndex] || fileData.sheets[0];
    if (!sheet || !sheet.rows || sheet.rows.length === 0) {
      setErrorMsg('No data rows found in selected sheet.');
      return;
    }

    let addedCount = 0;
    sheet.rows.forEach(row => {
      // Look for Date, Topic, Hours
      let targetDate = currentDate;
      let title = '';
      let hrs = 1;

      Object.entries(row).forEach(([col, val]) => {
        const valStr = String(val).trim();
        const colLower = col.toLowerCase();
        if (colLower.includes('date') && valStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          targetDate = valStr;
        } else if (colLower.includes('topic') || colLower.includes('task') || colLower.includes('focus') || colLower.includes('subject')) {
          if (valStr) title = title ? `${title} - ${valStr}` : valStr;
        } else if (colLower.includes('hour') || colLower.includes('hrs') || colLower.includes('duration')) {
          hrs = parseFloat(valStr) || 1;
        }
      });

      if (!title) {
        // Fallback: take first non-empty value
        const firstVal = Object.values(row).find(v => String(v).trim().length > 0);
        title = firstVal ? String(firstVal).trim() : 'Study Task';
      }

      if (onAddCalendarTask) {
        onAddCalendarTask(targetDate, {
          title: `[Imported] ${title}`,
          hours: hrs
        });
        addedCount++;
      }
    });

    fireTaskConfetti();
    setSuccessMsg(`✓ Successfully imported ${addedCount} tasks from sheet "${sheet.name}" into your Desk Calendar!`);
  };

  const handleImportSheetAsErrors = () => {
    if (!fileData || !fileData.sheets) return;
    playClick();
    const sheet = fileData.sheets[activeSheetIndex] || fileData.sheets[0];
    let addedCount = 0;

    sheet.rows.slice(0, 50).forEach(row => {
      let ref = '';
      let why = '';
      let fix = '';
      let cat = 'Conceptual';

      Object.entries(row).forEach(([col, val]) => {
        const valStr = String(val).trim();
        const colLower = col.toLowerCase();
        if (colLower.includes('question') || colLower.includes('ref') || colLower.includes('problem')) {
          ref = valStr;
        } else if (colLower.includes('why') || colLower.includes('flaw') || colLower.includes('error') || colLower.includes('mistake')) {
          why = valStr;
        } else if (colLower.includes('fix') || colLower.includes('correct') || colLower.includes('concept')) {
          fix = valStr;
        } else if (colLower.includes('category') || colLower.includes('type')) {
          cat = valStr;
        }
      });

      if (!ref) {
        const firstVal = Object.values(row)[0];
        ref = firstVal ? String(firstVal).trim() : 'Imported Practice Problem';
      }
      if (!why) why = 'Review question formulation and calculations';

      if (onAddErrorItem) {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        onAddErrorItem({
          id: 'err-imp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          dateAdded: currentDate,
          subject: 'Imported PYQs',
          topic: ref,
          questionRef: ref,
          category: cat || 'Conceptual',
          whyWrong: why,
          correctConcept: fix || 'Re-solve thoroughly without peek.',
          intervalStep: 0,
          nextReviewDate: d.toISOString().split('T')[0],
          resolved: false
        });
        addedCount++;
      }
    });

    fireTaskConfetti();
    setSuccessMsg(`✓ Successfully added ${addedCount} questions into your Weapon Vault (Error Log)!`);
  };

  const handleAppendToTodayNotes = () => {
    playClick();
    let noteContent = '';
    if (fileData.type === 'spreadsheet') {
      const sheet = fileData.sheets[activeSheetIndex];
      noteContent = `[Imported Sheet: ${sheet.name} (${sheet.rowCount} rows)]\n` + 
        sheet.rows.slice(0, 10).map(r => Object.values(r).filter(Boolean).join(' | ')).join('\n');
    } else if (fileData.text) {
      noteContent = `[Imported File: ${fileData.name}]\n` + fileData.text.slice(0, 800);
    }

    if (noteContent && onAppendNoteToToday) {
      onAppendNoteToToday(noteContent);
      fireTaskConfetti();
      setSuccessMsg(`✓ Appended file contents into Today's (${currentDate}) Margin Notes!`);
    }
  };

  const handleImportTextAsFormulas = () => {
    if (!fileData || !fileData.text) return;
    playClick();
    const lines = fileData.text.split('\n').map(l => l.trim()).filter(l => l.length > 5);
    let addedCount = 0;

    lines.slice(0, 20).forEach(line => {
      const parts = line.split(/[:=—\-]/);
      const name = parts[0]?.trim() || 'Imported Formula';
      const eq = parts.slice(1).join('=').trim() || line;

      if (onAddFormulaItem) {
        onAddFormulaItem({
          subject: 'Imported Formulas',
          name: name.slice(0, 60),
          formula: eq,
          latex: eq,
          notes: `Imported from ${fileData.name}`
        });
        addedCount++;
      }
    });

    fireTaskConfetti();
    setSuccessMsg(`✓ Successfully added ${addedCount} formula cards into Formula Vault!`);
  };

  const handleRestoreIfBackup = () => {
    if (!fileData || !fileData.rawJson) return;
    playClick();
    if (onRestoreBackup && fileData.rawJson.data) {
      const ok = onRestoreBackup(fileData.rawJson);
      if (ok) {
        fireTaskConfetti();
        setSuccessMsg('✓ Dashboard backup restored successfully!');
        setTimeout(() => onClose(), 1500);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className="modal-sketch" 
        onClick={e => e.stopPropagation()} 
        style={{ padding: '26px', maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="tape-strip"></div>
        <div className="tape-strip tape-strip-right"></div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>📂</span>
            <div>
              <h2 className="font-title" style={{ fontSize: '1.45rem', margin: 0 }}>
                Universal File to Dashboard Studio
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>
                Import Excel (.xlsx/.xls), CSV, PDF, Markdown, Text, or Backup JSON into your study matrix
              </div>
            </div>
          </div>
          <button className="btn-sketch" onClick={handleClose} style={{ padding: '4px 8px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Drag & Drop Upload Zone */}
        {!fileData && (
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragActive ? 'var(--ink-blue)' : 'var(--ink-border)'}`,
              borderRadius: '8px',
              padding: '36px 20px',
              textAlign: 'center',
              background: dragActive ? 'var(--highlight-blue)' : 'var(--paper-card-subtle)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '16px'
            }}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".xlsx,.xls,.csv,.tsv,.pdf,.txt,.md,.json" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
            <div style={{ display: 'inline-flex', padding: '12px', background: 'var(--paper-card)', borderRadius: '50%', border: '1.5px solid var(--ink-border)', marginBottom: '10px' }}>
              <Upload size={28} color="var(--ink-primary)" />
            </div>
            <div className="font-title" style={{ fontSize: '1.15rem', fontWeight: 700, margin: '4px 0' }}>
              Drag & Drop your file here, or click to browse
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--ink-secondary)', maxWidth: '480px', margin: '0 auto' }}>
              Supports <strong>.xlsx / .xls</strong> (Excel planners, PYQ sheets), <strong>.csv</strong>, <strong>.pdf</strong> (Notes & formula guides), <strong>.txt / .md</strong>, and <strong>.json</strong>.
            </div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '24px 0', fontSize: '0.95rem', fontWeight: 700 }}>
            ⏳ Parsing and reading document...
          </div>
        )}

        {errorMsg && (
          <div style={{ 
            background: 'var(--highlight-pink)', 
            border: '1.5px solid #8B2635', 
            borderRadius: '6px', 
            padding: '10px 14px', 
            fontSize: '0.85rem', 
            color: '#8B2635', 
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={16} /> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ 
            background: 'var(--highlight-green)', 
            border: '1.5px solid var(--ink-green)', 
            borderRadius: '6px', 
            padding: '10px 14px', 
            fontSize: '0.85rem', 
            color: 'var(--ink-green)', 
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCheck size={16} /> {successMsg}
          </div>
        )}

        {/* File Analysis & Preview Screen */}
        {fileData && (
          <div>
            {/* File Header Bar */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              background: 'var(--paper-card)', 
              border: '1.5px solid var(--ink-border)', 
              borderRadius: '8px', 
              padding: '12px 16px', 
              marginBottom: '16px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {fileData.type === 'spreadsheet' ? <FileSpreadsheet size={22} color="var(--ink-green)" /> : <FileText size={22} color="var(--ink-blue)" />}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{fileData.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>
                    Type: {fileData.extension.toUpperCase()} • Size: {fileData.sizeKb} KB {fileData.sheets && `• ${fileData.sheets.length} Sheet(s)`}
                  </div>
                </div>
              </div>
              <button 
                className="btn-sketch"
                onClick={() => setFileData(null)}
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              >
                Choose Another File
              </button>
            </div>

            {/* SPREADSHEET PREVIEW & ACTIONS */}
            {fileData.type === 'spreadsheet' && (
              <div>
                {/* Sheet Tabs */}
                {fileData.sheets.length > 1 && (
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    {fileData.sheets.map((s, idx) => (
                      <button
                        key={idx}
                        className="btn-sketch"
                        onClick={() => setActiveSheetIndex(idx)}
                        style={{
                          fontSize: '0.78rem',
                          padding: '4px 10px',
                          background: activeSheetIndex === idx ? 'var(--highlight-yellow)' : 'var(--paper-card)'
                        }}
                      >
                        📄 {s.name} ({s.rowCount} rows)
                      </button>
                    ))}
                  </div>
                )}

                {/* Data Table Preview */}
                {fileData.sheets[activeSheetIndex] && (
                  <div style={{ 
                    maxHeight: '220px', 
                    overflow: 'auto', 
                    border: '1.5px solid var(--ink-border)', 
                    borderRadius: '6px', 
                    marginBottom: '16px',
                    background: 'var(--paper-card)'
                  }}>
                    {fileData.sheets[activeSheetIndex].rows.length > 0 ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: 'var(--paper-card-subtle)', borderBottom: '1.5px solid var(--ink-border)' }}>
                            {Object.keys(fileData.sheets[activeSheetIndex].rows[0]).map((h, i) => (
                              <th key={i} style={{ padding: '6px 10px', fontWeight: 700, borderRight: '1px solid var(--ink-border)' }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {fileData.sheets[activeSheetIndex].rows.slice(0, 15).map((row, rIdx) => (
                            <tr key={rIdx} style={{ borderBottom: '1px solid var(--paper-card-subtle)' }}>
                              {Object.values(row).map((val, cIdx) => (
                                <td key={cIdx} style={{ padding: '5px 10px', borderRight: '1px solid var(--paper-card-subtle)' }}>
                                  {String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ padding: '16px', textAlign: 'center', color: 'var(--ink-muted)' }}>
                        Sheet contains no data rows.
                      </div>
                    )}
                  </div>
                )}

                {/* One-Click Import Destination Buttons */}
                <div style={{ 
                  background: 'var(--paper-card-subtle)', 
                  border: '1.5px dashed var(--ink-border)', 
                  borderRadius: '8px', 
                  padding: '14px 16px',
                  marginBottom: '14px' 
                }}>
                  <div className="font-title" style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>
                    🎯 Select Import Destination into Dashboard:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <button 
                      className="btn-sketch btn-sketch-primary"
                      onClick={handleImportSheetAsCalendarTasks}
                      style={{ fontSize: '0.82rem', padding: '8px 12px', justifyContent: 'flex-start' }}
                    >
                      <Calendar size={16} /> Import into Desk Calendar
                    </button>
                    <button 
                      className="btn-sketch"
                      onClick={handleImportSheetAsErrors}
                      style={{ fontSize: '0.82rem', padding: '8px 12px', justifyContent: 'flex-start' }}
                    >
                      <AlertTriangle size={16} color="var(--ink-red)" /> Import into Error Log
                    </button>
                    <button 
                      className="btn-sketch"
                      onClick={handleAppendToTodayNotes}
                      style={{ fontSize: '0.82rem', padding: '8px 12px', justifyContent: 'flex-start' }}
                    >
                      <FileText size={16} /> Append to Today's Notes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TEXT / PDF / MARKDOWN PREVIEW & ACTIONS */}
            {(fileData.type === 'text' || fileData.type === 'pdf') && (
              <div>
                <div style={{ 
                  maxHeight: '220px', 
                  overflow: 'auto', 
                  border: '1.5px solid var(--ink-border)', 
                  borderRadius: '6px', 
                  padding: '12px', 
                  marginBottom: '16px',
                  background: 'var(--paper-card)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {fileData.text.slice(0, 2000)}
                  {fileData.text.length > 2000 && '\n... [Remaining content truncated in preview]'}
                </div>

                <div style={{ 
                  background: 'var(--paper-card-subtle)', 
                  border: '1.5px dashed var(--ink-border)', 
                  borderRadius: '8px', 
                  padding: '14px 16px',
                  marginBottom: '14px' 
                }}>
                  <div className="font-title" style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>
                    🎯 Select Import Destination into Dashboard:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <button 
                      className="btn-sketch btn-sketch-primary"
                      onClick={handleAppendToTodayNotes}
                      style={{ fontSize: '0.82rem', padding: '8px 12px', justifyContent: 'flex-start' }}
                    >
                      <FileText size={16} /> Append to Today's Margin Notes
                    </button>
                    <button 
                      className="btn-sketch"
                      onClick={handleImportTextAsFormulas}
                      style={{ fontSize: '0.82rem', padding: '8px 12px', justifyContent: 'flex-start' }}
                    >
                      <Zap size={16} color="var(--ink-amber)" /> Extract Formulas to Vault
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* JSON BACKUP DETECTED */}
            {fileData.type === 'json' && (
              <div>
                <div style={{ 
                  maxHeight: '160px', 
                  overflow: 'auto', 
                  border: '1.5px solid var(--ink-border)', 
                  borderRadius: '6px', 
                  padding: '10px', 
                  marginBottom: '14px',
                  background: 'var(--paper-card)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem'
                }}>
                  {fileData.text.slice(0, 1000)}
                </div>

                {fileData.rawJson?.data ? (
                  <div style={{ background: 'var(--highlight-yellow)', padding: '12px 14px', borderRadius: '6px', border: '1.5px solid var(--ink-border)', marginBottom: '14px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                      ✨ Valid GATE MATRIX Backup File Detected!
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-secondary)', marginBottom: '8px' }}>
                      Exported on {fileData.rawJson.exportedAt || 'Previous session'}. Contains complete study streaks, errors, and customized planners.
                    </div>
                    <button 
                      className="btn-sketch btn-sketch-primary"
                      onClick={handleRestoreIfBackup}
                      style={{ fontSize: '0.85rem', padding: '6px 14px' }}
                    >
                      <Database size={16} /> Restore Entire Dashboard
                    </button>
                  </div>
                ) : (
                  <button 
                    className="btn-sketch btn-sketch-primary"
                    onClick={handleAppendToTodayNotes}
                    style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                  >
                    <FileText size={16} /> Import JSON as Today's Notes
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '8px' }}>
          <button className="btn-sketch" onClick={handleClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
