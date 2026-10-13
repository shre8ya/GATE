import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TodayMission from './components/TodayMission';
import MasterPlannerView from './components/MasterPlannerView';
import SubjectExplorerView from './components/SubjectExplorerView';
import SundayRevisionView from './components/SundayRevisionView';
import ErrorLogView from './components/ErrorLogView';
import UniversitySyncView from './components/UniversitySyncView';
import SyllabusMatrixView from './components/SyllabusMatrixView';
import FormulaVaultView from './components/FormulaVaultView';
import CalendarView from './components/CalendarView';
import JournalAchievementView from './components/JournalAchievementView';
import PersonalizationModal from './components/PersonalizationModal';
import BackupModal from './components/BackupModal';
import RemindersModal from './components/RemindersModal';
import RescheduleModal from './components/RescheduleModal';

import { 
  MASTER_PLANNER_DATA, 
  CORE_SUBJECTS_DATA, 
  ENGINEERING_MATHS_DATA, 
  GENERAL_APTITUDE_DATA, 
  SUNDAY_REVISION_DATA, 
  UNIVERSITY_EXAMS_DATA, 
  PLAYLIST_DIRECTORY_DATA, 
  OFFICIAL_SYLLABUS_DATA, 
  FORMULA_VAULT_DATA 
} from './data/database';

import { loadItem, saveItem, resetAllData } from './utils/storage';

