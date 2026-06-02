# sudotype ⚡

An interactive, high-performance terminal-based typing trainer designed to help developers and systems administrators master terminal commands, syntax, options, and shell scripts. It's a hacker-themed typing coach (similar to Monkeytype but built natively for CLI workflows).

---

## 🚀 Key Features

* **Zero-Latency Captured Input:** Runs in low-level terminal Raw Mode (`process.stdin.setRawMode`) capturing keypresses with instant response time and no input lag.
* **Premium Retro CLI Aesthetics:** Built using clean, custom ANSI escape sequences for full coloring (Green for success, White on Red for typos, Dim Grey for untyped chars).
* **Real-time Live Telemetry HUD:** Displays Net WPM, Raw WPM, Accuracy (%), and a dynamically refreshing elapsed time counter.
* **Inline Shell Comment Hints:** Visually aligns UNIX-style shell comments on the right side (`# Hint`) explaining exactly what each target command does.
* **Dynamic Progress Bar:** Renders a clean progress bar showing graphical completion using unicode block chars (`████████▒▒▒`).
* **Instant Hot-run Dev Setup:** Integrated with `tsx` to run TypeScript files instantly without waiting for compile runs during iteration.

---

## 🛠️ Tech Stack & Architecture

* **Language:** Strictly Typed TypeScript (configured for clean ESM imports & `isolatedModules` / `verbatimModuleSyntax`).
* **Runtime:** Node.js (v18+) or Bun.
* **Package Manager:** `pnpm`.
* **Renderer:** Pure ANSI screen buffer drawer (no heavy external component packages or visual stutters).

---

## ⚙️ Quick Start Guide

### 1. Global Installation (via npm)
Install the package globally on your system to run it from any directory:
```bash
npm install -g sudotype
```
Once installed, simply run:
```bash
sudotype
```

Alternatively, you can run it on-the-fly without installation:
```bash
npx sudotype
```

### 2. Local Development & Testing
If you want to run it locally or contribute:
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/AegisX-dev/sudotype.git
   cd sudotype
   pnpm install
   ```
2. Run the hot-reloading development runner:
   ```bash
   pnpm run dev
   ```
3. Compile the production bundle:
   ```bash
   pnpm run build
   ```
4. Install your local modified package globally for testing:
   ```bash
   pnpm add -g .
   ```

---

## 🎮 Interactive Controls

* **`Ctrl+C`**: Safely quits the trainer and restores your native terminal settings (reveals system cursor).
* **`Ctrl+R`**: Resets your typing state instantly and loads the next random terminal command.
* **`Backspace`**: Allows editing and correcting typos instantly.
