# Changelog — GATE Matrix Command Center

All notable changes to this project are documented in this file using Semantic Versioning.

---

## [v1.2.0] — 2026-10-13 (Current Release)
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
