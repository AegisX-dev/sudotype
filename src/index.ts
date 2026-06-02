#!/usr/bin/env node
import { getRandomCommand } from "./engine/text-library.js";
import { createInitState, handleKeyPress } from "./engine/game-engine.js";
import { render, cleanupTerminal } from "./ui/renderer.js";
import type { GameState } from "./engine/types.js";

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(`
  ⚡ S U D O T Y P E ⚡ [CLI Hacker Typing Trainer]

  Usage:
    sudotype [options]

  Options:
    -h, --help      Show this help menu
    -v, --version   Show version information

  Controls during test:
    Ctrl+R          Restart test or load next command
    Ctrl+C          Exit the application
  `);
  process.exit(0);
}

if (args.includes("--version") || args.includes("-v")) {
  console.log("sudotype version 1.0.2");
  process.exit(0);
}

const initialCmd = getRandomCommand();
let state: GameState = createInitState(initialCmd.text, initialCmd.description);
let tickTimer: NodeJS.Timeout | null = null;

// Enable stdin Raw Mode for zero-latency, key-by-key capture
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");

/**
 * Starts a background ticker to refresh the elapsed time smoothly
 * every 100ms once the test starts.
 */
function startTicker(): void {
  if (tickTimer !== null) return;
  tickTimer = setInterval(() => {
    render(state);
  }, 100);
}

/**
 * Stops the background timer.
 */
function stopTicker(): void {
  if (tickTimer !== null) {
    clearInterval(tickTimer);
    tickTimer = null;
  }
}

/**
 * Gracefully restores terminal state and exits the application.
 */
function shutdown(): void {
  stopTicker();
  cleanupTerminal();
  process.exit(0);
}

// Initial draw
render(state);

// Capture Raw Keypress Data
process.stdin.on("data", (data: string) => {
  // Capture key strings (individual keys, multi-byte controls)
  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    if (char === undefined) continue;

    // Ctrl+C (End of Text / Interrupt)
    if (char === "\u0003") {
      shutdown();
    }

    // Ctrl+R (Device Control 2 - Restart/Next phrase)
    if (char === "\u0012") {
      stopTicker();
      const nextCmd = getRandomCommand();
      state = createInitState(nextCmd.text, nextCmd.description);
      render(state);
      continue;
    }

    // Pass inputs to engine
    const nextState = handleKeyPress(state, char);

    // If typing has just started, start our visual update timer
    if (state.startTime === null && nextState.startTime !== null) {
      startTicker();
    }

    // If typing has completed, stop the ticker
    if (state.endTime === null && nextState.endTime !== null) {
      stopTicker();
    }

    state = nextState;
  }

  // Draw updated state immediately for instant feedback
  render(state);
});

// Capture system termination signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("uncaughtException", (error) => {
  stopTicker();
  cleanupTerminal();
  console.error("An unexpected error occurred:\n", error);
  process.exit(1);
});
