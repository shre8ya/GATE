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
import VaultWorkspace from './components/VaultWorkspace';
import RadarWorkspace from './components/RadarWorkspace';
import PersonalizationModal from './components/PersonalizationModal';
import BackupModal from './components/BackupModal';
import RemindersModal from './components/RemindersModal';
import RescheduleModal from './components/RescheduleModal';
import FileImportModal from './components/FileImportModal';
import ResourceCustomizerModal from './components/ResourceCustomizerModal';

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

import { 
  getProfilesList, 
  saveProfilesList, 
  getActiveProfileId, 
  setActiveProfileId, 
  loadProfileItem, 
  saveProfileItem, 
  createNewProfile, 
  deleteProfile, 
  resetAllData, 
  DEFAULT_PROFILE 
} from './utils/storage';

export default function App() {
  // Multi-User Profile State
  const [activeProfileId, setActiveProfileIdState] = useState(() => getActiveProfileId());
  const [profilesList, setProfilesListState] = useState(() => getProfilesList());

  // Navigation & Current Active Date (Consolidated 3 Core Workspaces)
  const [activeTab, setActiveTab] = useState(() => {
    const saved = loadProfileItem(getActiveProfileId(), 'active_tab', 'today');
    if (['today', 'vault', 'radar'].includes(saved)) return saved;
    if (['errorlog', 'formulas', 'sunday'].includes(saved)) return 'vault';
    if (['calendar', 'planner', 'subjects', 'syllabus', 'university'].includes(saved)) return 'radar';
    return 'today';
  });
  const [currentDate, setCurrentDate] = useState('2026-10-13'); // Live Day 1

  // Modals State
  const [showSettings, setShowSettings] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState('profile');
  const [showBackup, setShowBackup] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Paper Stationery Theme State
  const [theme, setTheme] = useState(() => {
    const saved = loadProfileItem(getActiveProfileId(), 'theme_mode', 'paper');
    return saved === 'chalkboard' ? 'paper' : saved;
  });
  const [paperTheme, setPaperTheme] = useState(() => {
    const saved = loadProfileItem(getActiveProfileId(), 'paper_theme', 'parchment');
    return saved === 'chalkboard' ? 'parchment' : saved;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'paper');
    saveProfileItem(activeProfileId, 'theme_mode', 'paper');
  }, [theme, activeProfileId]);

  useEffect(() => {
    const safeTheme = paperTheme === 'chalkboard' ? 'parchment' : paperTheme;
    document.documentElement.setAttribute('data-paper-theme', safeTheme);
    saveProfileItem(activeProfileId, 'paper_theme', safeTheme);
  }, [paperTheme, activeProfileId]);

  const handleSelectPaperTheme = (newPaperTheme) => {
    const safeTheme = newPaperTheme === 'chalkboard' ? 'parchment' : newPaperTheme;
    setPaperTheme(safeTheme);
    setTheme('paper');
  };

  // Profile-scoped persistent states
  const [userProfile, setUserProfile] = useState(() => 
    loadProfileItem(activeProfileId, 'user_profile', DEFAULT_PROFILE)
  );

  const [masterSchedule, setMasterSchedule] = useState(() => 
    loadProfileItem(activeProfileId, 'master_schedule', MASTER_PLANNER_DATA)
  );

  const [customResources, setCustomResources] = useState(() => 
    loadProfileItem(activeProfileId, 'custom_resources', {})
  );

  const [dayStatus, setDayStatus] = useState(() => 
    loadProfileItem(activeProfileId, 'day_status', {})
  );
  const [subjectDayStatus, setSubjectDayStatus] = useState(() => 
    loadProfileItem(activeProfileId, 'subject_day_status', {})
  );
  const [sundayStatus, setSundayStatus] = useState(() => 
    loadProfileItem(activeProfileId, 'sunday_status', {})
  );
  const [uniStatus, setUniStatus] = useState(() => 
    loadProfileItem(activeProfileId, 'uni_status', {})
  );
  const [syllabusProgress, setSyllabusProgress] = useState(() => 
    loadProfileItem(activeProfileId, 'syllabus_progress', {})
  );
  const [errorLog, setErrorLog] = useState(() => 
    loadProfileItem(activeProfileId, 'error_log', [])
  );
  const [mockTests, setMockTests] = useState(() => 
    loadProfileItem(activeProfileId, 'mock_tests', [])
  );
  const [customFormulas, setCustomFormulas] = useState(() => 
    loadProfileItem(activeProfileId, 'custom_formulas', [])
  );
  const [studySessions, setStudySessions] = useState(() => 
    loadProfileItem(activeProfileId, 'study_sessions', [])
  );
  const [reminderSettings, setReminderSettings] = useState(() => 
    loadProfileItem(activeProfileId, 'reminder_settings', {
      morningTime: '08:00',
      afternoonTime: '14:00',
      eveningTime: '20:00',
      soundEnabled: true,
      spacedRecallAlerts: true
    })
  );

  const [notifPermission, setNotifPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  // Multi-User Switch Profile Handler
  const handleSwitchProfile = (targetProfileId) => {
    setActiveProfileId(targetProfileId);
    setActiveProfileIdState(targetProfileId);

    // Reload all profile-isolated datasets
    const targetProfile = loadProfileItem(targetProfileId, 'user_profile', {
      ...DEFAULT_PROFILE,
      ...profilesList.find(p => p.id === targetProfileId)
    });
    setUserProfile(targetProfile);
    setMasterSchedule(loadProfileItem(targetProfileId, 'master_schedule', MASTER_PLANNER_DATA));
    setCustomResources(loadProfileItem(targetProfileId, 'custom_resources', {}));
    setDayStatus(loadProfileItem(targetProfileId, 'day_status', {}));
    setSubjectDayStatus(loadProfileItem(targetProfileId, 'subject_day_status', {}));
    setSundayStatus(loadProfileItem(targetProfileId, 'sunday_status', {}));
    setUniStatus(loadProfileItem(targetProfileId, 'uni_status', {}));
    setSyllabusProgress(loadProfileItem(targetProfileId, 'syllabus_progress', {}));
    setErrorLog(loadProfileItem(targetProfileId, 'error_log', []));
    setMockTests(loadProfileItem(targetProfileId, 'mock_tests', []));
    setCustomFormulas(loadProfileItem(targetProfileId, 'custom_formulas', []));
    setStudySessions(loadProfileItem(targetProfileId, 'study_sessions', []));
    setReminderSettings(loadProfileItem(targetProfileId, 'reminder_settings', {
      morningTime: '08:00',
      afternoonTime: '14:00',
      eveningTime: '20:00',
      soundEnabled: true,
      spacedRecallAlerts: true
    }));
  };

  // Create Profile Handler
  const handleCreateProfile = (newProfileData) => {
    const created = createNewProfile(newProfileData);
    const updatedProfiles = getProfilesList();
    setProfilesListState(updatedProfiles);
    handleSwitchProfile(created.id);
  };

  // Delete Profile Handler
  const handleDeleteProfile = (profileIdToDelete) => {
    try {
      const { updatedList, nextActiveId } = deleteProfile(profileIdToDelete);
      setProfilesListState(updatedList);
      if (activeProfileId === profileIdToDelete) {
        handleSwitchProfile(nextActiveId);
      }
    } catch (err) {
      alert(err.message || 'Could not delete profile.');
    }
  };

  // AI & Manual Resource Swapper Handler
  const handleApplyCustomResource = (subjectKey, resourceData) => {
    const nextResources = { ...customResources };
    if (!resourceData) {
      delete nextResources[subjectKey];
    } else {
      nextResources[subjectKey] = resourceData;
    }
    setCustomResources(nextResources);
    saveProfileItem(activeProfileId, 'custom_resources', nextResources);

    // Apply change across masterSchedule days for this subject
    const subjectKeywords = {
      c_programming: ['c programming', 'c basics', 'programming in c'],
      data_structures: ['data structure', 'data structures', 'dsa'],
      algorithms: ['algorithm', 'algorithms', 'daa'],
      compiler_design: ['compiler design', 'compiler'],
      operating_systems: ['operating system', 'operating systems', 'os'],
      computer_networks: ['computer network', 'computer networks', 'cn'],
      engineering_maths: ['engineering maths', 'discrete mathematics', 'maths'],
      general_aptitude: ['general aptitude', 'aptitude']
    };

    const keysToMatch = subjectKeywords[subjectKey] || [subjectKey];

    const nextSchedule = masterSchedule.map(day => {
      const daySubj = (day.subject || '').toLowerCase();
      const isMatch = keysToMatch.some(k => daySubj.includes(k));

      if (isMatch) {
        return {
          ...day,
          mainPlaylist: resourceData ? `${resourceData.title} · ${resourceData.teacher}` : day.mainPlaylist,
          mainPlaylistUrl: resourceData ? resourceData.url : day.mainPlaylistUrl
        };
      }
      return day;
    });

    setMasterSchedule(nextSchedule);
    saveProfileItem(activeProfileId, 'master_schedule', nextSchedule);
  };

  // AI Rescheduler apply handler
  const handleApplyRescheduledSchedule = (updatedSchedule) => {
    setMasterSchedule(updatedSchedule);
    saveProfileItem(activeProfileId, 'master_schedule', updatedSchedule);
  };

  // Save changes to storage (all strictly isolated to activeProfileId)
  const handleUpdateDayStatus = (date, statusObj) => {
    setDayStatus(prev => {
      const next = { ...prev, [date]: statusObj };
      saveProfileItem(activeProfileId, 'day_status', next);
      return next;
    });
  };

  const handleUpdateSubjectDayStatus = (id, statusObj) => {
    setSubjectDayStatus(prev => {
      const next = { ...prev, [id]: statusObj };
      saveProfileItem(activeProfileId, 'subject_day_status', next);
      return next;
    });
  };

  const handleUpdateSundayStatus = (id, statusObj) => {
    setSundayStatus(prev => {
      const next = { ...prev, [id]: statusObj };
      saveProfileItem(activeProfileId, 'sunday_status', next);
      return next;
    });
  };

  const handleUpdateUniStatus = (id, statusObj) => {
    setUniStatus(prev => {
      const next = { ...prev, [id]: statusObj };
      saveProfileItem(activeProfileId, 'uni_status', next);
      return next;
    });
  };

  const handleUpdateSyllabusProgress = (key, progObj) => {
    setSyllabusProgress(prev => {
      const next = { ...prev, [key]: progObj };
      saveProfileItem(activeProfileId, 'syllabus_progress', next);
      return next;
    });
  };

  const handleAddErrorItem = (item) => {
    setErrorLog(prev => {
      const next = [item, ...prev];
      saveProfileItem(activeProfileId, 'error_log', next);
      return next;
    });
  };

  const handleUpdateErrorItem = (id, updatedItem) => {
    setErrorLog(prev => {
      const next = prev.map(e => e.id === id ? updatedItem : e);
      saveProfileItem(activeProfileId, 'error_log', next);
      return next;
    });
  };

  const handleDeleteErrorItem = (id) => {
    setErrorLog(prev => {
      const next = prev.filter(e => e.id !== id);
      saveProfileItem(activeProfileId, 'error_log', next);
      return next;
    });
  };

  const handleAddMockTest = (test) => {
    setMockTests(prev => {
      const next = [test, ...prev];
      saveProfileItem(activeProfileId, 'mock_tests', next);
      return next;
    });
  };

  const handleDeleteMockTest = (id) => {
    setMockTests(prev => {
      const next = prev.filter(m => m.id !== id);
      saveProfileItem(activeProfileId, 'mock_tests', next);
      return next;
    });
  };

  const handleAddCustomFormula = (formula) => {
    setCustomFormulas(prev => {
      const next = [formula, ...prev];
      saveProfileItem(activeProfileId, 'custom_formulas', next);
      return next;
    });
  };

  const handleDeleteCustomFormula = (id) => {
    setCustomFormulas(prev => {
      const next = prev.filter(f => f.id !== id);
      saveProfileItem(activeProfileId, 'custom_formulas', next);
      return next;
    });
  };

  const handleLogStudySession = (session) => {
    setStudySessions(prev => {
      const next = [session, ...prev];
      saveProfileItem(activeProfileId, 'study_sessions', next);
      return next;
    });
  };

  const handleSaveProfile = (prof) => {
    setUserProfile(prof);
    saveProfileItem(activeProfileId, 'user_profile', prof);
    // Also update profile summary in profilesList
    const updatedList = profilesList.map(p => p.id === activeProfileId ? { ...p, ...prof } : p);
    saveProfilesList(updatedList);
    setProfilesListState(updatedList);
  };

  const handleSaveReminderSettings = (settings) => {
    setReminderSettings(settings);
    saveProfileItem(activeProfileId, 'reminder_settings', settings);
  };

  // File import callbacks
  const handleAppendNoteToToday = (noteText) => {
    setDayStatus(prev => {
      const curr = prev[currentDate] || { status: 'Not Started', note: '' };
      const updatedNote = curr.note ? `${curr.note}\n\n${noteText}` : noteText;
      const next = { ...prev, [currentDate]: { ...curr, note: updatedNote } };
      saveProfileItem(activeProfileId, 'day_status', next);
      return next;
    });
  };

  const handleAddCalendarTask = (task) => {
    setDayStatus(prev => {
      const curr = prev[currentDate] || { status: 'Not Started', note: '' };
      const taskLine = `• [${task.time || 'Task'}] ${task.title}${task.desc ? ` - ${task.desc}` : ''}`;
      const updatedNote = curr.note ? `${curr.note}\n${taskLine}` : taskLine;
      const next = { ...prev, [currentDate]: { ...curr, note: updatedNote } };
      saveProfileItem(activeProfileId, 'day_status', next);
      return next;
    });
  };

  const handleReloadAllFromStorage = () => {
    setDayStatus(loadProfileItem(activeProfileId, 'day_status', {}));
    setSubjectDayStatus(loadProfileItem(activeProfileId, 'subject_day_status', {}));
    setSundayStatus(loadProfileItem(activeProfileId, 'sunday_status', {}));
    setUniStatus(loadProfileItem(activeProfileId, 'uni_status', {}));
    setSyllabusProgress(loadProfileItem(activeProfileId, 'syllabus_progress', {}));
    setErrorLog(loadProfileItem(activeProfileId, 'error_log', []));
    setMockTests(loadProfileItem(activeProfileId, 'mock_tests', []));
    setCustomFormulas(loadProfileItem(activeProfileId, 'custom_formulas', []));
    setUserProfile(loadProfileItem(activeProfileId, 'user_profile', userProfile));
    setMasterSchedule(loadProfileItem(activeProfileId, 'master_schedule', MASTER_PLANNER_DATA));
    setCustomResources(loadProfileItem(activeProfileId, 'custom_resources', {}));
    setProfilesListState(getProfilesList());
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
    setCustomResources({});
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
        profilesList={profilesList}
        activeProfileId={activeProfileId}
        onSwitchProfile={handleSwitchProfile}
        onOpenSettings={(tab = 'profile') => {
          setSettingsInitialTab(tab);
          setShowSettings(true);
        }}
        onOpenBackup={() => setShowBackup(true)}
        onOpenReminders={() => setShowReminders(true)}
        onOpenReschedule={() => setShowReschedule(true)}
        onOpenImport={() => setShowImport(true)}
        onOpenCustomizer={() => setShowCustomizer(true)}
        theme={theme}
        onToggleTheme={() => {}}
        paperTheme={paperTheme}
        onSelectPaperTheme={handleSelectPaperTheme}
        notifPermission={notifPermission}
      />

      {/* Main Tab Workspaces (3 Consolidated Views) */}
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
            errorLog={errorLog}
            onAddErrorItem={handleAddErrorItem}
            onUpdateErrorItem={handleUpdateErrorItem}
            onAddFormula={handleAddCustomFormula}
            activeProfileId={activeProfileId}
          />
        )}

        {activeTab === 'vault' && (
          <VaultWorkspace 
            errorLog={errorLog}
            onAddErrorItem={handleAddErrorItem}
            onUpdateErrorItem={handleUpdateErrorItem}
            onDeleteErrorItem={handleDeleteErrorItem}
            formulaData={FORMULA_VAULT_DATA}
            customFormulas={customFormulas}
            onAddCustomFormula={handleAddCustomFormula}
            onDeleteCustomFormula={handleDeleteCustomFormula}
            sundayRevisionData={SUNDAY_REVISION_DATA}
            sundayStatus={sundayStatus}
            onUpdateSundayStatus={handleUpdateSundayStatus}
            mockTests={mockTests}
            onAddMockTest={handleAddMockTest}
            onDeleteMockTest={handleDeleteMockTest}
          />
        )}

        {activeTab === 'radar' && (
          <RadarWorkspace 
            masterSchedule={masterSchedule}
            dayStatus={dayStatus}
            currentDate={currentDate}
            onSelectDate={(d) => {
              setCurrentDate(d);
              setActiveTab('today');
            }}
            onOpenReschedule={() => setShowReschedule(true)}
            onUpdateDayStatus={handleUpdateDayStatus}
            coreSubjects={CORE_SUBJECTS_DATA}
            engineeringMaths={ENGINEERING_MATHS_DATA}
            generalAptitude={GENERAL_APTITUDE_DATA}
            playlistDirectory={PLAYLIST_DIRECTORY_DATA}
            subjectDayStatus={subjectDayStatus}
            onUpdateSubjectDayStatus={handleUpdateSubjectDayStatus}
            universityExamsData={UNIVERSITY_EXAMS_DATA}
            uniStatus={uniStatus}
            onUpdateUniStatus={handleUpdateUniStatus}
            syllabusData={OFFICIAL_SYLLABUS_DATA}
            syllabusProgress={syllabusProgress}
            onUpdateSyllabusProgress={handleUpdateSyllabusProgress}
            activeProfileId={activeProfileId}
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
          activeProfileId={activeProfileId}
          profilesList={profilesList}
          onSwitchProfile={handleSwitchProfile}
          onCreateProfile={handleCreateProfile}
          onDeleteProfile={handleDeleteProfile}
          initialTab={settingsInitialTab}
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
          onApplyRescheduledSchedule={handleApplyRescheduledSchedule}
          onClose={() => setShowReschedule(false)}
        />
      )}

      {/* Universal File Import Studio Modal */}
      <FileImportModal 
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        currentDate={currentDate}
        onAppendNoteToToday={handleAppendNoteToToday}
        onAddFormulaItem={handleAddCustomFormula}
        onAddErrorItem={handleAddErrorItem}
        onAddCalendarTask={handleAddCalendarTask}
        onRestoreBackup={handleReloadAllFromStorage}
      />

      {/* AI & Manual Resource Customizer Modal */}
      <ResourceCustomizerModal 
        isOpen={showCustomizer}
        onClose={() => setShowCustomizer(false)}
        masterSchedule={masterSchedule}
        customResources={customResources}
        onApplyCustomResource={handleApplyCustomResource}
      />

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
