// ui.js - Handle rendering tasks and UI updates

import { formatDuration } from './validators.js';
import { highlightMatches } from './search.js';
import { getTasks, getCurrentFilter, deleteTask } from './state.js';
import { saveTasks } from './storage.js';

// Render all tasks to both table and cards
export function renderTasks(tasks, searchQuery = '') {
  renderTable(tasks, searchQuery);
  renderCards(tasks, searchQuery);
  updateSearchResults(tasks.length);
}

// Render tasks to table (desktop view)
function renderTable(tasks, searchQuery) {
  const tbody = document.getElementById('tasks-table-body');
  
  if (!tbody) return;
  
  // Clear existing rows
  tbody.innerHTML = '';
  
  if (tasks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No tasks found. Try adding one!</td></tr>';
    return;
  }
  
  // Create a row for each task
  tasks.forEach(task => {
    const row = document.createElement('tr');
    
    // Apply highlighting to title
    const highlightedTitle = highlightMatches(task.title, searchQuery);
    const highlightedTag = highlightMatches(task.tag, searchQuery);
    
    row.innerHTML = `
      <td>${highlightedTitle}</td>
      <td>${task.dueDate}</td>
      <td>${formatDuration(task.duration)}</td>
      <td><span class="task-tag">${highlightedTag}</span></td>
      <td>
        <button class="btn btn-secondary edit-btn" data-id="${task.id}" 
                style="margin-right: 0.5rem; padding: 0.375rem 0.75rem; font-size: 0.875rem;">
          Edit
        </button>
        <button class="btn btn-danger delete-btn" data-id="${task.id}" 
                style="padding: 0.375rem 0.75rem; font-size: 0.875rem;">
          Delete
        </button>
      </td>
    `;
    
    tbody.appendChild(row);
  });
  
  // Add event listeners to buttons
  attachTableButtonListeners();
}

// Render tasks to cards (mobile view)
function renderCards(tasks, searchQuery) {
  const container = document.getElementById('tasks-cards');
  
  if (!container) return;
  
  // Clear existing cards
  container.innerHTML = '';
  
  if (tasks.length === 0) {
    container.innerHTML = '<div class="empty-state">No tasks found. Try adding one!</div>';
    return;
  }
  
  // Create a card for each task
  tasks.forEach(task => {
    const card = document.createElement('div');
    card.className = 'task-card';
    
    // Apply highlighting
    const highlightedTitle = highlightMatches(task.title, searchQuery);
    const highlightedTag = highlightMatches(task.tag, searchQuery);
    
    card.innerHTML = `
      <div class="task-card-title">${highlightedTitle}</div>
      <div class="task-card-meta">
        <span> ${task.dueDate}</span>
        <span> ${formatDuration(task.duration)}</span>
      </div>
      <div class="task-tag">${highlightedTag}</div>
      <div class="task-card-actions">
        <button class="btn btn-secondary edit-btn" data-id="${task.id}">Edit</button>
        <button class="btn btn-danger delete-btn" data-id="${task.id}">Delete</button>
      </div>
    `;
    
    container.appendChild(card);
  });
  
  // Add event listeners to buttons
  attachCardButtonListeners();
}

// Attach event listeners to table buttons
function attachTableButtonListeners() {
  // Edit buttons
  const editButtons = document.querySelectorAll('.tasks-table .edit-btn');
  editButtons.forEach(btn => {
    btn.addEventListener('click', handleEdit);
  });
  
  // Delete buttons
  const deleteButtons = document.querySelectorAll('.tasks-table .delete-btn');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', handleDelete);
  });
}

// Attach event listeners to card buttons
function attachCardButtonListeners() {
  // Edit buttons
  const editButtons = document.querySelectorAll('.tasks-cards .edit-btn');
  editButtons.forEach(btn => {
    btn.addEventListener('click', handleEdit);
  });
  
  // Delete buttons
  const deleteButtons = document.querySelectorAll('.tasks-cards .delete-btn');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', handleDelete);
  });
}

// Handle edit button click
function handleEdit(e) {
  const taskId = e.target.dataset.id;
  console.log('Edit task:', taskId);
  
  // Trigger edit mode (handled in app.js)
  const event = new CustomEvent('edit-task', { detail: { id: taskId } });
  document.dispatchEvent(event);
}

