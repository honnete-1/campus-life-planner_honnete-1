/* ═══════════════════════════════════════════════════════════════════
   CAMPUS LIFE PLANNER - APP.JS
   Entry point for the application
   ═══════════════════════════════════════════════════════════════════ */

import {
  validateTitle,
  validateDuration,
  validateDate,
  validateTag,
  validateTaskForm,
  formatDuration,
  sanitizeInput
} from './validators.js';

import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  getTaskById,
  setTasks,
  clearAllTasks,
  getCurrentFilter,
  setCurrentFilter,
  getCurrentSort,
  setCurrentSort
} from './state.js';

import {
  loadTasks,
  saveTasks,
  loadSettings,
  saveSettings
} from './storage.js';

import {
  filterTasks,
  sortTasks
} from './search.js';

import {
  renderTasks,
  updateDashboardStats
} from './ui.js';

// Track if we're in edit mode
let editingTaskId = null;

/* ───────────────────────────────────────────────────────────────────
   SECTION NAVIGATION
   ─────────────────────────────────────────────────────────────────── */

/**
 * Switch between sections when nav tabs are clicked
 */
function initNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.section');
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  // Handle nav tab clicks
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetSection = tab.dataset.section;
      
      // Update active tab
      navTabs.forEach(t => {
        t.classList.remove('active');
        t.removeAttribute('aria-current');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-current', 'page');
      
      // Show target section, hide others
      sections.forEach(section => {
        section.classList.remove('active');
      });
      
      const activeSection = document.getElementById(targetSection);
      if (activeSection) {
        activeSection.classList.add('active');
        
        // Focus on the section heading for screen readers
        const heading = activeSection.querySelector('h2');
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus();
          heading.removeAttribute('tabindex');
        }
      }
      
      // Close mobile menu after selection
      if (window.innerWidth < 768) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
  
  // Handle mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 768) {
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
  
  // Close mobile menu on window resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ───────────────────────────────────────────────────────────────────
   SEARCH AND SORT (M4)
   ─────────────────────────────────────────────────────────────────── */

function initSearchAndSort() {
  const searchInput = document.getElementById('search-input');
  const searchCase = document.getElementById('search-case');
  const sortSelect = document.getElementById('sort-select');
  
  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value;
      setCurrentFilter(query);
      loadAndRenderTasks();
    });
  }
  
  // Case sensitive toggle
  if (searchCase) {
    searchCase.addEventListener('change', () => {
      loadAndRenderTasks();
    });
  }
  
  // Sort dropdown
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const sortBy = sortSelect.value;
      setCurrentSort(sortBy);
      loadAndRenderTasks();
    });
  }
}

/* ───────────────────────────────────────────────────────────────────
   EDIT TASK (M4)
   ─────────────────────────────────────────────────────────────────── */

function startEditMode(taskId) {
  const task = getTaskById(taskId);
  if (!task) return;
  
  editingTaskId = taskId;
  
  // Fill form with task data
  document.getElementById('task-title').value = task.title;
  document.getElementById('task-date').value = task.dueDate;
  document.getElementById('task-duration').value = task.duration;
  document.getElementById('task-tag').value = task.tag;
  
  // Update duration display
  const converted = document.getElementById('duration-converted');
  converted.textContent = `≈ ${formatDuration(task.duration)}`;
  
  // Change heading
  const heading = document.getElementById('add-heading');
  if (heading) {
    heading.textContent = 'Edit Task';
  }
  
  // Change button text
  const submitBtn = document.querySelector('#task-form button[type="submit"]');
  if (submitBtn) {
    submitBtn.textContent = 'Update Task';
  }
  
  // Switch to add-task section
  const addTab = document.querySelector('[data-section="add-task"]');
  if (addTab) {
    addTab.click();
  }
  
  console.log('Editing task:', taskId);
}

function cancelEditMode() {
  editingTaskId = null;
  
  // Reset heading
  const heading = document.getElementById('add-heading');
  if (heading) {
    heading.textContent = 'Add Task';
  }
  
  // Reset button text
  const submitBtn = document.querySelector('#task-form button[type="submit"]');
  if (submitBtn) {
    submitBtn.textContent = 'Save Task';
  }
}

