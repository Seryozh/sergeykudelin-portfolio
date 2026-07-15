/**
 * @param {0 | 1 | 2} stage
 * @returns {0 | 1 | 2}
 */
export function nextThesisStage(stage) {
  return stage === 2 ? 0 : stage + 1;
}
