export interface GameState {
  targetText: string;       // The target command, flag list, or script
  description: string;      // What the command is used for
  typedText: string;        // Characters typed by the user so far
  startTime: number | null;  // Epoch timestamp of first keystroke
  endTime: number | null;    // Epoch timestamp of completion
  totalKeystrokes: number;  // For raw WPM calculations
  errorCount: number;       // Uncorrected typos currently in typedText
  missedKeystrokes: number; // Cumulative missed keystrokes (even if corrected)
}

export interface GameMetrics {
  wpm: number;              // Standard Net WPM (correct chars / 5 / minutes)
  rawWpm: number;           // Gross WPM (total keystrokes / 5 / minutes)
  accuracy: number;         // (totalKeystrokes - missedKeystrokes) / totalKeystrokes * 100
  elapsedTime: number;      // Elapsed time in seconds
  progress: number;         // Percentage completed (0 - 100)
}
