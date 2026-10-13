# Changelog — GATE Matrix Command Center

All notable changes to this project are documented in this file using Semantic Versioning.

---

## [v1.4.0] — 2026-10-13 (Current Release)
### ⚔️ Transformation: From "Productivity Theater" to "High-Performance Weapon"
In direct response to the brutal and real critique of competitive GATE CSE prep habits, this release restructures the dashboard around active recall, spaced repetition, distraction elimination, and ruthless score tracking.

### 🎯 3 Consolidated Operational Workspaces (Eliminated 9-Tab Cognitive Overload)
- **War Room (Today)**: Your daily battleground featuring the 4-phase mission, in-app video launcher, spaced-repetition error review, and active recall gatekeeper.
- **Weapon Vault (Errors & Formulas)**: Unites the Error & Mistake Log (Spaced Review), Formula Vault & Photo Scans, and Question Papers Hub & Mocks.
- **Radar (Calendar & Planner)**: Consolidates the Interactive Desk Calendar, 80-Day Master Timeline, Subject Video Directory, Official Syllabus Matrix, and IPU Exam Synergy.
- Seamless backward-compatible routing preserving all saved tabs and localStorage states.

### 🛡️ P1: Distraction-Free In-App Video Player (`VideoPlayerModal`)
- Plays recommended lecture playlists and videos directly inside an in-app hand-drawn modal via privacy-respecting `youtube-nocookie.com`.
- Automatically strips recommendation feeds, sidebar rabbit holes, comments, and related videos that pull students into YouTube binges.
- Includes a live **Margin Notes Scratchpad** syncing directly into today's mission notes.
- Quick **+ Capture Formula to Vault** button to save equations on the fly without leaving the lecture.

### 🧠 P2: Embedded Spaced-Repetition Error Flashcards (Phase 4)
- Embedded due mistake flashcards directly into **Phase 4: Practice & PYQ Solving**.
- 1-Click interval progression: `+1d` → `+3d` → `+7d` → `+21d` → `+60d` → `Mastered`.
- "Mastered" and "Struggled (Reset to 1d)" buttons provide active retrieval testing before students start new practice.
- **Inline + Log Mistake Form**: Instantly log tricky traps, question references, trap categories (Conceptual, Calculation, Formula Trap, etc.), and correct concepts right from Phase 4.

### 🛑 P3: Active Recall Gatekeeper (`ActiveRecallModal`)
- Prevents passive "dopamine checking" where students click Done without retaining anything.
- Clicking any study phase checkbox triggers a 30-second Active Recall verification modal.
- Requires retrieving the core concept/trap learned and logging PYQ accuracy (e.g., 6/8 correct) before locking in the completion.
- Non-blocking "Skip (I'm in a rush)" escape bypass so students are never blocked under tight schedules.

### 📊 P5: GATE CSE Marks Weightage Reality Bar
- Replaced arbitrary percentages with a live **Marks Unlocked Reality Bar** strictly mapped to official GATE marks weightage:
  - **General Aptitude**: 15 Marks
  - **Engineering & Discrete Mathematics**: 13 Marks
  - **Core Computer Science**: 72 Marks
  - **Total**: Live score out of 100 Marks with target AIR < 100 (~75+ marks benchmark).

---

## [v1.3.0] — 2026-10-13

### ⏱️ Customizable Pomodoro Study Clock (User Option)
- **Arbitrary Study Time Option**: Users can now set any study duration from 1 to 240 minutes via a dedicated hand-drawn input box or quick preset chips (`15m`, `25m`, `30m`, `45m`, `60m`, `90m`, `120m`).
- **Persistent Preferences**: Custom study duration is saved to `localStorage` (`gate_pomodoro_custom_mins_v1`), remembering the user's preferred duration across sessions and reloads.
- **Quick-Tweak Controls**: Added instant `[-5m]` and `[+5m]` buttons to effortlessly extend or shorten a study session on the fly.
- **Session Types**: Switch seamlessly between 🎯 Focus Block, ☕ Short Break (5m), and 🧘 Long Break (15m).
- **Elapsed Progress Bar**: Hand-drawn visual progress bar showing percentage of session completed in real time.
- **Non-blocking Celebration Banner**: Replaced intrusive browser alert popups with an in-app celebratory banner with sound effects, task confetti, and 1-click break transitions.

### 🧹 Interface Streamlining & Cleanups
- **Removed Journal & Achievements**: Completely removed the redundant Journal and Trophies view and navbar tab as requested to keep the workspace laser-focused on active study tasks.
- **Primary Tab Clarity**: Streamlined the primary view title to **Today's Mission**.

