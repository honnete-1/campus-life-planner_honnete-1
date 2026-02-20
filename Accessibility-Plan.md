# M1 - Campus Life Planner Specification

## Project Overview
**Theme:** Campus Life Planner  
**Approach:** Single-page, section-based navigation (faster, smoother UX)  
**Core Purpose:** Help students manage tasks, events, deadlines with duration tracking and tag organization

---

## 1. DATA MODEL

```javascript
{
  id: "task_0001",              // Unique identifier (format: task_XXXX)
  title: "Study for midterm",   // Task/event name
  dueDate: "2025-10-15",        // YYYY-MM-DD format
  duration: 120,                // Time in minutes
  tag: "Academic",              // Category/label
  createdAt: "2025-09-29T14:30:00Z",  // ISO 8601 timestamp
  updatedAt: "2025-09-29T14:30:00Z"   // ISO 8601 timestamp
}
```

### Default Tags
- Academic
- Social
- Personal
- Work
- Health
- Other
(User can add custom tags in Settings)

### Duration Units
- Base: Minutes
- Conversions: Minutes ↔ Hours (1 hour = 60 minutes)
- Settings allow toggling display preference


## 3. ACCESSIBILITY (A11Y) PLAN

### Semantic Structure
```html
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  
  <header>
    <h1>Campus Life Planner</h1>
    <nav aria-label="Main navigation">
      <!-- Section links -->
    </nav>
  </header>
  
  <main id="main">
    <section id="about" aria-labelledby="about-heading">
      <h2 id="about-heading">About</h2>
      <!-- Content -->
    </section>
    
    <section id="dashboard" aria-labelledby="dashboard-heading">
      <h2 id="dashboard-heading">Dashboard</h2>
      <div role="region" aria-live="polite" aria-atomic="true">
        <!-- Cap status updates here -->
      </div>
    </section>
    
    <section id="tasks" aria-labelledby="tasks-heading">
      <h2 id="tasks-heading">My Tasks</h2>
      <!-- Table with proper headers -->
    </section>
    
    <section id="add-task" aria-labelledby="add-heading">
      <h2 id="add-heading">Add Task</h2>
      <form aria-label="Add new task form">
        <!-- Properly labeled inputs -->
      </form>
    </section>
    
    <section id="settings" aria-labelledby="settings-heading">
      <h2 id="settings-heading">Settings</h2>
    </section>
  </main>
  
  <footer>
    <!-- Links, credits -->
  </footer>
</body>
```

### Keyboard Navigation Map
| Key(s)              | Action                                    |
|---------------------|-------------------------------------------|
| Tab                 | Move to next interactive element          |
| Shift+Tab           | Move to previous interactive element      |
| Enter/Space         | Activate button or link                   |
| Arrow Keys          | Navigate within radio groups, select      |
| Escape              | Close modals, cancel edit mode            |
| Numbers 1-5         | Quick jump to sections (with JS)          |

### Focus Management
- **Visible focus**: 2px solid outline, high contrast color (#0066CC or similar)
- **Focus within**: When section becomes active, focus h2 heading
- **Skip link**: Visible on focus, positioned absolute top-left
- **Modal/Edit mode**: Trap focus, return focus on close

### ARIA Live Regions
1. **Cap Status** (Dashboard)
   ```html
   <div role="status" aria-live="polite" aria-atomic="true">
     You have 4 hours remaining this week
   </div>
   ```
   - Changes to `aria-live="assertive"` when cap exceeded

2. **Form Errors**
   ```html
   <div role="alert" aria-live="assertive" id="error-summary">
     Please fix 2 errors before submitting
   </div>
   ```

3. **Search Results**
   ```html
   <div role="status" aria-live="polite">
     Found 5 tasks matching your pattern
   </div>
   ```

### Color Contrast
- **Text**: Minimum 4.5:1 ratio for normal text
- **Large text**: Minimum 3:1 ratio
- **Interactive elements**: 3:1 ratio for focus indicators
- **Test with**: Browser DevTools Accessibility Inspector

### Screen Reader Considerations
- Table headers with `<th scope="col">` or `<th scope="row">`
- Form labels with `for` attribute matching input `id`
- Regex search pattern errors announced clearly
- Edit/delete buttons with `aria-label="Edit task: Study for midterm"`

### Mobile Touch Targets
- Minimum 44×44px for all interactive elements
- Adequate spacing between adjacent buttons

---

## 4. REGEX VALIDATION RULES

### Required Patterns (4+)

1. **Title** (no leading/trailing spaces, collapse doubles)
   - Pattern: `/^\S(?:.*\S)?$/`
   - Valid: "Study for midterm", "Team meeting"
   - Invalid: " extra spaces ", "double  spaces"

2. **Duration** (positive integer or decimal up to 2 places)
   - Pattern: `/^(0|[1-9]\d*)(\.\d{1,2})?$/`
   - Valid: "90", "1.5", "120.50"
   - Invalid: "01", "-5", "1.234"

3. **Date** (YYYY-MM-DD)
   - Pattern: `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/`
   - Valid: "2025-10-15", "2025-01-01"
   - Invalid: "2025-13-01", "25-10-15"

4. **Tag** (letters, spaces, hyphens)
   - Pattern: `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/`
   - Valid: "Academic", "Extra-Curricular", "Work Study"
   - Invalid: "Academic123", "Tag_Name"

### Advanced Pattern (≥1)

5. **Duplicate Word Detection** (back-reference)
   - Pattern: `/\b(\w+)\s+\1\b/i`
   - Use case: Catch typos in title "the the meeting"
   - Warning shown, not blocking

### Search Patterns (Planner-specific)

6. **Tag Filter**
   - Pattern: `/^@tag:\w+/`
   - Example: "@tag:Academic" filters to Academic tasks

7. **Time Token Detection**
   - Pattern: `/\b\d{2}:\d{2}\b/`
   - Example: Find tasks with "14:30" in title

8. **Due Soon** (next 7 days)
   - Not regex, but date comparison logic

---

## 5. RESPONSIVE BREAKPOINTS

| Breakpoint | Width    | Layout Changes                              |
|------------|----------|---------------------------------------------|
| Mobile     | ≤360px   | Single column, cards, hamburger menu        |
| Mobile L   | 361-767px| Same as mobile, slightly wider cards        |
| Tablet     | 768-1023px| Two columns possible, horizontal nav        |
| Desktop    | ≥1024px  | Three columns, table view, sidebar stats    |

### CSS Strategy
- Mobile-first: Base styles for ≤360px
- `@media (min-width: 768px)` for tablet
- `@media (min-width: 1024px)` for desktop
- Flexbox for layout flexibility
- CSS Grid for dashboard stats (optional)

---

## 6. FILE STRUCTURE (Planned)

```
campus-life-planner/
├── index.html
├── styles/
│   ├── main.css
│   ├── responsive.css
│   └── animations.css
├── scripts/
│   ├── storage.js        # localStorage handling
│   ├── state.js          # App state management
│   ├── ui.js             # DOM manipulation
│   ├── validators.js     # Regex patterns
│   ├── search.js         # Search & filter logic
│   └── app.js            # Main initialization
├── tests.html            # Regex testing page
├── seed.json             # Sample data (≥10 records)
└── README.md
```

---

## NEXT STEPS (M2)
Once approved:
1. Create semantic HTML structure with all sections
2. Implement mobile-first CSS with flexbox
3. Set up navigation toggle for sections
4. Basic styling (no functionality yet)

---

**Ready for review!** Let me know if you'd like any adjustments to the wireframes, data model, or a11y plan before we move to M2.
