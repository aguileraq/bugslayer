/**
 * Pure answer validation functions.
 * Never executes, evaluates, or compiles user input (REQ-CHL-002 §11).
 */

/**
 * Normalizes a typed answer:
 * - Trim leading/trailing whitespace
 * - Collapse consecutive internal spaces to single space
 * - Remove non-printable/invisible characters
 */
export function normalizeTypedAnswer(raw: string): string {
  // Remove non-printable characters (control chars except space)
  const cleaned = raw.replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, '');
  // Trim and collapse internal spaces
  return cleaned.trim().replace(/\s{2,}/g, ' ');
}

/**
 * Validates a typed answer against accepted answers.
 * Case-insensitive by default; respects caseSensitive flag.
 */
export function validateTypedAnswer(
  answer: string,
  acceptedAnswers: readonly string[],
  caseSensitive = false,
): boolean {
  const normalized = normalizeTypedAnswer(answer);

  for (const accepted of acceptedAnswers) {
    const normalizedAccepted = normalizeTypedAnswer(accepted);
    if (caseSensitive) {
      if (normalized === normalizedAccepted) return true;
    } else {
      if (normalized.toLowerCase() === normalizedAccepted.toLowerCase()) return true;
    }
  }
  return false;
}

/**
 * Validates a multiple-choice selection.
 * Returns true if the selected index matches the correct index.
 */
export function validateMultipleChoice(
  selectedIndex: number,
  correctIndex: number,
  optionCount: number,
): boolean {
  if (selectedIndex < 0 || selectedIndex >= optionCount) return false;
  return selectedIndex === correctIndex;
}