### 📐 Calendar Alignment & Visual Cleanup
- **Desk Calendar Grid Alignment**: Fixed the asymmetrical shift caused by notebook paper margin CSS. The 7-day grid and header labels (`SUN` through `SAT`) are now symmetrically aligned across all viewport sizes with responsive overflow protection.
- **Removed IPU Exam Milestone Color**: Removed the distinctive pink background coloring and legend chip for IPU exam milestone days to keep the calendar visually uniform and clean.

---

## [v1.2.0] — 2026-10-13
### 🚀 Added
- **Cloud Deployment Setup**: Automated GitHub Pages deployment pipeline via `.github/workflows/deploy.yml` with relative base path configuration in `vite.config.js`.
- **Google Calendar 1-Click Sync**:
  - Direct template event generator (`createGoogleCalendarUrl`) for any day's study schedule with prefilled 4-phase checklists and lecture links.
  - Full-schedule RFC 5545 iCalendar (`.ICS`) export engine (`downloadIcsSchedule`) allowing 1-click import into Google Calendar, Apple Calendar, or Outlook.
- **Clickable Desk Calendar & Custom Task Editor**:
  - Interactive Day Inspector & Customizer modal on every calendar date.
  - Create, customize, check off, and delete custom tasks (College vivas, extra PYQ marathons, formula notes) with persistent browser storage.
  - Direct day completion toggling from the calendar view with celebratory confetti bursts.
- **Authentic Paper Stationery Color Themes**:
  - 📜 **Warm Parchment / Classic Cream** (Default sketchbook)
  - 📓 **Moleskine Ivory** (Soft vanilla notebook)
  - 🌿 **Sage / Mint Study Pad** (Calming green tint for reduced eye strain)
  - 🌸 **Pastel Rose / Coral Sketch** (Warm coral blush)
  - 🩵 **Grid Engineering Blue** (Technical blueprint drafting paper)
  - 🖍️ **Dark Chalkboard** (Night study slate)
  - Instant theme switcher in top navbar with persistent `localStorage` memory.
- **Personal Achievement & Daily Reflections Journal**:
  - Star focus rating (1–5) and study mood selector.
  - Guided daily prompts: Breakthroughs, Distractions, and Tomorrow's #1 Priority.
  - Milestone Trophy Room with 8 unlocked/locked achievement badges.
  - Real-time live GATE 2027 Countdown ticker down to the exact second.
  - Self-contained Web Audio focus synthesizer (Study Rain, 40Hz Gamma, Deep Drone).
- **Corrected & Enriched Maths & Aptitude Resources**:
  - Restored all 12 verified Engineering Maths playlists (GO Classes, Gradeup/Algorithm Unlocked, NPTEL, Joydeep Das).
  - Restored all General Aptitude resources (Saurabh Thakur Sir's Unacademy Course, GATE Overflow Verbal playlist, and 5 Free Monthly Quizzes with direct links).
- **Textured Smooth Scrollbars**:
  - Graphite pencil styling on scrollbars, smooth scroll behavior across all views.

---

## [v1.1.0] — 2026-10-13
### 🎨 Added
- **Desk Calendar Grid**: Month-by-month desk calendar with spiral binder rings covering October 2026 to February 2027.
- **Confetti Celebration Engine**: Micro-burst particle explosions on task completion and full-screen cannon barrages on 100% daily mission accomplishment.
- **Daily Motivational Quotes**: Sticky paper quote cards featuring APJ Abdul Kalam, Swami Vivekananda, Alan Turing, Richard Feynman, Linus Torvalds, and Donald Knuth.
- **Photo Formula Vault**: Dual-mode entry (LaTeX/Text or 📸 Photo scan) with client-side canvas compression and full-resolution lightbox viewer.
- **Official Question Papers Hub**: GATE CSE 2024–2020 + IPU End-Term exam papers with interactive 180m/90m exam timer simulator.
- **Multi-User Personalization**: 10 study avatars, college tracking, target rank, and activity logs.

---

## [v1.0.0] — 2026-10-13
### 🌟 Initial Release
- **Hand-Drawn Sketchbook Aesthetic**: Washi tape, wobbly ink borders, ruled paper lines, fountain pen typography.
- **80-Day Master Planner**: Full syllabus timeline (13 Oct – 31 Dec 2026) extracted from `GATE_2027_Study_Planner.xlsx`.
- **4-Phase Mission Control**: Daily structured schedule (Aptitude → Maths → Core Subject → PYQs).
- **Direct Video Search Engine**: 550+ direct lecture playlist links and YouTube search queries.
- **AI Dynamic Rescheduler**: Recalculates study calendar when days are missed.
