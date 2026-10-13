// Comprehensive Local Storage & Isolated Multi-User Profile Persistence Manager

const STORAGE_KEY_PREFIX = 'GATE_MATRIX_2027_';

export const DEFAULT_PROFILE = {
  id: 'profile_default',
  name: 'Shreya',
  avatar: '🦉',
  targetRank: 'AIR < 100',
  targetScore: '80+ Marks',
  college: 'GGSIPU (5th Sem CSE)',
  dailyGoalHours: 3.5,
  weakSubjects: 'Operating Systems, COA',
  geminiApiKey: '',
  createdAt: '2026-10-13'
};

// Global Profiles Registry
export function getProfilesList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + 'profiles_v2');
    if (!raw) {
      // Check legacy profiles list if any
      const legacy = localStorage.getItem(STORAGE_KEY_PREFIX + 'profiles_list');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const migrated = parsed.map((p, idx) => ({
            ...DEFAULT_PROFILE,
            ...p,
            id: p.id ? (p.id.startsWith('profile_') ? p.id : `profile_${p.id}`) : (idx === 0 ? 'profile_default' : `profile_${Date.now()}_${idx}`)
          }));
          saveProfilesList(migrated);
          return migrated;
        }
      }
      saveProfilesList([DEFAULT_PROFILE]);
      return [DEFAULT_PROFILE];
    }
    const list = JSON.parse(raw);
    return Array.isArray(list) && list.length > 0 ? list : [DEFAULT_PROFILE];
  } catch (err) {
    console.warn('Error reading profiles list:', err);
    return [DEFAULT_PROFILE];
  }
}

export function saveProfilesList(list) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'profiles_v2', JSON.stringify(list));
  } catch (err) {
    console.error('Error saving profiles list:', err);
  }
}

export function getActiveProfileId() {
  try {
    const active = localStorage.getItem(STORAGE_KEY_PREFIX + 'active_profile_id');
    const profiles = getProfilesList();
    if (active && profiles.some(p => p.id === active)) {
      return active;
    }
    const fallback = profiles[0]?.id || 'profile_default';
    setActiveProfileId(fallback);
    return fallback;
  } catch (e) {
    return 'profile_default';
  }
}

export function setActiveProfileId(profileId) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'active_profile_id', profileId);
  } catch (err) {
    console.error('Error setting active profile ID:', err);
  }
}

// Scoped Profile Data Storage
export function loadProfileItem(profileId, key, defaultValue) {
  const pId = profileId || getActiveProfileId();
  const scopedKey = `${STORAGE_KEY_PREFIX}${pId}_${key}`;
  try {
    const raw = localStorage.getItem(scopedKey);
    if (raw !== null) {
      return JSON.parse(raw);
    }
    
    // Seamless legacy migration for the default profile
    if (pId === 'profile_default') {
      const legacyRaw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      if (legacyRaw !== null) {
        const val = JSON.parse(legacyRaw);
        saveProfileItem(pId, key, val);
        return val;
      }
    }
    return defaultValue;
  } catch (err) {
    console.warn(`Error reading ${scopedKey}:`, err);
    return defaultValue;
  }
}

export function saveProfileItem(profileId, key, value) {
  const pId = profileId || getActiveProfileId();
  const scopedKey = `${STORAGE_KEY_PREFIX}${pId}_${key}`;
  try {
    localStorage.setItem(scopedKey, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${scopedKey}:`, err);
  }
}

export function createNewProfile(newProfileData) {
  const profiles = getProfilesList();
  const newId = `profile_${Date.now()}`;
  const profile = {
    ...DEFAULT_PROFILE,
    ...newProfileData,
    id: newId,
    createdAt: new Date().toISOString().split('T')[0]
  };
  const updatedList = [...profiles, profile];
  saveProfilesList(updatedList);
  setActiveProfileId(newId);
  return profile;
}

export function deleteProfile(profileIdToDelete) {
  const profiles = getProfilesList();
  if (profiles.length <= 1) {
    throw new Error('Cannot delete the last remaining profile.');
  }

  // Remove all stored keys belonging to this profile
  const prefixToRemove = `${STORAGE_KEY_PREFIX}${profileIdToDelete}_`;
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(prefixToRemove)) {
      keysToRemove.push(k);
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));

  // Update profile list
  const updatedList = profiles.filter(p => p.id !== profileIdToDelete);
  saveProfilesList(updatedList);

  // If deleted profile was active, switch to first remaining
  const currentActive = getActiveProfileId();
  let nextActiveId = currentActive;
  if (currentActive === profileIdToDelete) {
    nextActiveId = updatedList[0].id;
    setActiveProfileId(nextActiveId);
  }

  return { updatedList, nextActiveId };
}

// Legacy helpers for backwards compatibility
export function loadItem(key, defaultValue) {
  return loadProfileItem(getActiveProfileId(), key, defaultValue);
}

export function saveItem(key, value) {
  return saveProfileItem(getActiveProfileId(), key, value);
}

export function exportBackupData() {
  const activeId = getActiveProfileId();
  const backup = {
    exportedAt: new Date().toISOString(),
    version: '1.4.1',
    activeProfileId: activeId,
    profiles: getProfilesList(),
    data: {}
  };
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
      try {
        backup.data[key] = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        backup.data[key] = localStorage.getItem(key);
      }
    }
  }
  return backup;
}

export function importBackupData(backupJson) {
  try {
    const parsed = typeof backupJson === 'string' ? JSON.parse(backupJson) : backupJson;
    if (!parsed || !parsed.data) {
      throw new Error('Invalid backup file format');
    }
    
    Object.entries(parsed.data).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
    return true;
  } catch (err) {
    console.error("Backup import error:", err);
    return false;
  }
}

export function resetAllData() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
}
