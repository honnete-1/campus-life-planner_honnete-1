# Campus Life Planner - M4 Submission

## Milestone 4: Render + Sort + Regex Search

**Status:** ✅ Complete  
**Weight:** 20%

---

## What's Included

### Files Created/Updated
```
campus-planner/
├── index.html           ✅ Main app
├── tests.html           ✅ Regex tests
├── seed.json            🆕 Sample data (12 tasks)
├── styles/
│   ├── main.css        ✅ Base styles
│   └── layout.css      ✅ Responsive layout
├── scripts/
│   ├── validators.js   ✅ Regex patterns
│   ├── state.js        🆕 Task data management
│   ├── storage.js      🆕 localStorage functions
│   ├── search.js       🆕 Search, filter, sort
│   ├── ui.js           🆕 Render tasks and stats
│   └── app.js          ✅ Updated with M4 features
└── README.md           ✅ This file
```

---

## Features Implemented (M4)

### ✅ 1. Task Rendering
- Tasks display in **table view** (desktop) and **card view** (mobile)
- Shows: title, due date, duration, tag
- Edit and Delete buttons on each task
- Empty state message when no tasks

### ✅ 2. Add/Edit/Delete Tasks (CRUD)
**Add New Task:**
- Fill form and click "Save Task"
- Validates before saving
- Automatically saves to localStorage
- Switches to tasks view after saving

**Edit Existing Task:**
- Click "Edit" button on any task
- Form fills with task data
- Button changes to "Update Task"
- Updates task and saves

**Delete Task:**
- Click "Delete" button
- Confirmation dialog appears
- Task removed and UI updates

### ✅ 3. Sorting
Sort tasks by:
- **Due Date** (Newest/Oldest)
- **Title** (A-Z / Z-A)
- **Duration** (Shortest/Longest)

Dropdown in "My Tasks" section controls sorting.

### ✅ 4. Regex Search with Highlighting
**Regular Search:**
- Type any regex pattern in search box
- Filters tasks by matching title, tag, or date
- Invalid regex won't crash (try/catch protection)
- Case insensitive by default (toggle available)

**Special Commands:**
- `@tag:Academic` - Filter by specific tag
- `!overdue` - Show only overdue tasks

**Highlighting:**
- Matches shown with `<mark>` tags (yellow highlight)
- Works in both table and card views
- Doesn't break with complex patterns

**Example Searches:**
- `study` - Find all tasks with "study"
- `\b\d{2}:\d{2}\b` - Find time patterns like "14:30"
- `@tag:Health` - Show only Health tasks
- `!overdue` - Show overdue tasks

### ✅ 5. localStorage Persistence
- Tasks automatically saved when added/edited/deleted
- Loads tasks on page refresh
- Data persists between sessions
- Clear all data option in Settings (M6)

### ✅ 6. Dashboard Stats (Dynamic)
Updates automatically:
- **Total Tasks** - Count of all tasks
- **Total Time** - Sum of all durations
- **Top Tag** - Most used tag
- **This Week** - Tasks due in next 7 days

**Weekly Cap:**
- Shows progress bar
- Calculates hours used this week
- Changes color: green → yellow → red
- Live region announces status
- Goes to "assertive" when cap exceeded

---

## How to Test M4

### Test 1: Add Tasks
1. Open `index.html`
2. Click "Add Task" tab
3. Fill in:
   - Title: "Test task"
   - Date: Pick any future date
   - Duration: "60"
   - Tag: "Academic"
4. Click "Save Task"
5. Should switch to "My Tasks" and show your task

### Test 2: Edit Task
1. In "My Tasks", click "Edit" on any task
2. Form fills with task data
3. Change title to "Updated task"
4. Click "Update Task"
5. Task updates in list

### Test 3: Delete Task
1. Click "Delete" on any task
2. Confirm dialog appears
3. Click "OK"
4. Task removed from list

### Test 4: Sorting
1. Go to "My Tasks"
2. Change "Sort by" dropdown
3. Try each option:
   - Due Date (Newest/Oldest)
   - Title (A-Z/Z-A)
   - Duration (Shortest/Longest)
4. Tasks reorder automatically

### Test 5: Search
1. In search box, type: `academic`
2. Should filter to tasks containing "academic"
3. Matches highlighted in yellow
4. Try: `@tag:Health` - Shows only Health tasks
5. Try: `!overdue` - Shows overdue tasks
6. Clear search - All tasks return

### Test 6: Persistence
1. Add a few tasks
2. Refresh the page (F5)
3. Tasks still there!
4. Check localStorage in DevTools

### Test 7: Dashboard Updates
1. Add/delete tasks
2. Watch dashboard stats update
3. Add tasks for this week
4. Watch weekly cap progress bar fill up

---

## Seed Data

Load sample tasks quickly:
1. Open browser console (F12)
2. Go to Application tab
3. Find localStorage
4. Or manually add tasks through the form

The `seed.json` file has 12 sample tasks you can reference.

---

## M4 Checklist - All Complete

- ✅ Task rendering (table + cards)
- ✅ Add new tasks
- ✅ Edit existing tasks
- ✅ Delete tasks with confirmation
- ✅ Sort by date/title/duration
- ✅ Regex search with highlighting
- ✅ Special search commands (@tag, !overdue)
- ✅ <mark> tags for highlighting
- ✅ localStorage persistence
- ✅ Dashboard stats update dynamically
- ✅ Weekly cap calculation
- ✅ 12 diverse records in seed.json

---

## What's NOT Included (Coming Later)

❌ Import/Export JSON (M6)  
❌ Settings page functionality (M6)  
❌ Animation/transitions (M7)  
❌ Final polish and demo video (M7)  

---

## Code Structure

**state.js** - Manages tasks in memory
- Simple array of task objects
- Add/update/delete functions
- ID generation

**storage.js** - localStorage operations
- Save/load tasks
- Simple error handling
- Settings storage (for M6)

**search.js** - Search and sort logic
- Safe regex compilation (try/catch)
- Filter by search query
- Special command parsing
- Sort functions
- Highlight with <mark>

**ui.js** - Rendering
- Render table and cards
- Attach event listeners
- Update dashboard stats
- Cap progress calculation

**app.js** - Main coordinator
- Loads everything on start
- Wires up search/sort
- Handles form submission
- Edit mode management

---

## Notes for Grader

**To quickly verify M4:**
1. Open `index.html` ✅
2. Add a task → See it appear ✅
3. Edit a task → See it update ✅
4. Delete a task → See it disappear ✅
5. Try search: `academic` → See filtering + highlighting ✅
6. Change sort → See tasks reorder ✅
7. Refresh page → Tasks still there ✅

All CRUD operations work, search highlights matches, sorting works, and data persists!

---

**M4 Complete ✅**  
Ready for M5: Stats + Cap/Targets
