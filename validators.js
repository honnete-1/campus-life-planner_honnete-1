// validators.js - Regex patterns and validation for Campus Life Planner

// Regex patterns for form validation
// 1. Title - no leading/trailing spaces or double spaces
export const TITLE_REGEX = /^\S(?:.*\S)?$/;

// 2. Duration - positive number with optional decimals (max 2 places)
export const DURATION_REGEX = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

// 3. Date - YYYY-MM-DD format
export const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// 4. Tag - letters, spaces, and hyphens only
export const TAG_REGEX = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

// 5. ADVANCED - Duplicate word detector using backreference
// This uses \1 to match the same word twice (like "the the")
export const DUPLICATE_WORD_REGEX = /\b(\w+)\s+\1\b/i;

// Validate title field
export function validateTitle(title) {
  // Check if empty
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Title is required' };
  }
  
  // Check regex pattern
  if (!TITLE_REGEX.test(title)) {
    return { valid: false, error: 'Title cannot have leading/trailing spaces or double spaces' };
  }
  
  // Check for duplicate words (just a warning, not an error)
  const duplicateMatch = DUPLICATE_WORD_REGEX.exec(title);
  if (duplicateMatch) {
    return { 
      valid: true, 
      warning: `Possible duplicate word: "${duplicateMatch[1]}"` 
    };
  }
  
  // Check length
  if (title.length < 3) {
    return { valid: false, error: 'Title must be at least 3 characters' };
  }
  
  if (title.length > 100) {
    return { valid: false, error: 'Title is too long (max 100 characters)' };
  }
  
  return { valid: true };
}

// Validate duration field
export function validateDuration(duration) {
  if (!duration || duration.trim().length === 0) {
    return { valid: false, error: 'Duration is required' };
  }
  
  if (!DURATION_REGEX.test(duration)) {
    return { valid: false, error: 'Duration must be a positive number' };
  }
  
  const num = parseFloat(duration);
  
  if (num === 0) {
    return { valid: false, error: 'Duration must be greater than 0' };
  }
  
  if (num > 1440) {
    return { valid: false, error: 'Duration cannot exceed 1440 minutes (24 hours)' };
  }
  
  return { valid: true };
}

// Validate date field
export function validateDate(date) {
  if (!date || date.trim().length === 0) {
    return { valid: false, error: 'Date is required' };
  }
  
  if (!DATE_REGEX.test(date)) {
    return { valid: false, error: 'Date must be in YYYY-MM-DD format' };
  }
  
  // Check if it's a real date
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: 'Invalid date' };
  }
  
  return { valid: true };
}

// Validate tag field
export function validateTag(tag) {
  if (!tag || tag.trim().length === 0) {
    return { valid: false, error: 'Tag is required' };
  }
  
  if (!TAG_REGEX.test(tag)) {
    return { valid: false, error: 'Tag can only contain letters, spaces, and hyphens' };
  }
  
  if (tag.length > 30) {
    return { valid: false, error: 'Tag is too long (max 30 characters)' };
  }
  
  return { valid: true };
}

// Validate the whole form at once
export function validateTaskForm(formData) {
  const errors = {};
  let isValid = true;
  
  // Validate title
  const titleResult = validateTitle(formData.title);
  if (!titleResult.valid) {
    errors.title = titleResult.error;
    isValid = false;
  } else if (titleResult.warning) {
    errors.titleWarning = titleResult.warning;
  }
  
  // Validate date
  const dateResult = validateDate(formData.dueDate);
  if (!dateResult.valid) {
    errors.dueDate = dateResult.error;
    isValid = false;
  }
  
  // Validate duration
  const durationResult = validateDuration(formData.duration);
  if (!durationResult.valid) {
    errors.duration = durationResult.error;
    isValid = false;
  }
  
  // Validate tag
  const tagResult = validateTag(formData.tag);
  if (!tagResult.valid) {
    errors.tag = tagResult.error;
    isValid = false;
  }
  
  return { valid: isValid, errors };
}

// Helper function to convert minutes to hours/minutes display
export function formatDuration(minutes) {
  const num = parseFloat(minutes);
  
  if (isNaN(num) || num <= 0) {
    return '';
  }
  
  const hours = Math.floor(num / 60);
  const mins = Math.round(num % 60);
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
}

// Helper to clean up user input
export function sanitizeInput(str) {
  if (!str) return '';
  return str.trim().replace(/\s+/g, ' ');
}

// Export patterns for testing
export const REGEX_PATTERNS = {
  title: TITLE_REGEX,
  duration: DURATION_REGEX,
  date: DATE_REGEX,
  tag: TAG_REGEX,
  duplicateWord: DUPLICATE_WORD_REGEX
};
