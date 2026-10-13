# 📓 GATE MATRIX — The Story of a Focused Mind

> *"I started preparing for GATE CSE 2027, but every single day, I struggled to concentrate. The playlists were scattered, the spreadsheet was overwhelming, and my attention kept fracturing. So I decided to build my own personalized, hand-drawn study command center."*

[![GitHub Release](https://img.shields.io/badge/version-v1.4.0-blue.svg)](https://github.com/shre8ya/GATE/releases)
[![Deploy](https://github.com/shre8ya/GATE/actions/workflows/deploy.yml/badge.svg)](https://github.com/shre8ya/GATE/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 The Genesis: Why This Dashboard Exists

It was October 2026. 

I was entering my 5th semester of Computer Science at GGSIPU. In front of me was a daunting double challenge: my college end-term university exams (DAA, Operating Systems, Compiler Design, Computer Networks) and the mother of all exams — **GATE CSE 2027**, organized by IIT Madras.

Like every ambitious aspirant, I started with good intentions. I had:
1. A 14-sheet master study planner spreadsheet with 80+ rows.
2. Over 400 bookmarked YouTube videos across a dozen different channels.
3. PDF notes scattered across Google Drive folders.

**And yet, I couldn't concentrate.**

Every morning sat at my desk, the same story repeated:
- Opening YouTube to watch a lecture on *Recursion Trees* led me straight into the recommendation algorithm. One click later, 45 minutes were lost.
- Looking at the dense, gray, 100-row Excel spreadsheet made my chest tighten with anxiety. I couldn't see my progress, couldn't feel any momentum, and had no idea how much I had truly conquered.
- Juggling university internal vivas while keeping up with daily Discrete Mathematics felt impossible. If I fell behind by just one day, the entire spreadsheet broke, and guilt set in.

Standard edtech apps felt cold, corporate, and full of upsells. They didn't feel like *my* study space.

I realized what I needed wasn't another generic test series portal. **I needed an analog-feeling, hand-drawn sketchbook command center.** A place that felt like an authentic physical study diary — complete with washi tape, ruled notebook margins, fountain pen ink, satisfying checkmarks, celebratory confetti, and every single video link locked in so I never had to browse YouTube unprotected again.

That was the day **GATE MATRIX** was born.

---

## 🧭 The High-Performance Architecture (v1.4.0)

```
  ┌────────────────────────────────────────────────────────────────────────┐
  │                        GATE MATRIX COMMAND CENTER                      │
  │        "From Productivity Theater to High-Performance Weapon"          │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
  🎯 WAR ROOM (TODAY)         🛡️ WEAPON VAULT              🗺️ RADAR
  • 4-Phase Daily Battle      • Spaced Error Flashcards    • Desk Calendar Grid
  • In-App Distraction Video  • Photo Formula Vault        • 80-Day Master Planner
  • Active Recall Gatekeeper  • 180m Exam Simulator        • Subject Video Matrix
  • Marks Reality Bar (100m)  • PYQ Question Papers        • IPU University Synergy
```

---

## ✨ Features Tour

### 1. 🎯 War Room (Today's Mission)
* **GATE CSE Marks Weightage Reality Bar**: Strict mapping to official GATE scoring — General Aptitude (15m), Engineering & Discrete Maths (13m), and Core CS (72m). See your live marks unlocked out of 100 toward the AIR < 100 target (~75+ marks).
* **🛡️ Distraction-Free Embedded Video Player**: Click **[▶️ Play in App]** on any lecture to stream it directly inside a privacy-hardened in-app modal (`youtube-nocookie.com`). Zero recommendation feeds, zero comment traps, zero sidebar rabbit holes. Includes a live Margin Notes pad and 1-click Formula Vault capture.
* **🛑 Active Recall Gatekeeper**: Checking off any study phase prompts a 30-second recall test — enter the core concept/trap learned and your PYQ accuracy (e.g. 7/8 correct) before locking in completion.
* **🧠 Embedded Spaced-Repetition Error Flashcards**: Due error cards are integrated directly into Phase 4 with 1-click interval progression (+1d, +3d, +7d, +21d, +60d) and an inline quick mistake logger.
* **⏱️ Customizable Pomodoro Clock (Your Option)**: Dial in any study session duration (1 to 240 mins) or pick presets (`15m`, `25m`, `30m`, `45m`, `60m`, `90m`, `120m`). Automatically remembered across browser reloads.
* **🎶 Offline Ambient Synth**: Synthesizes Study Rain, 40Hz Gamma waves, and Deep Drone directly in Web Audio without external streaming.

### 2. 🛡️ Weapon Vault (Errors, Formulas & Mocks)
* **Error & Mistake Log**: Filter by trap category (*Conceptual*, *Calculation*, *Silly Mistake*, *Formula Trap*, *Time Pressure*). Track next review dates and master your flaws.
* **Formula Vault with Photo Uploads**: Browse key equations or snap photos of your physical notebook pages with client-side canvas compression (<150KB).
* **Question Papers Hub & Simulator**: Official GATE CSE papers (2020–2024) and IPU end-term papers with a built-in 180-minute exam timer.

### 3. 🗺️ Radar (Calendar, Planner & Syllabus)
* **Interactive Desk Calendar**: Month-by-month grid (Oct 2026 – Feb 2027) with spiral rings. Click any date to inspect, check off, or add custom tasks.
* **1-Click Google Calendar Sync**: Hit **"Add to Google Calendar"** on any day or download a standard RFC 5545 `.ics` file for the entire 80-day prep.
* **80-Day Master Timeline**: Filter by status, subject, and week with direct video and search links.
* **Syllabus & Weightage Matrix**: Complete topic-by-topic tracking across all 10 GATE CSE sections.
* **IPU Exam Synergy**: 5th-semester alignment between college exams (DAA, OS, CD, CN) and GATE core topics.

---

## 📦 Version History

See [CHANGELOG.md](file:///e:/GATE/Code/CHANGELOG.md) for full release notes.

| Version | Highlights | Status |
|:---:|:---|:---:|
| **v1.4.0** | 3 Consolidated Workspaces, In-App Video Player, Active Recall Gatekeeper, Embedded Spaced Error Flashcards, Marks Reality Bar | **Latest** |
| **v1.3.0** | Arbitrary Pomodoro Study Time (User Option), Removed Redundant Views, Calendar Grid Alignment | Released |
| **v1.2.0** | Cloud Deploy, Google Calendar Sync & .ICS, Clickable Day Editor, Paper Color Themes, Ambient Synthesizer | Released |
| **v1.1.0** | Desk Calendar Grid, Confetti Engine, 100+ Daily Quotes, Photo Formula Vault, Question Papers Hub | Released |
| **v1.0.0** | Hand-Drawn Notebook Foundation, 80-Day Master Planner, 4-Phase Missions, AI Dynamic Rescheduler | Released |

---

## 🚀 Getting Started & Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/shre8ya/GATE.git
cd GATE/Code

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Building for Production
```bash
npm run build
```

---

## ☁️ Cloud Deployment

The repository is pre-configured with a **GitHub Actions CI/CD pipeline** (`.github/workflows/deploy.yml`).
Whenever changes are pushed to `main`, GitHub Pages automatically compiles and deploys the latest version to:
👉 **`https://shre8ya.github.io/GATE/`**

---

*“Consistency is not about never falling behind; it is about having a system that welcomes you back the moment you return.”*
