# Fitness Tracker Design Guidelines

## Design Approach: Linear-Inspired Utility System

**Rationale:** This is a productivity-focused fitness application requiring clarity, efficiency, and data visualization excellence. Following Linear's design philosophy provides:
- Clean, uncluttered interfaces for daily tracking tasks
- Excellent data visualization patterns for progress charts
- Thoughtful form design for workout and meal logging
- Professional dashboard layouts that scale with data density

**Key Design Principles:**
1. **Clarity Over Decoration** - Every element serves a functional purpose
2. **Data First** - Information hierarchy prioritizes actionable insights
3. **Consistent Interactions** - Predictable patterns across all tracking features
4. **Performance Feel** - Instantaneous visual feedback on all actions

---

## Color Palette

### Light Mode
- **Background Primary:** 0 0% 100% (Pure white)
- **Background Secondary:** 0 0% 98% (Cards, elevated surfaces)
- **Background Tertiary:** 0 0% 95% (Input fields, subtle containers)
- **Text Primary:** 0 0% 9% (Headings, important data)
- **Text Secondary:** 0 0% 45% (Labels, helper text)
- **Text Tertiary:** 0 0% 64% (Placeholders, disabled)
- **Border:** 0 0% 89% (Dividers, card edges)
- **Primary Brand:** 250 95% 62% (Action buttons, active states)
- **Primary Hover:** 250 95% 58%
- **Success:** 142 76% 36% (PRs, goals achieved)
- **Warning:** 38 92% 50% (Calorie warnings)
- **Error:** 0 84% 60% (Form errors)

### Dark Mode
- **Background Primary:** 0 0% 9%
- **Background Secondary:** 0 0% 12% (Cards, elevated surfaces)
- **Background Tertiary:** 0 0% 15% (Input fields)
- **Text Primary:** 0 0% 98%
- **Text Secondary:** 0 0% 71%
- **Text Tertiary:** 0 0% 45%
- **Border:** 0 0% 20%
- **Primary Brand:** 250 95% 68%
- **Primary Hover:** 250 95% 72%
- **Success:** 142 70% 45%
- **Warning:** 38 92% 55%
- **Error:** 0 84% 65%

---

## Typography

**Font Families:**
- Primary: 'Inter', system-ui, -apple-system, sans-serif (UI elements, body text)
- Mono: 'JetBrains Mono', 'Fira Code', monospace (numeric data, weights, calories)

**Type Scale:**
- **Display:** text-5xl font-bold tracking-tight (Dashboard headings)
- **H1:** text-3xl font-bold (Page titles)
- **H2:** text-2xl font-semibold (Section headers)
- **H3:** text-xl font-semibold (Card headers)
- **H4:** text-lg font-medium (Subsections)
- **Body Large:** text-base font-normal (Primary content)
- **Body:** text-sm font-normal (Secondary content, labels)
- **Small:** text-xs font-normal (Captions, meta info)
- **Data Display:** text-4xl font-bold font-mono (Calorie counts, weights)
- **Metric:** text-2xl font-semibold font-mono (Stats, numbers)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 1, 2, 4, 6, 8, 12, 16, 24 for consistent rhythm

**Grid System:**
- Desktop: 12-column grid with gap-6
- Tablet: 8-column grid with gap-4
- Mobile: 4-column grid with gap-4

**Container Widths:**
- Dashboard: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Forms: max-w-2xl mx-auto
- Charts: Full width within containers

**Card Padding:**
- Desktop: p-6
- Mobile: p-4

**Section Spacing:**
- Between major sections: mb-12 lg:mb-16
- Between cards: gap-4 lg:gap-6
- Within cards: space-y-4

---

## Component Library

### Navigation
**Top Navigation Bar:**
- Fixed header with backdrop blur (backdrop-blur-md bg-white/80 dark:bg-black/80)
- Height: h-16
- Logo left, navigation center, user profile right
- Active state: border-b-2 border-primary
- Mobile: Hamburger menu with slide-out drawer

