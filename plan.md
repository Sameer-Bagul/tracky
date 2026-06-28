# Tracky: Goal Operating System Plan

## Vision
Instead of just a printable calendar, Tracky will be a complete **Goal Operating System**: "Plan your goal, break it into daily actions, visualize progress, stay accountable, and print beautiful progress sheets."

Target audience includes Students, UPSC/GATE/JEE aspirants, Fitness enthusiasts, Readers, Programmers, Freelancers, Startup founders, and Creators.

---

## Tech Stack (Suggested)
- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **Data Fetching:** React Query
- **ORM / DB:** Prisma + PostgreSQL
- **Auth:** NextAuth / Clerk
- **Storage:** UploadThing
- **Charts:** Recharts
- **PDF Generation:** react-pdf
- **Dates:** date-fns
- **State Management:** zustand
- **Extras:** PWA support

---

## Core Features

### 1. Multiple Goals & Dashboard
- Support tracking multiple goals simultaneously (e.g., Learn React, Gym, Book Reading).
- Dashboard overview showing progress percentage for each goal.

### 2. Goal Categories & Templates
- **Categories:** Fitness, Study, Business, Career, Programming, Finance, Health, Reading, Custom.
- **Templates (One-click setup):** 100 Days of Code, 75 Hard, 365 Reading Challenge, 30 Day Meditation, Workout Challenge, GATE/UPSC Preparation, Build a Startup, Weight Loss, etc.

### 3. Better Daily Tracking
- Multiple states instead of just "done/not done": `Completed` (Green), `Skipped` (Yellow), `Half Done` (Red), `Missed` (Blue), `Holiday` (Gray), `Rest Day`.

### 4. Daily Journal
- Clickable days opening a popup to log: Hours Worked, Mood, Notes, Today's Win, Tomorrow's Plan, and Attach Images.

### 5. Habit Score & Analytics
- **Metrics:** Consistency %, Completion %, Current/Longest Streak, Recovery Rate.
- **Charts:** Completion Heatmap (GitHub style), Line/Bar Graphs, Calendar Heatmap, Weekly/Monthly Reports.

### 6. Beautiful Calendars & Views
- Support multiple views: Dots, Squares, Heatmap, Timeline, Progress Rings, Minimal.
- Support various Themes (Dark/Light).
- **Custom Backgrounds:** Upload a personal background image (with an adjustable whitish/opaque overlay) to personalize your calendar.

### 7. Reviews & Reflections
- **Weekly Review (Sundays):** Stats for the week (e.g., 6/7 completed, Best/Worst day, Average %).
- **Monthly Reflection:** Prompts (What went well? What failed? Distractions? Improvements?).

### 8. AI Integrations
- **AI Coach:** Analyzes patterns (e.g., "Consistency dropped 40%", "You usually skip work on Fridays").
- **Smart Suggestions:** Proposes adjustments based on performance.
- **AI Prediction:** Estimates completion date and risk level based on current velocity.

### 9. Goal Breakdown & Milestones
- Break major goals into weekly/monthly milestones (e.g., Week 1: HTML, Week 2: CSS).
- Celebrate milestones (10%, 25%, 50%, 75%, 100%) with animations, confetti, and certificates.
- Attach specific daily tasks (e.g., "Solve 3 Questions", "Read Chapter 5").

### 10. Printable Planner & Export
- Print styles: A4, A3, Letter, Landscape, Portrait, Minimal, Colored, Dark, Light.
- Layouts: 365 Dots, GitHub Heatmap, Calendar, Weekly Planner, Habit Grid, Monthly Sheets.
- **4K Wallpaper Generator:** Provides a horizontal UI with layout customization (toggle rows as months/days and columns as days/months).
- Export formats: 4K Wallpaper (PNG/JPG), PDF, PNG, CSV, Excel, JSON.

### 11. Sync & Reminders
- Sync with Google Calendar, Apple Calendar, Outlook (automatically highlight today).
- Reminders/Notifications for incomplete daily tasks.
- Phone widget displaying Day N, Today's Goal, and Progress Ring.

### 12. Context & Motivation
- **Notes/Resources:** Save Links, YouTube videos, Books, PDFs, Notes per goal.
- **Vision Board:** Upload images (Dream Car, College, Body Goal) that are always visible.
- **Motivation:** Daily quotes, custom affirmations, progress messages ("Only 47 days left").

### 13. Gamification & Community
- **Challenge Mode:** 30/60/90/180/365/1000 days.
- **Accountability Partner:** Invite friends/mentors to see progress, comment, and encourage.
- **Gamification:** XP, Levels, Coins, Badges (e.g., 100 Day Streak, No Skip Month, Night Owl).
- **Statistics:** Average Daily Completion, Most Productive Month/Week, Longest Gap, Skipped Days, Total Hours.
- **Community Challenges:** Public leaderboards for popular challenges.

### 14. Specialized Modes
- **Programming Mode:** GitHub commits, LeetCode, Projects tracking.
- **Student Mode:** Subjects (Physics, Math), Revision, Mock Tests.
- **Fitness Mode:** Weight, Calories, Workout, Water, Protein, Steps.
- **Reading Mode:** Books, Pages, Reading Time, Bookmarks.

### 15. Mobile Experience
- Tap day to toggle, Swipe week, Long press to edit, Drag milestones.
- Offline support and PWA.

---

## The Unique Feature: Goal Replay
- When a goal finishes, generate a **cinematic recap** (shareable video or beautiful PDF).
- Highlights: Day 1 vs Day N, Streak milestones, Missed days, Journal highlights, Progress charts, Uploaded photos, Biggest achievements, Final completion percentage.
- **Value:** Provides a huge emotional payoff, encouraging users to share their journey and start new goals.

---

## SaaS Roadmap

### Free Tier
- 3 active goals
- Basic tracker
- PDF export & Printable sheets
- Progress analytics

### Pro Tier
- Unlimited goals
- AI coach & Advanced analytics
- Multiple themes & Cloud sync
- Calendar integration & Vision boards
- Habit insights & Team accountability
- Premium templates & Goal Replay export