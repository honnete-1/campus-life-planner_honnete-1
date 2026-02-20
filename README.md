# Campus Life Planner 

> A responsive, accessible web application for managing student tasks and time. It is a mobile‑first, accessible Campus Life Planner that helps students plan tasks and events using durations, tags, sorting, and live regex search. The app demonstrates semantic HTML, responsive layouts, DOM manipulation, safe regex handling, localStorage persistence, and accessibility best practices.

**Live Demo:** (https://honnete-1.github.io/campus-life-planner_honnete-1/) 
**Video Demo:** (https://www.loom.com/share/ed2bef8797bb4b8eb6ddbd9fd664fb0b)

---

## Project Overview

**Theme:** Campus Life Planner  
**Purpose:** Help students organize tasks, track time, and manage weekly schedules

**Key Features:**
- Add, edit, delete tasks with validation
- Regex-powered search with highlighting
- Sort by date, title, or duration
- Dashboard with live statistics
- Weekly time cap tracking
- Import/export JSON data
- Fully keyboard accessible
- Responsive design (mobile, tablet, desktop)
- localStorage persistence

---

## Table of Contents

1. [Features](#features)
2. [Regex Patterns](#regex-patterns)
3. [Keyboard Navigation](#keyboard-navigation)
4. [Accessibility](#accessibility)
5. [File Structure](#file-structure)
6. [How to Run](#how-to-run)
7. [Testing](#testing)
8. [Technologies Used](#technologies-used)
9. [Browser Support](#browser-support)

---

## Features

### 1. Task Management (CRUD)
- **Add:** Fill form with validation → Task saved
- **Edit:** Click "Edit" → Update task → Saved
- **Delete:** Click "Delete" → Confirm → Task removed
- **Auto-save:** All changes persist to localStorage

### 2. Advanced Search
- **Regex search:** Type any pattern, see highlighted results
- **Special commands:**
  - `@tag:Academic` - Filter by tag
  - `!overdue` - Show overdue tasks
- **Highlighting:** Matches shown with `<mark>` tags
- **Safe:** Try-catch prevents crashes on invalid regex

### 3. Sorting
- Due Date (Newest/Oldest)
- Title (A-Z / Z-A)
- Duration (Shortest/Longest)

### 4. Dashboard Statistics
- **Total Tasks:** Count of all tasks
- **Total Time:** Sum of all durations
- **Top Tag:** Most used category
- **This Week:** Tasks due in next 7 days
- Updates automatically when data changes

### 5. Weekly Cap System
- Set custom weekly time limit (1-168 hours)
- Visual progress bar (green → yellow → red)
- ARIA live announcements
- Shows hours remaining or overage

### 6. Data Management
- **Export:** Download tasks as JSON
- **Import:** Upload JSON with validation
- **Clear:** Delete all data (double confirmation)
- **Persist:** Auto-saves to localStorage

### 7. Responsive Design
- **Mobile (≤360px):** Card view, hamburger menu
- **Tablet (≥768px):** Table view, horizontal nav
- **Desktop (≥1024px):** Full layout, side-by-side

---

## Regex Patterns

### Validation Patterns (5 total)

| # | Pattern | Purpose | Example Valid | Example Invalid |
|---|---------|---------|---------------|-----------------|
| 1 | `/^\S(?:.*\S)?$/` | Title - no extra spaces | "Study for exam" | " extra space" |
| 2 | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | Duration - positive decimal | "90", "120.5" | "01", "-5" |
| 3 | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | Date - YYYY-MM-DD | "2025-10-15" | "2025-13-01" |
| 4 | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Tag - letters, spaces, hyphens | "Academic", "Self-care" | "Tag123" |
| 5 | `/\b(\w+)\s+\1\b/i` | **ADVANCED** - Duplicate words (backreference) | "the the meeting" | "study hall" |

### Search Patterns

- **General regex:** Any valid pattern (e.g., `chemistry`, `\b\d{2}:\d{2}\b`)
- **Tag filter:** `@tag:TagName`
- **Overdue:** `!overdue`

All regex patterns tested in `tests.html` with 22 automated test cases.

---

## Keyboard Navigation

### Shortcuts
| Key | Action |
|-----|--------|
| `Tab` / `Shift+Tab` | Navigate between elements |
| `Enter` / `Space` | Activate buttons/links |
| `Escape` | Cancel edit mode |
| `Alt+1` | Jump to About |
| `Alt+2` | Jump to Dashboard |
| `Alt+3` | Jump to My Tasks |
| `Alt+4` | Jump to Add Task |
| `Alt+5` | Jump to Settings |

### Keyboard Flow
1. **Skip link** (first Tab press)
2. **Navigation tabs**
3. **Search and sort controls**
4. **Task table/cards**
5. **Edit/Delete buttons**
6. **Form inputs**
7. **Footer links**

All interactive elements reachable, visible focus indicators throughout.

---

## Accessibility

### WCAG AA Compliance

**Semantic HTML:**
- Proper landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`)
- Heading hierarchy (h1 → h2 → h3)
- Skip-to-content link
- All sections labeled with `aria-labelledby`

**Keyboard Support:**
- Fully keyboard navigable
- Visible focus (2px blue outline)
- No keyboard traps
- Logical tab order

**ARIA Attributes:**
- `aria-current="page"` on active nav
- `aria-expanded` on mobile menu
- `aria-required` on form fields
- `aria-invalid` on error fields
- `aria-live` regions for dynamic updates
- `role="alert"` for errors
- `role="status"` for announcements

**Color Contrast:**
- Text: 16.31:1 (exceeds AA requirement)
- Links: 8.59:1 (exceeds AA requirement)
- Buttons: 8.59:1 (exceeds AA requirement)
- Errors: 7.53:1 (exceeds AA requirement)

**Motion:**
- `prefers-reduced-motion` respected
- Animations short (<0.5s)
- Not essential for functionality

Full audit available in `ACCESSIBILITY-AUDIT.md`.

---

## File Structure

```
campus-planner/
├── index.html                 # Main application
├── tests.html                 # Regex validation tests
├── seed.json                  # Sample data (12 tasks)
├── README.md                  # This file
├── ACCESSIBILITY-AUDIT.md     # A11y checklist
├── DEMO-VIDEO-SCRIPT.md       # Video recording guide
├── styles/
│   ├── main.css              # Variables, reset, base styles
│   ├── layout.css            # Responsive layout
│   └── animations.css        # Transitions & animations
└── scripts/
    ├── validators.js         # Regex patterns & validation
    ├── state.js              # Task state management
    ├── storage.js            # localStorage operations
    ├── search.js             # Search, filter, sort
    ├── ui.js                 # Rendering & DOM updates
    └── app.js                # Main initialization
```

---

## How to Run

### Option 1: GitHub Pages (Recommended)
1. Push code to GitHub
2. Enable GitHub Pages in Settings
3. Visit your GitHub Pages URL

### Option 2: Local Development
1. Clone/download repository
2. Open `index.html` in browser
3. No build process required!

### Loading Sample Data
1. Go to Settings tab
2. Click "Import JSON"
3. Select `seed.json`
4. Confirm import

---

## Testing

### Automated Tests
```bash
# Open in browser
open tests.html

# See 22/22 tests pass
```

Tests cover:
- Title validation (5 tests)
- Duration validation (5 tests)
- Date validation (5 tests)
- Tag validation (5 tests)
- Duplicate word detection (4 tests)

### Manual Testing
1. **Form validation:** Try invalid inputs
2. **Search:** Test regex patterns
3. **Sort:** Change sort order
4. **CRUD:** Add/edit/delete tasks
5. **Persistence:** Refresh page, tasks remain
6. **Keyboard:** Navigate with Tab only
7. **Responsive:** Resize window
8. **Import/Export:** Test JSON files

---

## Technologies Used

### Core
- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, Variables, Media Queries
- **JavaScript (ES6)** - Modules, Arrow functions, Promises

### Features
- **localStorage API** - Data persistence
- **Regular Expressions** - Validation & search
- **FileReader API** - Import/export
- **ARIA** - Accessibility

### No Dependencies
- No frameworks (no React, Vue, Angular)
- No libraries (no jQuery, Bootstrap)
- Pure vanilla JavaScript
- Native CSS (no preprocessors)

---

## Browser Support

### Tested & Working
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

### Features Used
- ES6 Modules (2015)
- CSS Grid (2017)
- Flexbox (2012)
- localStorage (2009)
- ARIA (WCAG 2.1)

All features have >95% browser support.

---

## Milestones Completed

- **M1:** Wireframes & Specifications
- **M2:** Semantic HTML & Base CSS
- **M3:** Forms & Regex Validation (22 tests)
- **M4:** Render + Sort + Regex Search
- **M5:** Stats + Cap/Targets
- **M6:** Persistence + Import/Export
- **M7:** Polish & A11y Audit

**Final Grade Target:** 95-100%

---

## Demo Video

**Contents:**
- Add/edit/delete tasks
- Regex search with highlighting
- Sort functionality
- Dashboard statistics
- Keyboard navigation
- Form validation
- Import/export
- Accessibility features


---

## Developer

**Name:** Honnete Nishimwe
**Email:** h.nishimwe@alustudent.com
**GitHub:** github.com/honnete-1

**Course:** Frontend  
**Assignment:** Summative - Building Responsive UI  
**Date:** February 2026

---

## Seed Data

Load sample tasks quickly:
1. Open browser console (F12)
2. Go to Application tab
3. Find localStorage
4. Or manually add tasks through the form

The `seed.json` file has 12 sample tasks you can reference.









