import type { GameState } from "../engine/types.js";
import { calculateMetrics } from "../engine/game-engine.js";

// ANSI Escape Codes
const ESC = "\x1b[";
const CLEAR_SCREEN = `${ESC}2J${ESC}H`;
const HIDE_CURSOR = `${ESC}?25l`;
const SHOW_CURSOR = `${ESC}?25h`;
const RESET = `${ESC}0m`;
const BOLD = `${ESC}1m`;
const DIM = `${ESC}2m`;

// Color palette (retro hacker theme)
const GREEN = `${ESC}32m`;
const RED_BG = `${ESC}41m${ESC}37m`; // white text on red background
const GREY = `${ESC}90m`;
const CYAN = `${ESC}36m`;
const YELLOW = `${ESC}33m`;
const WHITE = `${ESC}37m`;
const UNDERLINE = `${ESC}4m`;

/**
 * Renders the entire terminal screen layout.
 * Employs absolute coordinates or single-buffer writes to prevent flashing.
 */
export function render(state: GameState): void {
  const metrics = calculateMetrics(state);
  const out: string[] = [];

  // Hide system cursor to prevent distracting artifacts
  out.push(HIDE_CURSOR);
  
  // Clear the screen and position at top-left
  out.push(CLEAR_SCREEN);

  // 1. Header Title
  out.push(`\n  ${BOLD}${CYAN}⚡ S U D O T Y P E ⚡${RESET} ${DIM}[CLI Hacker Typing Trainer]${RESET}\n`);
  out.push(`  ${DIM}──────────────────────────────────────────────────────────────${RESET}\n\n`);

  // 2. Typing Area
  out.push("  ");
  
  const target = state.targetText;
  const typed = state.typedText;

  for (let i = 0; i < target.length; i++) {
    const targetChar = target[i] ?? "";
    
    if (i < typed.length) {
      const typedChar = typed[i] ?? "";
      if (typedChar === targetChar) {
        // Correct char: Green
        out.push(`${GREEN}${targetChar}${RESET}`);
      } else {
        // Typo: Red background
        // Render spaces visibly to denote missing characters
        const visibleChar = targetChar === " " ? "_" : targetChar;
        out.push(`${RED_BG}${visibleChar}${RESET}`);
      }
    } else if (i === typed.length) {
      // Current active character to type (Underline + White)
      if (state.endTime === null) {
        out.push(`${BOLD}${WHITE}${UNDERLINE}${targetChar}${RESET}`);
      } else {
        out.push(`${GREEN}${targetChar}${RESET}`);
      }
    } else {
      // Untyped text: Dark grey
      out.push(`${GREY}${targetChar}${RESET}`);
    }
  }

  // Print inline command comment hint (aligned dynamically for visual aesthetics)
  const padLength = Math.max(4, 50 - target.length);
  const padding = " ".repeat(padLength);
  out.push(`${padding}${GREY}# ${state.description}${RESET}`);
  
  out.push("\n\n\n");

  // 3. Progress Bar
  const barLength = 30;
  const filledLength = Math.round((metrics.progress / 100) * barLength);
  const emptyLength = barLength - filledLength;
  const progressBar = `${CYAN}█${RESET}`.repeat(filledLength) + `${GREY}▒${RESET}`.repeat(emptyLength);
  out.push(`  ${BOLD}Progress:${RESET} [${progressBar}] ${metrics.progress}%\n\n`);

  // 4. Telemetry Metrics Table
  out.push(`  ${BOLD}${WHITE}WPM:${RESET} ${GREEN}${metrics.wpm}${RESET}     `);
  out.push(`${BOLD}${WHITE}Raw WPM:${RESET} ${YELLOW}${metrics.rawWpm}${RESET}     `);
  out.push(`${BOLD}${WHITE}Accuracy:${RESET} ${metrics.accuracy >= 95 ? GREEN : YELLOW}${metrics.accuracy}%${RESET}     `);
  out.push(`${BOLD}${WHITE}Time:${RESET} ${CYAN}${metrics.elapsedTime}s${RESET}\n`);
  
  out.push(`  ${DIM}──────────────────────────────────────────────────────────────${RESET}\n`);

  // 5. Help / Instructions Footer
  if (state.endTime !== null) {
    out.push(`  ${BOLD}${GREEN}✔ TEST COMPLETED!${RESET}\n`);
    out.push(`  Final Score: WPM: ${GREEN}${metrics.wpm}${RESET} | Accuracy: ${GREEN}${metrics.accuracy}%${RESET}\n`);
    out.push(`  Press ${BOLD}${CYAN}Ctrl+R${RESET} to load next command | Press ${BOLD}${YELLOW}Ctrl+C${RESET} to quit\n`);
  } else {
    out.push(`  Press ${BOLD}${CYAN}Ctrl+R${RESET} to restart | Press ${BOLD}${YELLOW}Ctrl+C${RESET} to quit\n`);
  }

  // Write standard output buffer at once
  process.stdout.write(out.join(""));
}

/**
 * Restores terminal defaults (showing cursor, resetting formatting) on exit.
 */
export function cleanupTerminal(): void {
  process.stdout.write(`${SHOW_CURSOR}${RESET}\n`);
}
