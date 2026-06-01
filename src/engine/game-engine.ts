import type { GameState, GameMetrics } from "./types.js";

/**
 * Creates an initial clean GameState for a target command text.
 */
export function createInitState(targetText: string, description: string): GameState {
  return {
    targetText,
    description,
    typedText: "",
    startTime: null,
    endTime: null,
    totalKeystrokes: 0,
    errorCount: 0,
    missedKeystrokes: 0,
  };
}

/**
 * Calculates real-time WPM, Raw WPM, Accuracy, and Elapsed Time.
 */
export function calculateMetrics(state: GameState): GameMetrics {
  if (state.startTime === null) {
    return { wpm: 0, rawWpm: 0, accuracy: 100, elapsedTime: 0, progress: 0 };
  }

  const now = state.endTime ?? Date.now();
  const elapsedTimeSeconds = Math.max((now - state.startTime) / 1000, 0.1);
  const minutes = elapsedTimeSeconds / 60;

  // Standard typing metrics: 1 word = 5 characters
  const totalChars = state.typedText.length;
  let correctChars = 0;
  for (let i = 0; i < totalChars; i++) {
    if (state.typedText[i] === state.targetText[i]) {
      correctChars++;
    }
  }

  const rawWpm = (state.totalKeystrokes / 5) / minutes;
  const wpm = (correctChars / 5) / minutes;

  const accuracy = state.totalKeystrokes > 0
    ? Math.max(0, ((state.totalKeystrokes - state.missedKeystrokes) / state.totalKeystrokes) * 100)
    : 100;

  const progress = Math.min(100, (totalChars / state.targetText.length) * 100);

  return {
    wpm: Math.round(wpm),
    rawWpm: Math.round(rawWpm),
    accuracy: Math.round(accuracy * 10) / 10,
    elapsedTime: Math.round(elapsedTimeSeconds * 10) / 10,
    progress: Math.round(progress),
  };
}

/**
 * Handles character inputs, returning a new state deterministically.
 */
export function handleKeyPress(state: GameState, key: string): GameState {
  // If finished, block further keystrokes
  if (state.endTime !== null) {
    return state;
  }

  const nextState = { ...state };

  // Initialize start time on first keystroke
  if (nextState.startTime === null) {
    nextState.startTime = Date.now();
  }

  if (key === "\u007F" || key === "\b") { // Backspace (DEL or Backspace)
    if (nextState.typedText.length > 0) {
      nextState.typedText = nextState.typedText.slice(0, -1);
    }
  } else {
    // Normal character entry (avoid capture of control codes/escape sequences in text)
    if (key.length === 1 && nextState.typedText.length < nextState.targetText.length) {
      const expectedChar = nextState.targetText[nextState.typedText.length];
      nextState.typedText += key;
      nextState.totalKeystrokes++;

      if (key !== expectedChar) {
        nextState.missedKeystrokes++;
      }
    }
  }

  // Recalculate uncorrected errors
  let errors = 0;
  for (let i = 0; i < nextState.typedText.length; i++) {
    if (nextState.typedText[i] !== nextState.targetText[i]) {
      errors++;
    }
  }
  nextState.errorCount = errors;

  // Check completion condition (completed when typed length matches target length and no error)
  if (nextState.typedText.length === nextState.targetText.length && nextState.errorCount === 0) {
    nextState.endTime = Date.now();
  }

  return nextState;
}
