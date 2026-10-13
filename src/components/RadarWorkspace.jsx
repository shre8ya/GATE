import React, { useState } from 'react';
import { Calendar, BookOpen, Layers, GraduationCap, Video, Compass } from 'lucide-react';
import CalendarView from './CalendarView';
import MasterPlannerView from './MasterPlannerView';
import SubjectExplorerView from './SubjectExplorerView';
import UniversitySyncView from './UniversitySyncView';
import SyllabusMatrixView from './SyllabusMatrixView';
import { playClick } from '../utils/audio';

export default function RadarWorkspace({
  masterSchedule,
  dayStatus,
  currentDate,
  onSelectDate,
  onOpenReschedule,
  onUpdateDayStatus,
  coreSubjects,
  engineeringMaths,
  generalAptitude,
  playlistDirectory,
  subjectDayStatus,
  onUpdateSubjectDayStatus,
  universityExamsData,
  uniStatus,
  onUpdateUniStatus,
  syllabusData,
  syllabusProgress,
  onUpdateSyllabusProgress
}) {
  const [activeSubTab, setActiveSubTab] = useState('calendar'); // 'calendar' | 'planner' | 'subjects' | 'syllabus' | 'university'

  const subTabs = [
    { id: 'calendar', label: 'Desk Calendar', icon: Calendar, badge: 'Interactive' },
    { id: 'planner', label: '80-Day Master Timeline', icon: BookOpen },
    { id: 'subjects', label: 'Subject Video Directory', icon: Video },
    { id: 'syllabus', label: 'Syllabus & Weightage', icon: Layers },
    { id: 'university', label: 'IPU Exam Synergy', icon: GraduationCap }
  ];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 18px 40px' }}>
      
      {/* Workspace Header & Sub-Navigation */}
      <div className="sketch-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div className="tape-strip"></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-sketch badge-sketch-blue">TIMELINE & SYLLABUS RADAR</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>
                Strategic Overview & Long-Term Roadmap
              </span>
            </div>
            <h1 className="font-title" style={{ fontSize: '1.75rem', margin: '4px 0 0' }}>
              🗺️ Radar: Calendar, Planner & Syllabus
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
                    padding: '8px 14px',
                    fontSize: '0.86rem',
                    fontWeight: isActive ? 700 : 500,
                    background: isActive ? 'var(--highlight-yellow)' : 'var(--paper-card)',
                    borderColor: isActive ? 'var(--ink-primary)' : 'var(--ink-border)',
                    boxShadow: isActive ? '2px 3px 0px var(--ink-border)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Sub-Tab View */}
      {activeSubTab === 'calendar' && (
        <CalendarView 
          masterSchedule={masterSchedule}
          dayStatus={dayStatus}
          currentDate={currentDate}
          onSelectDate={onSelectDate}
          onOpenReschedule={onOpenReschedule}
          onUpdateDayStatus={onUpdateDayStatus}
        />
      )}

      {activeSubTab === 'planner' && (
        <MasterPlannerView 
          masterSchedule={masterSchedule}
          dayStatus={dayStatus}
          onUpdateDayStatus={onUpdateDayStatus}
          onSelectDate={onSelectDate}
        />
      )}

      {activeSubTab === 'subjects' && (
        <SubjectExplorerView 
          coreSubjects={coreSubjects}
          engineeringMaths={engineeringMaths}
          generalAptitude={generalAptitude}
          playlistDirectory={playlistDirectory}
          subjectDayStatus={subjectDayStatus}
          onUpdateSubjectDayStatus={onUpdateSubjectDayStatus}
        />
      )}

      {activeSubTab === 'syllabus' && (
        <SyllabusMatrixView 
          officialSyllabusData={syllabusData}
          syllabusProgress={syllabusProgress}
          onUpdateSyllabusProgress={onUpdateSyllabusProgress}
        />
      )}

      {activeSubTab === 'university' && (
        <UniversitySyncView 
          universityExamsData={universityExamsData}
          uniStatus={uniStatus}
          onUpdateUniStatus={onUpdateUniStatus}
        />
      )}

    </div>
  );
}
