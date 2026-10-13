import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  ExternalLink, 
  Search, 
  Clock, 
  PlayCircle, 
  Layers,
  FileText
} from 'lucide-react';
import { playClick, playSuccessChime } from '../utils/audio';

export default function SubjectExplorerView({ 
  coreSubjects, 
  engineeringMaths, 
  generalAptitude, 
  playlistDirectory,
  subjectDayStatus,
  onUpdateSubjectDayStatus
}) {
  const [selectedSubjectKey, setSelectedSubjectKey] = useState('c_programming');

  const subjectList = [
    { key: 'c_programming', name: 'C Programming', icon: '💻', count: coreSubjects.c_programming?.days?.length || 5 },
    { key: 'data_structures', name: 'Data Structures', icon: '🌲', count: coreSubjects.data_structures?.days?.length || 9 },
    { key: 'algorithms', name: 'Algorithms (DAA)', icon: '⚡', count: coreSubjects.algorithms?.days?.length || 13 },
    { key: 'compiler_design', name: 'Compiler Design', icon: '⚙️', count: coreSubjects.compiler_design?.days?.length || 7 },
    { key: 'operating_systems', name: 'Operating Systems', icon: '🖥️', count: coreSubjects.operating_systems?.days?.length || 10 },
    { key: 'computer_networks', name: 'Computer Networks', icon: '🌐', count: coreSubjects.computer_networks?.days?.length || 8 },
    { key: 'engineering_maths', name: 'Engineering Maths', icon: '📐', count: engineeringMaths?.days?.length || 52 },
    { key: 'general_aptitude', name: 'General Aptitude', icon: '🧩', count: generalAptitude?.days?.length || 52 },
  ];

  let currentSubject = null;
  let isMaths = false;
  let isAptitude = false;

  if (selectedSubjectKey === 'engineering_maths') {
    currentSubject = engineeringMaths;
    isMaths = true;
  } else if (selectedSubjectKey === 'general_aptitude') {
    currentSubject = generalAptitude;
    isAptitude = true;
  } else {
    currentSubject = coreSubjects[selectedSubjectKey] || coreSubjects.c_programming;
  }

  const daysList = currentSubject?.days || [];
  const completedCount = daysList.filter(d => subjectDayStatus[d.id]?.status === 'Done').length;
  const progressPercent = daysList.length > 0 ? Math.round((completedCount / daysList.length) * 100) : 0;

  const handleToggleDay = (id) => {
    playClick();
    const curr = subjectDayStatus[id] || { status: 'Not Started' };
    const nextStatus = curr.status === 'Done' ? 'Not Started' : 'Done';
    
    if (nextStatus === 'Done') {
      playSuccessChime();
      try { confetti({ particleCount: 40, spread: 50 }); } catch (e) {}
    }

    onUpdateSubjectDayStatus(id, {
      ...curr,
      status: nextStatus
    });
  };

  return (
    <div style={{ padding: '0 18px 40px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Subject Navigation Tabs */}
      <div className="sketch-card" style={{ padding: '10px 14px', marginBottom: '22px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: '8px', minWidth: 'max-content' }}>
          {subjectList.map(subj => {
            const isSelected = selectedSubjectKey === subj.key;
            return (
              <button
                key={subj.key}
                onClick={() => {
                  playClick();
                  setSelectedSubjectKey(subj.key);
                }}
                className="btn-sketch"
                style={{
                  background: isSelected ? 'var(--highlight-yellow)' : 'var(--paper-card)',
                  boxShadow: isSelected ? '3px 3px 0px var(--ink-border)' : '1px 1px 0px var(--ink-border)',
                  padding: '6px 12px',
                  fontSize: '0.9rem'
                }}
              >
                <span>{subj.icon}</span>
                <span>{subj.name}</span>
                <span className="badge-sketch" style={{ fontSize: '0.75rem', padding: '1px 6px' }}>
                  {subj.count}d
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Header Card */}
      <div className="sketch-card" style={{ padding: '22px 24px', marginBottom: '22px' }}>
        <div className="tape-strip"></div>
        <div className="tape-strip tape-strip-right"></div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-sketch badge-sketch-blue">{currentSubject?.code || 'GATE CSE'}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>{currentSubject?.sheet || ''}</span>
            </div>
            <h1 className="font-title" style={{ fontSize: '1.9rem', margin: '6px 0 0' }}>
              {currentSubject?.name}
            </h1>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              Strictly mapped to your Study Planner playlists, teachers, video searches, and practice targets.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>PROGRESS</div>
              <div className="font-title" style={{ fontSize: '1.4rem', color: 'var(--ink-green)' }}>
                {completedCount} / {daysList.length} Days ({progressPercent}%)
              </div>
            </div>
            <div style={{ textAlign: 'right', borderLeft: '2px dashed var(--ink-border)', paddingLeft: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>PLANNED HOURS</div>
              <div className="font-title" style={{ fontSize: '1.4rem', color: 'var(--ink-blue)' }}>
                {currentSubject?.totalHours?.toFixed(1) || '0'} hrs
              </div>
            </div>
          </div>
        </div>

        {/* Playlists Shelf from Planner */}
        {currentSubject?.playlists && currentSubject.playlists.length > 0 && (
          <div style={{ 
            marginTop: '16px', 
            paddingTop: '14px', 
            borderTop: '2px dashed var(--ink-border)', 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '10px',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <PlayCircle size={15} /> Planner Source Playlists:
            </span>
            {currentSubject.playlists.map((pl, idx) => (
              <a
                key={idx}
                href={pl.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="btn-sketch"
                style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                title={pl.description}
              >
                <span>{pl.role}:</span> 
                <span style={{ color: 'var(--ink-blue)', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {pl.description.split('—')[0]}
                </span>
                <ExternalLink size={12} />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Days Table List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {daysList.map((day) => {
          const isDone = subjectDayStatus[day.id]?.status === 'Done';

          return (
            <div 
              key={day.id}
              className="sketch-card"
              style={{ 
                padding: '16px 20px',
                background: isDone ? 'var(--highlight-green)' : 'var(--paper-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div 
                    className={`sketch-check ${isDone ? 'checked' : ''}`}
                    onClick={() => handleToggleDay(day.id)}
                    style={{ marginTop: '2px' }}
                  >
                    {isDone && <span>✓</span>}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="badge-sketch badge-sketch-yellow">DAY #{day.dayNumber}</span>
                      <span style={{ fontWeight: 700, color: 'var(--ink-primary)' }}>
                        {day.date} ({day.dayOfWeek})
                      </span>
                      <span className="badge-sketch" style={{ background: 'var(--paper-card-subtle)' }}>
                        <Clock size={12} /> {day.plannedHrs ? `${day.plannedHrs}h` : `${day.plannedMin}m`}
                      </span>
                      {day.bookRef && (
                        <span className="badge-sketch badge-sketch-blue" style={{ fontSize: '0.75rem' }}>
                          📖 {day.bookRef}
                        </span>
                      )}
                    </div>

                    <h3 className="font-title" style={{ 
                      fontSize: '1.2rem', 
                      marginTop: '6px',
                      textDecoration: isDone ? 'line-through' : 'none',
                      color: isDone ? 'var(--ink-muted)' : 'var(--ink-primary)'
                    }}>
                      {day.topic || day.lectureTopic}
                    </h3>

                    <p style={{ fontSize: '0.9rem', color: 'var(--ink-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                      {day.subtopics || day.whatsCovered || day.whatToDo}
                    </p>

                    {/* Planner Video Details */}
                    {day.mainPlaylist && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--ink-purple)', marginTop: '4px' }}>
                        🎥 Planner Playlist: <strong>{day.mainPlaylist}</strong>
                      </div>
                    )}

                    {day.practicePyq && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--ink-green)', marginTop: '6px', fontWeight: 700 }}>
                        🎯 Practice Target: {day.practicePyq}
                      </div>
                    )}

                    {day.notes && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--ink-amber)', marginTop: '4px' }}>
                        💡 Note: {day.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct Action Links from Planner */}
                <div style={{ display: 'flex', gap: '8px', alignSelf: 'center', flexWrap: 'wrap' }}>
                  {(day.mainPlaylistUrl || day.playlistUrl) && (
                    <a 
                      href={day.mainPlaylistUrl || day.playlistUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-sketch"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      title="Open Playlist from Planner"
                    >
                      <ExternalLink size={14} /> Open Playlist
                    </a>
                  )}
                  {(day.topicSearchUrl || day.searchUrl) ? (
                    <a 
                      href={day.topicSearchUrl || day.searchUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-sketch btn-sketch-primary"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      title="Search Lecture Video"
                    >
                      <Search size={14} /> Search Video
                    </a>
                  ) : (
                    <a 
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(currentSubject.name + ' ' + (day.topic || day.lectureTopic) + ' GATE')}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-sketch btn-sketch-primary"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                      <Search size={14} /> Search Video
                    </a>
                  )}
                  {day.revisionPlaylistUrl && (
                    <a 
                      href={day.revisionPlaylistUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-sketch"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                      <FileText size={14} /> Revision
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
