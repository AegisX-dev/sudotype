# sudotype - Future Feature Ideas

This document lists future features to enhance the terminal typing trainer once the packaging/installation pipeline is completed.

---

## 📊 1. Live ASCII WPM Progress Graphs
* **Concept:** Render a text-based ASCII line graph on the results page showing WPM variations throughout the typing test.
* **Aesthetics:** Use unicode sparkline blocks (`▄`, `▅`, `█`) or standard line characters to plot live metrics points.

## 🗂️ 2. Script Categories & Difficulty Modes
* **Concept:** Group training tasks into structured modules selectable by the user on boot.
* **Categories:**
  1. *Basic CLI:* Simple short commands and paths (`cd`, `ls`).
  2. *Advanced Flags:* Multi-parameter tools (`tar`, `find`, `grep`).
  3. *Bash Scripting:* Pipelines, conditions, loops (`for`, `if`).
  4. *Database/SQL:* Standard queries (`SELECT`, `JOIN`, `ALTER`).

## 💾 3. Performance Persistence (High Scores & History)
* **Concept:** Automatically save completed typing test results locally.
* **Format:** Save JSON to a hidden file under `~/.sudotype_history.json`.
* **Telemetry:** Track and display personal best WPM, historical typing volume, and overall accuracy trends.

## ⏱️ 4. Time-Based Survival Challenges
* **Concept:** Enable standard typing test durations (15s, 30s, 60s) where multiple terminal commands are presented consecutively.
* **Mechanics:** Once a command is typed correctly, it is immediately replaced with a new one until the timer expires.
