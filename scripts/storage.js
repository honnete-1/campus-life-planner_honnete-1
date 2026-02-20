// storage.js - Handle localStorage save/load

const STORAGE_KEY = 'campusPlanner_tasks';
const SETTINGS_KEY = 'campusPlanner_settings';

// Load tasks from localStorage
export function loadTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const tasks = JSON.parse(data);
      console.log('Loaded tasks from storage:', tasks.length);
      return tasks;
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
  return [];
}

// Save tasks to localStorage
export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    console.log('Tasks saved to storage:', tasks.length);
    return true;
  } catch (error) {
    console.error('Error saving tasks:', error);
    return false;
  }
}

// Load settings from localStorage
export function loadSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  
  // Default settings
  return {
    weeklyCap: 40,
    durationUnit: 'minutes'
  };
}

// Save settings to localStorage
export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    console.log('Settings saved');
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

// Clear all data
export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    console.log('Storage cleared');
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
}
