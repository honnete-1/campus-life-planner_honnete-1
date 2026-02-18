// search.js - Regex search and highlighting

// Try to compile regex pattern safely
export function compileRegex(pattern, caseInsensitive = true) {
  if (!pattern || pattern.trim() === '') {
    return null;
  }
  
  try {
    const flags = caseInsensitive ? 'gi' : 'g';
    const regex = new RegExp(pattern, flags);
    return regex;
  } catch (error) {
    console.error('Invalid regex pattern:', error);
    return null;
  }
}

// Check for special search commands
export function parseSearchCommand(query) {
  // @tag:TagName - search by specific tag
  if (query.startsWith('@tag:')) {
    const tagName = query.substring(5).trim();
    return {
      type: 'tag',
      value: tagName
    };
  }
  
  // !overdue - show overdue tasks
  if (query.toLowerCase() === '!overdue') {
    return {
      type: 'overdue'
    };
  }
  
  // Regular regex search
  return {
    type: 'regex',
    value: query
  };
}

// Filter tasks based on search query
export function filterTasks(tasks, searchQuery, caseInsensitive = true) {
  if (!searchQuery || searchQuery.trim() === '') {
    return tasks;
  }
  
  const command = parseSearchCommand(searchQuery);
  
  // Handle tag filter
  if (command.type === 'tag') {
    return tasks.filter(task => 
      task.tag.toLowerCase() === command.value.toLowerCase()
    );
  }
  
  // Handle overdue filter
  if (command.type === 'overdue') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < today;
    });
  }
  
  // Handle regex search
  const regex = compileRegex(searchQuery, caseInsensitive);
  if (!regex) {
    return tasks; // Invalid regex, show all
  }
  
  // Search in title, tag, and date
  return tasks.filter(task => {
    return regex.test(task.title) || 
           regex.test(task.tag) || 
           regex.test(task.dueDate);
  });
}

// Highlight matches in text with <mark> tags
export function highlightMatches(text, searchQuery, caseInsensitive = true) {
  if (!text || !searchQuery || searchQuery.trim() === '') {
    return text;
  }
  
  // Don't highlight for special commands
  const command = parseSearchCommand(searchQuery);
  if (command.type !== 'regex') {
    return text;
  }
  
  const regex = compileRegex(searchQuery, caseInsensitive);
  if (!regex) {
    return text;
  }
  
  // Replace matches with <mark> tags
  return text.replace(regex, match => `<mark>${match}</mark>`);
}

// Sort tasks
export function sortTasks(tasks, sortBy) {
  const sorted = [...tasks]; // Make a copy
  
  switch (sortBy) {
    case 'date-asc':
      sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      break;
      
    case 'date-desc':
      sorted.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
      break;
      
    case 'title-asc':
      sorted.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
      break;
      
    case 'title-desc':
      sorted.sort((a, b) => b.title.toLowerCase().localeCompare(a.title.toLowerCase()));
      break;
      
    case 'duration-asc':
      sorted.sort((a, b) => a.duration - b.duration);
      break;
      
    case 'duration-desc':
      sorted.sort((a, b) => b.duration - a.duration);
      break;
      
    default:
      // Default: newest first
      sorted.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  }
  
  return sorted;
}