// Listen for edit events from ui.js
document.addEventListener('edit-task', (e) => {
  startEditMode(e.detail.id);
});

// Listen for tasks updated events
document.addEventListener('tasks-updated', () => {
  loadAndRenderTasks();
});

/**
 * Enable keyboard shortcuts for quick section navigation
 * Alt+1 = About, Alt+2 = Dashboard, Alt+3 = Tasks, Alt+4 = Add, Alt+5 = Settings
 */
function initKeyboardShortcuts() {
  const sectionMap = {
    '1': 'about',
    '2': 'dashboard',
    '3': 'tasks',
    '4': 'add-task',
    '5': 'settings'
  };
  
  document.addEventListener('keydown', (e) => {
    // Alt + Number (1-5)
    if (e.altKey && sectionMap[e.key]) {
      e.preventDefault();
      const targetSection = sectionMap[e.key];
      const targetTab = document.querySelector(`[data-section="${targetSection}"]`);
      
      if (targetTab) {
        targetTab.click();
      }
    }
  });
}

/* ───────────────────────────────────────────────────────────────────
   LOAD AND RENDER TASKS (M4)
   ─────────────────────────────────────────────────────────────────── */

function loadAndRenderTasks() {
  // Get current search and sort
  const searchQuery = getCurrentFilter();
  const sortBy = getCurrentSort();
  
  // Get all tasks
  let tasks = getTasks();
  
  // Apply filter
  const searchInput = document.getElementById('search-input');
  const caseInsensitive = document.getElementById('search-case')?.checked ?? true;
  
  if (searchQuery) {
    tasks = filterTasks(tasks, searchQuery, caseInsensitive);
  }
  
  // Apply sort
  tasks = sortTasks(tasks, sortBy);
  
  // Render
  renderTasks(tasks, searchQuery);
  updateDashboardStats(getTasks()); // Stats use all tasks, not filtered
}

// Form validation functions
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorDiv = document.getElementById(`${fieldId.replace('task-', '')}-error`);
  
  if (field && errorDiv) {
    field.setAttribute('aria-invalid', 'true');
    errorDiv.textContent = message;
  }
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorDiv = document.getElementById(`${fieldId.replace('task-', '')}-error`);
  
  if (field && errorDiv) {
    field.removeAttribute('aria-invalid');
    errorDiv.textContent = '';
  }
}