### Dashboard Layout
**Stat Cards:**
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- White/dark cards with rounded-xl borders
- Large metric numbers (text-4xl font-mono)
- Small label below (text-sm text-secondary)
- Trend indicators with colored arrows

**Progress Bars:**
- Height: h-2 rounded-full
- Background: bg-tertiary
- Fill: Gradient from primary to primary-light
- Label above showing current/goal values
- Percentage display

### Forms & Inputs
**Input Fields:**
- Background: bg-tertiary with border border-default
- Focus state: ring-2 ring-primary border-primary
- Height: h-10 for text, h-12 for larger inputs
- Rounded: rounded-lg
- Dark mode: Consistent background treatment

**Buttons:**
- Primary: bg-primary text-white rounded-lg px-6 py-2.5 font-medium
- Secondary: bg-secondary text-primary border border-default
- Ghost: text-primary hover:bg-secondary
- Icon buttons: p-2 rounded-lg hover:bg-secondary

**Select/Dropdown:**
- Same styling as input fields
- Custom arrow icon right-aligned
- Dropdown panel: absolute z-10 mt-1 rounded-lg shadow-lg

### Workout Tracker Components
**Exercise Card:**
- White/dark card with p-4
- Exercise name (text-lg font-semibold)
- Sets displayed as chips: inline-flex gap-2
- Each set: rounded-md bg-secondary px-3 py-1 font-mono text-sm
- Quick actions (edit/delete) on hover

**Plate Calculator Display:**
- Visual barbell representation: horizontal bar with plate rectangles
- Bar center: bg-gray-400 h-4 rounded-full
- Plates: Stacked rectangles with heights representing weight
- Labels: Absolute positioned showing "45lb" etc
- Calculation result: Large monospace text showing distribution

### Charts & Data Visualization
**Chart Container:**
- White/dark card with p-6
- Header with title and time range selector
- Chart height: h-64 lg:h-80
- Chart.js styling: Minimal gridlines, smooth curves
- Colors: Primary for main data, secondary for comparisons
- Tooltip: Custom styled with backdrop blur

**Calendar/History View:**
- Grid of day cells: 7 columns
- Each cell: Heatmap color based on activity (lighter = less, darker = more)
- Current day: ring-2 ring-primary
- Hover: Scale and show stats tooltip

### Meal Logging
**Meal Card:**
- Timeline-style layout with time on left
- Meal name and photo thumbnail
- Macro breakdown: Horizontal bar with 3 segments (protein/carbs/fat)
- Total calories: Large text-2xl font-mono
- Edit icon top-right

**Macro Display:**
- Three column grid
- Each macro: Icon + value + percentage of daily goal
- Progress rings around icons showing completion

### Modals & Overlays
**Modal:**
- Backdrop: bg-black/50 backdrop-blur-sm
- Panel: max-w-2xl mx-auto bg-white/dark rounded-2xl p-6
- Close button: Absolute top-4 right-4
- Smooth enter/exit transitions

---

## Animations

**Principles:** Use sparingly for feedback only

**Approved Animations:**
- Page transitions: Fade in (150ms)
- Card hover: Subtle lift with shadow (200ms ease-out)
- Button press: Scale down 0.98 (100ms)
- Chart data entry: Stagger fade-in (300ms ease-out)
- Form submission: Success checkmark animation (400ms)
- Toast notifications: Slide in from top (250ms)

**Forbidden:**
- Background animations
- Continuous loops
- Parallax scrolling
- Decorative motion

---

## Images

**Dashboard Hero Section:**
No hero image - Dashboard opens directly to stats and recent activity

**Authentication Pages:**
- Illustration/abstract fitness graphic on left panel (desktop only)
- Clean login/signup form on right
- Style: Minimal line art or geometric shapes in brand colors

**Empty States:**
- Simple illustrations for "No workouts yet" "No meals logged"
- Style: Single-color line drawings, centered, max-w-xs

**User Profile:**
- Avatar: Circular, 40px default, 80px on profile page
- Workout template thumbnails: Square cards with exercise count badge