export default function App() {
  // Navigation & Current Active Date
  const [activeTab, setActiveTab] = useState('today');
  const [currentDate, setCurrentDate] = useState('2026-10-13'); // Live Day 1

  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);

  // Theme State (Notebook Paper vs Chalkboard)
  const [theme, setTheme] = useState(() => loadItem('theme_mode', 'paper'));
  const [paperTheme, setPaperTheme] = useState(() => loadItem('paper_theme', 'parchment'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveItem('theme_mode', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-paper-theme', paperTheme);
    saveItem('paper_theme', paperTheme);
  }, [paperTheme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'chalkboard' ? 'paper' : 'chalkboard');
  };

  const handleSelectPaperTheme = (newPaperTheme) => {
    setPaperTheme(newPaperTheme);
    if (newPaperTheme === 'chalkboard') {
      setTheme('chalkboard');
    } else {
      setTheme('paper');
    }
  };

  // Dynamic Master Schedule (Can be rescheduled by AI)
  const [masterSchedule, setMasterSchedule] = useState(() => 
    loadItem('master_schedule', MASTER_PLANNER_DATA)
  );

  const handleApplyRescheduledSchedule = (updatedSchedule) => {
    setMasterSchedule(updatedSchedule);
    saveItem('master_schedule', updatedSchedule);
  };

  // Persistent States
  const [userProfile, setUserProfile] = useState(() => 
    loadItem('user_profile', {
      name: 'Shreya',
      avatar: '🦉',
      targetRank: 'AIR < 100',
      targetScore: '80+ Marks',
      college: 'GGSIPU (5th Sem CSE)',
      dailyGoalHours: 3.5,
      weakSubjects: 'Operating Systems, COA',
      geminiApiKey: ''
    })
  );

  const [dayStatus, setDayStatus] = useState(() => loadItem('day_status', {}));
  const [subjectDayStatus, setSubjectDayStatus] = useState(() => loadItem('subject_day_status', {}));
  const [sundayStatus, setSundayStatus] = useState(() => loadItem('sunday_status', {}));
  const [uniStatus, setUniStatus] = useState(() => loadItem('uni_status', {}));
  const [syllabusProgress, setSyllabusProgress] = useState(() => loadItem('syllabus_progress', {}));
  const [errorLog, setErrorLog] = useState(() => loadItem('error_log', []));
  const [mockTests, setMockTests] = useState(() => loadItem('mock_tests', []));
  const [customFormulas, setCustomFormulas] = useState(() => loadItem('custom_formulas', []));
  const [studySessions, setStudySessions] = useState(() => loadItem('study_sessions', []));
  const [reminderSettings, setReminderSettings] = useState(() => loadItem('reminder_settings', {
    morningTime: '08:00',
    afternoonTime: '14:00',
    eveningTime: '20:00',
    soundEnabled: true,
    spacedRecallAlerts: true
  }));

  const [notifPermission, setNotifPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  // Save changes to storage
  const handleUpdateDayStatus = (date, statusObj) => {
    setDayStatus(prev => {
      const next = { ...prev, [date]: statusObj };
      saveItem('day_status', next);
      return next;
    });
  };

  const handleUpdateSubjectDayStatus = (id, statusObj) => {
    setSubjectDayStatus(prev => {
      const next = { ...prev, [id]: statusObj };
      saveItem('subject_day_status', next);
      return next;
    });
  };

  const handleUpdateSundayStatus = (id, statusObj) => {
    setSundayStatus(prev => {
      const next = { ...prev, [id]: statusObj };
      saveItem('sunday_status', next);
      return next;
    });
  };

  const handleUpdateUniStatus = (id, statusObj) => {
    setUniStatus(prev => {
      const next = { ...prev, [id]: statusObj };
      saveItem('uni_status', next);
      return next;
    });
  };

  const handleUpdateSyllabusProgress = (key, progObj) => {
    setSyllabusProgress(prev => {
      const next = { ...prev, [key]: progObj };
      saveItem('syllabus_progress', next);
      return next;
    });
  };

  const handleAddErrorItem = (item) => {
    setErrorLog(prev => {
      const next = [item, ...prev];
      saveItem('error_log', next);
      return next;
    });
  };

  const handleUpdateErrorItem = (id, updatedItem) => {
    setErrorLog(prev => {
      const next = prev.map(e => e.id === id ? updatedItem : e);
      saveItem('error_log', next);
      return next;
    });
  };

  const handleDeleteErrorItem = (id) => {
    setErrorLog(prev => {
      const next = prev.filter(e => e.id !== id);
      saveItem('error_log', next);
      return next;
    });
  };

  const handleAddMockTest = (test) => {
    setMockTests(prev => {
      const next = [test, ...prev];
      saveItem('mock_tests', next);
      return next;
    });
  };

  const handleDeleteMockTest = (id) => {
    setMockTests(prev => {
      const next = prev.filter(m => m.id !== id);
      saveItem('mock_tests', next);
      return next;
    });
  };

  const handleAddCustomFormula = (formula) => {
    setCustomFormulas(prev => {
      const next = [formula, ...prev];
      saveItem('custom_formulas', next);
      return next;
    });
  };

  const handleDeleteCustomFormula = (id) => {
    setCustomFormulas(prev => {
      const next = prev.filter(f => f.id !== id);
      saveItem('custom_formulas', next);
      return next;
    });
  };

  const handleLogStudySession = (session) => {
    setStudySessions(prev => {
      const next = [session, ...prev];
      saveItem('study_sessions', next);
      return next;
    });
  };

  const handleSaveProfile = (prof) => {
    setUserProfile(prof);
    saveItem('user_profile', prof);
  };

  const handleSaveReminderSettings = (settings) => {
    setReminderSettings(settings);
    saveItem('reminder_settings', settings);
  };

  const handleReloadAllFromStorage = () => {
    setDayStatus(loadItem('day_status', {}));
    setSubjectDayStatus(loadItem('subject_day_status', {}));
    setSundayStatus(loadItem('sunday_status', {}));
    setUniStatus(loadItem('uni_status', {}));
    setSyllabusProgress(loadItem('syllabus_progress', {}));
    setErrorLog(loadItem('error_log', []));
    setMockTests(loadItem('mock_tests', []));
    setCustomFormulas(loadItem('custom_formulas', []));
    setUserProfile(loadItem('user_profile', userProfile));
    setMasterSchedule(loadItem('master_schedule', MASTER_PLANNER_DATA));
  };

  const handleResetAll = () => {
    resetAllData();
    setDayStatus({});
    setSubjectDayStatus({});
    setSundayStatus({});
    setUniStatus({});
    setSyllabusProgress({});
    setErrorLog([]);
    setMockTests([]);
    setCustomFormulas([]);
    setStudySessions([]);
    setMasterSchedule(MASTER_PLANNER_DATA);
  };

  // Metrics for Navbar
  const completedDaysCount = masterSchedule.filter(m => dayStatus[m.date]?.status === 'Done').length;
  const errorsDueCount = errorLog.filter(e => !e.resolved && e.nextReviewDate <= currentDate).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streak={Math.max(1, completedDaysCount)}
        todayStats={{
          hoursToday: userProfile.dailyGoalHours,
          errorsDue: errorsDueCount
        }}
        userProfile={userProfile}
        onOpenSettings={() => setShowSettings(true)}
        onOpenBackup={() => setShowBackup(true)}
        onOpenReminders={() => setShowReminders(true)}
        onOpenReschedule={() => setShowReschedule(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        paperTheme={paperTheme}
        onSelectPaperTheme={handleSelectPaperTheme}
        notifPermission={notifPermission}
      />

      {/* Main Tab Views */}
      <main style={{ flex: 1 }}>
        {activeTab === 'today' && (
          <TodayMission 
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            masterSchedule={masterSchedule}
            mathsSchedule={ENGINEERING_MATHS_DATA.days}
            aptitudeSchedule={GENERAL_APTITUDE_DATA.days}
            dayStatus={dayStatus}
            onUpdateDayStatus={handleUpdateDayStatus}
            onLogStudySession={handleLogStudySession}
            onOpenReschedule={() => setShowReschedule(true)}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView 
            masterSchedule={masterSchedule}
            dayStatus={dayStatus}
            currentDate={currentDate}
            onSelectDate={(d) => {
              setCurrentDate(d);
              setActiveTab('today');
            }}
            onOpenReschedule={() => setShowReschedule(true)}
            onUpdateDayStatus={handleUpdateDayStatus}
          />
        )}

        {activeTab === 'achievements' && (
          <JournalAchievementView 
            currentDate={currentDate}
            masterSchedule={masterSchedule}
            dayStatus={dayStatus}
            userProfile={userProfile}
          />
        )}

        {activeTab === 'planner' && (
          <MasterPlannerView 
            masterSchedule={masterSchedule}
            dayStatus={dayStatus}
            onUpdateDayStatus={handleUpdateDayStatus}
            onSelectDate={(d) => {
              setCurrentDate(d);
              setActiveTab('today');
            }}
          />
        )}

        {activeTab === 'subjects' && (
          <SubjectExplorerView 
            coreSubjects={CORE_SUBJECTS_DATA}
            engineeringMaths={ENGINEERING_MATHS_DATA}
            generalAptitude={GENERAL_APTITUDE_DATA}
            playlistDirectory={PLAYLIST_DIRECTORY_DATA}
            subjectDayStatus={subjectDayStatus}
            onUpdateSubjectDayStatus={handleUpdateSubjectDayStatus}
          />
        )}

        {activeTab === 'sunday' && (
          <SundayRevisionView 
            sundayRevisionData={SUNDAY_REVISION_DATA}
            sundayStatus={sundayStatus}
            onUpdateSundayStatus={handleUpdateSundayStatus}
            mockTests={mockTests}
            onAddMockTest={handleAddMockTest}
            onDeleteMockTest={handleDeleteMockTest}
          />
        )}

        {activeTab === 'errorlog' && (
          <ErrorLogView 
            errorLog={errorLog}
            onAddErrorItem={handleAddErrorItem}
            onUpdateErrorItem={handleUpdateErrorItem}
            onDeleteErrorItem={handleDeleteErrorItem}
          />
        )}

        {activeTab === 'university' && (
          <UniversitySyncView 
            universityExamsData={UNIVERSITY_EXAMS_DATA}
            uniStatus={uniStatus}
            onUpdateUniStatus={handleUpdateUniStatus}
          />
        )}

        {activeTab === 'syllabus' && (
          <SyllabusMatrixView 
            officialSyllabus={OFFICIAL_SYLLABUS_DATA}
            syllabusProgress={syllabusProgress}
            onUpdateSyllabusProgress={handleUpdateSyllabusProgress}
          />
        )}

        {activeTab === 'formulas' && (
          <FormulaVaultView 
            preloadedFormulas={FORMULA_VAULT_DATA}
            customFormulas={customFormulas}
            onAddCustomFormula={handleAddCustomFormula}
            onDeleteCustomFormula={handleDeleteCustomFormula}
          />
        )}
      </main>

      {/* Modals */}
      {showSettings && (
        <PersonalizationModal 
          userProfile={userProfile}
          onSaveProfile={handleSaveProfile}
          studySessions={studySessions}
          dayStatus={dayStatus}
          mockTests={mockTests}
          errorLog={errorLog}
          customFormulas={customFormulas}
          onResetAll={handleResetAll}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showBackup && (
        <BackupModal 
          onClose={() => setShowBackup(false)}
          onDataRestored={handleReloadAllFromStorage}
        />
      )}

      {showReminders && (
        <RemindersModal 
          reminderSettings={reminderSettings}
          onSaveReminderSettings={handleSaveReminderSettings}
          onClose={() => setShowReminders(false)}
          notifPermission={notifPermission}
          onPermissionUpdated={(p) => setNotifPermission(p)}
        />
      )}

      {showReschedule && (
        <RescheduleModal 
          currentDate={currentDate}
          masterSchedule={masterSchedule}
          dayStatus={dayStatus}
          geminiApiKey={userProfile.geminiApiKey}
          onApplyRescheduledSchedule={handleApplyRescheduledSchedule}
          onClose={() => setShowReschedule(false)}
        />
      )}

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '24px 20px', 
        borderTop: '1px solid var(--border-subtle)', 
        color: 'var(--text-muted)', 
        fontSize: '0.8rem' 
      }}>
        GATE Matrix AI • Personal Command Center for GATE CSE 2027 (IIT Madras) • Built for High Rank Mastery
      </footer>

    </div>
  );
}