function initFormValidation() {
  const form = document.getElementById('task-form');
  const titleField = document.getElementById('task-title');
  const dateField = document.getElementById('task-date');
  const durationField = document.getElementById('task-duration');
  const tagField = document.getElementById('task-tag');
  const formStatus = document.getElementById('form-status');
  const cancelBtn = document.getElementById('cancel-btn');
  
  // Show duration conversion as user types
  if (durationField) {
    const converted = document.getElementById('duration-converted');
    durationField.addEventListener('input', () => {
      const mins = durationField.value;
      if (mins && !isNaN(mins)) {
        const display = formatDuration(mins);
        converted.textContent = display ? `≈ ${display}` : '';
      } else {
        converted.textContent = '';
      }
    });
  }
  
  // Validate when user leaves each field
  if (titleField) {
    titleField.addEventListener('blur', () => {
      const result = validateTitle(titleField.value);
      if (!result.valid) {
        showError('task-title', result.error);
      } else {
        clearError('task-title');
        // Show warning if there's one
        if (result.warning) {
          const errorDiv = document.getElementById('title-error');
          errorDiv.textContent = `⚠️ ${result.warning}`;
          errorDiv.style.color = '#f59e0b';
        }
      }
      // Clean up extra spaces
      titleField.value = sanitizeInput(titleField.value);
    });
  }
  
  if (dateField) {
    dateField.addEventListener('blur', () => {
      const result = validateDate(dateField.value);
      if (!result.valid) {
        showError('task-date', result.error);
      } else {
        clearError('task-date');
      }
    });
  }
  
  if (durationField) {
    durationField.addEventListener('blur', () => {
      const result = validateDuration(durationField.value);
      if (!result.valid) {
        showError('task-duration', result.error);
      } else {
        clearError('task-duration');
      }
    });
  }
  
  if (tagField) {
    tagField.addEventListener('blur', () => {
      const result = validateTag(tagField.value);
      if (!result.valid) {
        showError('task-tag', result.error);
      } else {
        clearError('task-tag');
      }
    });
  }
  
  // Handle form submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Clear old status
      formStatus.textContent = '';
      formStatus.className = 'form-status';
      
      // Get form data
      const formData = {
        title: titleField.value,
        dueDate: dateField.value,
        duration: durationField.value,
        tag: tagField.value
      };
      
      // Validate everything
      const validation = validateTaskForm(formData);
      
      if (!validation.valid) {
        // Show errors
        if (validation.errors.title) {
          showError('task-title', validation.errors.title);
        }
        if (validation.errors.dueDate) {
          showError('task-date', validation.errors.dueDate);
        }
        if (validation.errors.duration) {
          showError('task-duration', validation.errors.duration);
        }
        if (validation.errors.tag) {
          showError('task-tag', validation.errors.tag);
        }
        
        // Count errors
        let errorCount = 0;
        for (let key in validation.errors) {
          if (!key.includes('Warning')) {
            errorCount++;
          }
        }
        
        formStatus.textContent = `Please fix ${errorCount} error(s) before saving`;
        formStatus.className = 'form-status error';
        
        // Focus first error
        if (validation.errors.title) {
          titleField.focus();
        } else if (validation.errors.dueDate) {
          dateField.focus();
        } else if (validation.errors.duration) {
          durationField.focus();
        } else if (validation.errors.tag) {
          tagField.focus();
        }
      } else {
        // Success! Save the task
        if (editingTaskId) {
          // Update existing task
          updateTask(editingTaskId, formData);
          formStatus.textContent = '✅ Task updated successfully!';
          cancelEditMode();
        } else {
          // Add new task
          addTask(formData);
          formStatus.textContent = '✅ Task added successfully!';
        }
        
        formStatus.className = 'form-status success';
        
        // Save to localStorage
        saveTasks(getTasks());
        
        // Update UI
        loadAndRenderTasks();
        
        console.log('Form saved:', formData);
        
        // Clear form and switch to tasks view
        setTimeout(() => {
          form.reset();
          formStatus.textContent = '';
          document.getElementById('duration-converted').textContent = '';
          
          // Go to tasks section
          const tasksTab = document.querySelector('[data-section="tasks"]');
          if (tasksTab) tasksTab.click();
        }, 1500);
      }
    });
  }
  
  // Cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      form.reset();
      clearError('task-title');
      clearError('task-date');
      clearError('task-duration');
      clearError('task-tag');
      formStatus.textContent = '';
      document.getElementById('duration-converted').textContent = '';
      
      // Cancel edit mode if active
      cancelEditMode();
      
      // Go back to tasks section
      const tasksTab = document.querySelector('[data-section="tasks"]');
      if (tasksTab) tasksTab.click();
    });
  }
}

/* ───────────────────────────────────────────────────────────────────
   SETTINGS (M5/M6)
   ─────────────────────────────────────────────────────────────────── */

