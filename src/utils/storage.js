// Comprehensive Local Storage & State Persistence Manager

const STORAGE_KEY_PREFIX = 'GATE_MATRIX_2027_';

export function loadItem(key, defaultValue) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading key ${key} from localStorage:`, err);
    return defaultValue;
  }
}

export function saveItem(key, value) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key ${key} to localStorage:`, err);
  }
}

export function exportBackupData() {
  const backup = {
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    data: {}
  };
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
      const cleanKey = key.replace(STORAGE_KEY_PREFIX, '');
      try {
        backup.data[cleanKey] = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        backup.data[cleanKey] = localStorage.getItem(key);
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
      saveItem(key, value);
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
