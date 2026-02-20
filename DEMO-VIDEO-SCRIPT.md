# Demo Video Script - Campus Life Planner

## Length: 2-3 minutes

---

## Scene 1: Introduction (15 seconds)

**[Screen: Landing on About section]**

**You say:**
> "Hi, this is my Campus Life Planner - a web app I built to help students manage their tasks and time. It uses regex validation, localStorage persistence, and is fully keyboard accessible. Let me show you the main features."

**Action:**
- Show the About section briefly
- Hover over navigation tabs

---

## Scene 2: Add a Task (30 seconds)

**[Screen: Click "Add Task" tab]**

**You say:**
> "First, let me add a task. The form has real-time validation using regex patterns."

**Actions:**
1. Fill in form:
   - Title: "Study for Chemistry exam"
   - Date: Pick a date (e.g., 2025-10-25)
   - Duration: "120"
   - Tag: "Academic"
2. Show duration converter updating: "≈ 2h"
3. Click "Save Task"
4. Form switches to My Tasks section

**You say:**
> "Notice the duration automatically converts to hours, and it validated the input before saving."

---

## Scene 3: View Tasks & Sort (20 seconds)

**[Screen: My Tasks section]**

**You say:**
> "Here are my tasks displayed in a responsive table. I can sort them different ways."

**Actions:**
1. Show tasks in table
2. Change sort dropdown: "Due Date (Oldest)"
3. Tasks reorder
4. Change to: "Duration (Longest)"
5. Tasks reorder again

**You say:**
> "The table view changes to cards on mobile devices for better usability."

**[Optional: Resize window to show card view]**

---

## Scene 4: Regex Search (30 seconds)

**[Screen: Search box in My Tasks]**

**You say:**
> "The app supports regex search with special commands and highlighting."

**Actions:**
1. Type: "chemistry" in search box
2. Show highlighting with yellow `<mark>` tags
3. Clear search
4. Type: "@tag:Academic"
5. Show only Academic tasks appear

**You say:**
> "I can use regex patterns to search, or special commands like 'at-tag-colon-Academic' to filter by category. Invalid regex patterns are handled safely with try-catch."

---

## Scene 5: Edit & Delete (20 seconds)

**[Screen: Tasks table]**

**You say:**
> "Tasks can be edited and deleted easily."

**Actions:**
1. Click "Edit" on a task
2. Form fills with task data
3. Change title slightly
4. Click "Update Task"
5. Task updates in list
6. Click "Delete" on another task
7. Confirm dialog appears
8. Click OK
9. Task disappears

---

## Scene 6: Dashboard Stats (25 seconds)

**[Screen: Click "Dashboard" tab]**

**You say:**
> "The dashboard shows live statistics and weekly time tracking."

**Actions:**
1. Show stat cards (Total Tasks, Total Time, Top Tag, This Week)
2. Scroll to weekly cap section
3. Point to progress bar

**You say:**
> "The weekly cap uses ARIA live regions to announce when you're approaching or exceeding your limit. The progress bar changes from green to yellow to red based on usage."

**[Optional: Add tasks to show bar filling]**

---

## Scene 7: Keyboard Navigation (20 seconds)

**[Screen: Any section]**

**You say:**
> "The entire app is keyboard accessible."

**Actions:**
1. Press Tab several times - show visible focus
2. Use Alt+1 through Alt+5 to jump between sections
3. Tab to a button, press Enter
4. Show skip-to-content link on first Tab

**You say:**
> "All interactive elements are reachable by keyboard, with visible focus indicators and ARIA attributes for screen readers."

---

## Scene 8: Settings & Import/Export (25 seconds)

**[Screen: Settings tab]**

**You say:**
> "In Settings, users can adjust their weekly cap and manage their data."

**Actions:**
1. Show weekly cap input
2. Change cap from 40 to 30
3. Switch back to Dashboard - show "/30 hours"
4. Back to Settings
5. Click "Export JSON"
6. File downloads (show in downloads)

**You say:**
> "Tasks are automatically saved to localStorage and persist between sessions. Users can export and import their data as JSON files."

---

## Scene 9: Validation Demo (15 seconds)

**[Screen: Go to Add Task]**

**You say:**
> "Let me quickly show the validation."

**Actions:**
1. Leave title blank, click Save
2. Show error: "Title is required"
3. Type: " space " (with spaces)
4. Click away from field
5. Show error: "Cannot have leading/trailing spaces"
6. Type: "the the meeting"
7. Show warning: "Possible duplicate word"

---

## Scene 10: Tests Page (10 seconds)

**[Screen: Open tests.html in new tab]**

**You say:**
> "I also created a test page that validates all 5 regex patterns."

**Actions:**
1. Show test page
2. Scroll through tests
3. Show summary: "22/22 tests PASSED"

---

## Scene 11: Closing (10 seconds)

**[Screen: Back to main app, show full interface]**

**You say:**
> "Thanks for watching! This app demonstrates form validation, regex search, CRUD operations, responsive design, and full accessibility compliance."

**[Optional: Show responsive view by resizing]**

---

## Recording Tips:

1. **Preparation:**
   - Clear browser cache
   - Start with empty localStorage (or use seed data)
   - Close unnecessary browser tabs
   - Use full screen or window mode
   - Test audio before recording

2. **During Recording:**
   - Speak clearly and at moderate pace
   - Move cursor smoothly
   - Pause briefly between actions
   - Don't rush - 2-3 minutes is fine

3. **Software:**
   - OBS Studio (free)
   - Loom (free tier)
   - Zoom (record meeting)
   - QuickTime (Mac)
   - Windows Game Bar (Win+G)

4. **What to Show:**
   - Add/edit/delete tasks
   - Search with highlighting
   - Sort functionality
   - Dashboard stats
   - Keyboard navigation
   - Form validation
   - Export/import
   - tests.html

5. **What's Optional:**
   - Showing responsive on mobile
   - Showing all validation errors
   - Deep dive into code
   - Reading entire README

---

## 🎥 Final Checklist:

Before uploading:
- [ ] Video is 2-3 minutes long
- [ ] Audio is clear
- [ ] Shows all main features
- [ ] Demonstrates regex search
- [ ] Shows keyboard navigation
- [ ] Uploads as unlisted YouTube video
- [ ] Link works in README

---

**Good luck with your recording!** 🎬