function initSettings() {
  const weeklyCap = document.getElementById('weekly-cap');
  const unitMinutes = document.getElementById('unit-minutes');
  const unitHours = document.getElementById('unit-hours');
  const exportBtn = document.getElementById('export-btn');
  const importFile = document.getElementById('import-file');
  const clearBtn = document.getElementById('clear-data-btn');
  const settingsStatus = document.getElementById('settings-status');
  
  // Load saved settings
  const settings = loadSettings();
  if (weeklyCap) {
    weeklyCap.value = settings.weeklyCap || 40;
  }
  if (settings.durationUnit === 'hours' && unitHours) {
    unitHours.checked = true;
  }
  
  // Save weekly cap when changed
  if (weeklyCap) {
    weeklyCap.addEventListener('change', () => {
      const cap = parseInt(weeklyCap.value);
      if (cap > 0 && cap <= 168) {
        const settings = loadSettings();
        settings.weeklyCap = cap;
        saveSettings(settings);
        
        // Update cap display
        const capMaxEl = document.getElementById('cap-max');
        if (capMaxEl) {
          capMaxEl.textContent = cap;
        }
        
        // Recalculate and show message
        loadAndRenderTasks();
        settingsStatus.textContent = `Weekly cap updated to ${cap} hours`;
        setTimeout(() => settingsStatus.textContent = '', 3000);
      }
    });
  }
  
  // Duration unit toggle
  if (unitMinutes && unitHours) {
    const updateUnit = () => {
      const settings = loadSettings();
      settings.durationUnit = unitHours.checked ? 'hours' : 'minutes';
      saveSettings(settings);
      
      loadAndRenderTasks(); // Re-render with new unit
      settingsStatus.textContent = `Duration display changed to ${settings.durationUnit}`;
      setTimeout(() => settingsStatus.textContent = '', 3000);
    };
    
    unitMinutes.addEventListener('change', updateUnit);
    unitHours.addEventListener('change', updateUnit);
  }
  
  // Export JSON
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const tasks = getTasks();
      const dataStr = JSON.stringify(tasks, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `campus-planner-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      settingsStatus.textContent = `Exported ${tasks.length} tasks`;
      setTimeout(() => settingsStatus.textContent = '', 3000);
    });
  }
  
  // Import JSON
  if (importFile) {
    importFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          
          // Basic validation
          if (!Array.isArray(imported)) {
            alert('Invalid file: must be an array of tasks');
            return;
          }
          
          // Check if tasks have required fields
          const valid = imported.every(task => 
            task.title && task.dueDate && task.duration && task.tag
          );
          
          if (!valid) {
            alert('Invalid file: tasks missing required fields');
            return;
          }
          
          // Confirm before replacing
          if (confirm(`Import ${imported.length} tasks? This will replace existing data.`)) {
            setTasks(imported);
            saveTasks(imported);
            loadAndRenderTasks();
            
            settingsStatus.textContent = `Imported ${imported.length} tasks successfully!`;
            setTimeout(() => settingsStatus.textContent = '', 3000);
          }
        } catch (error) {
          alert('Error reading file: ' + error.message);
        }
      };
      
      reader.readAsText(file);
      importFile.value = ''; // Reset input
    });
  }
  
  // Clear all data
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure? This will delete ALL tasks permanently!')) {
        if (confirm('Really sure? This cannot be undone!')) {
          clearAllTasks();
          saveTasks([]);
          loadAndRenderTasks();
          
          settingsStatus.textContent = 'All data cleared';
          setTimeout(() => settingsStatus.textContent = '', 3000);
        }
      }
    });
  }
}

/* ───────────────────────────────────────────────────────────────────
   KEYBOARD SHORTCUTS
   ─────────────────────────────────────────────────────────────────── */

/* ───────────────────────────────────────────────────────────────────
   INITIALIZATION
   ─────────────────────────────────────────────────────────────────── */

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Campus Life Planner - M5 Initialized');
  
  // Load tasks from localStorage
  const savedTasks = loadTasks();
  setTasks(savedTasks);
  
  // Load settings and update cap display
  const settings = loadSettings();
  const capMaxEl = document.getElementById('cap-max');
  if (capMaxEl) {
    capMaxEl.textContent = settings.weeklyCap || 40;
  }
  
  // Set up navigation
  initNavigation();
  
  // Set up keyboard shortcuts
  initKeyboardShortcuts();
  
  // Set up form validation (M3)
  initFormValidation();
  
  // Set up search and sort (M4)
  initSearchAndSort();
  
  // Set up settings (M5/M6)
  initSettings();
  
  // Initial render
  loadAndRenderTasks();
  
  console.log('✅ Navigation ready');
  console.log('✅ Keyboard shortcuts enabled (Alt+1 through Alt+5)');
  console.log('✅ Form validation enabled (M3)');
  console.log('✅ Search, sort, and CRUD enabled (M4)');
  console.log('✅ Stats and cap tracking enabled (M5)');
  console.log(`✅ Loaded ${savedTasks.length} tasks from storage`);
});