// Handle delete button click
function handleDelete(e) {
  const taskId = e.target.dataset.id;
  
  // Confirm deletion
  if (confirm('Are you sure you want to delete this task?')) {
    deleteTask(taskId);
    saveTasks(getTasks());
    
    // Re-render
    const event = new CustomEvent('tasks-updated');
    document.dispatchEvent(event);
    
    console.log('Task deleted:', taskId);
  }
}

// Update search results message
function updateSearchResults(count) {
  const resultsDiv = document.getElementById('search-results');
  if (resultsDiv) {
    if (count === 0) {
      resultsDiv.textContent = 'No tasks found';
    } else {
      resultsDiv.textContent = `Showing ${count} task${count === 1 ? '' : 's'}`;
    }
  }
}

// Update dashboard stats
export function updateDashboardStats(tasks) {
  // Total tasks
  const totalEl = document.getElementById('stat-total');
  if (totalEl) {
    totalEl.textContent = tasks.length;
  }
  
  // Total time
  const totalMinutes = tasks.reduce((sum, task) => sum + task.duration, 0);
  const totalTimeEl = document.getElementById('stat-time');
  if (totalTimeEl) {
    totalTimeEl.textContent = formatDuration(totalMinutes);
  }
  
  // Top tag
  const tagCounts = {};
  tasks.forEach(task => {
    tagCounts[task.tag] = (tagCounts[task.tag] || 0) + 1;
  });
  
  let topTag = '—';
  let maxCount = 0;
  for (const tag in tagCounts) {
    if (tagCounts[tag] > maxCount) {
      maxCount = tagCounts[tag];
      topTag = tag;
    }
  }
  
  const topTagEl = document.getElementById('stat-tag');
  if (topTagEl) {
    topTagEl.textContent = topTag;
  }
  
  // This week's time
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  
  const thisWeekTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return taskDate >= weekAgo && taskDate <= today;
  });
  
  const weekMinutes = thisWeekTasks.reduce((sum, task) => sum + task.duration, 0);
  const weekTimeEl = document.getElementById('stat-week');
  if (weekTimeEl) {
    weekTimeEl.textContent = formatDuration(weekMinutes);
  }
  
  // Update cap progress
  updateCapProgress(weekMinutes);
}

// Update weekly cap progress bar
function updateCapProgress(weekMinutes) {
  // Get cap from settings (default 40 hours)
  let capMaxHours = 40;
  try {
    const settings = JSON.parse(localStorage.getItem('campusPlanner_settings') || '{}');
    capMaxHours = settings.weeklyCap || 40;
  } catch (e) {
    capMaxHours = 40;
  }
  
  const capMax = capMaxHours * 60; // Convert to minutes
  const weekHours = Math.round(weekMinutes / 60);
  
  const percentage = Math.min((weekMinutes / capMax) * 100, 100);
  
  const fillEl = document.getElementById('cap-fill');
  const currentEl = document.getElementById('cap-current');
  const statusEl = document.getElementById('cap-status');
  
  if (fillEl) {
    fillEl.style.width = percentage + '%';
    fillEl.setAttribute('aria-valuenow', percentage);
    
    // Change color based on usage
    if (percentage >= 100) {
      fillEl.className = 'cap-fill danger';
    } else if (percentage >= 90) {
      fillEl.className = 'cap-fill warning';
    } else {
      fillEl.className = 'cap-fill';
    }
  }
  
  if (currentEl) {
    currentEl.textContent = weekHours;
  }
  
  if (statusEl) {
    const remaining = capMaxHours - weekHours;
    
    if (remaining > 0) {
      statusEl.textContent = `You have ${remaining} hours remaining this week`;
      statusEl.className = 'cap-status';
      statusEl.setAttribute('aria-live', 'polite');
    } else if (remaining === 0) {
      statusEl.textContent = 'You have reached your weekly cap';
      statusEl.className = 'cap-status warning';
      statusEl.setAttribute('aria-live', 'assertive');
    } else {
      statusEl.textContent = `You are ${Math.abs(remaining)} hours over your weekly cap!`;
      statusEl.className = 'cap-status danger';
      statusEl.setAttribute('aria-live', 'assertive');
    }
  }
}
