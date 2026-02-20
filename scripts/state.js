// state.js file manages task data in memory

// Global state - stores all tasks
let tasks = [];
let currentFilter = '';
let currentSort = 'date-desc';

// Generate unique ID for new tasks
function generateId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `task_${timestamp}_${random}`;
}

// Get all tasks
export function getTasks() {
  return tasks;
}

// Add a new task
export function addTask(taskData) {
  const newTask = {
    id: generateId(),
    title: taskData.title,
    dueDate: taskData.dueDate,
    duration: parseFloat(taskData.duration),
    tag: taskData.tag,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  console.log('Task added:', newTask);
  return newTask;
}

// Update existing task
export function updateTask(id, taskData) {
  const index = tasks.findIndex(t => t.id === id);
  
  if (index !== -1) {
    tasks[index] = {
      ...tasks[index],
      title: taskData.title,
      dueDate: taskData.dueDate,
      duration: parseFloat(taskData.duration),
      tag: taskData.tag,
      updatedAt: new Date().toISOString()
    };
    console.log('Task updated:', tasks[index]);
    return tasks[index];
  }
  
  return null;
}

// Delete a task
export function deleteTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  
  if (index !== -1) {
    const deleted = tasks.splice(index, 1)[0];
    console.log('Task deleted:', deleted);
    return deleted;
  }
  
  return null;
}

// Get task by ID
export function getTaskById(id) {
  return tasks.find(t => t.id === id);
}

// Set all tasks (used when loading from storage)
export function setTasks(newTasks) {
  tasks = newTasks;
  console.log('Tasks loaded:', tasks.length);
}

// Clear all tasks
export function clearAllTasks() {
  tasks = [];
  console.log('All tasks cleared');
}

// Get current filter
export function getCurrentFilter() {
  return currentFilter;
}

// Set current filter
export function setCurrentFilter(filter) {
  currentFilter = filter;
}

// Get current sort
export function getCurrentSort() {
  return currentSort;
}

// Set current sort
export function setCurrentSort(sort) {
  currentSort = sort;
}
