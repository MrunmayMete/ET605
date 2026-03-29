const DIFF = { easy: 0.08, medium: 0.1, hard: 0.12 };

export function defaultLearner(userId) {
  return {
    user_id: userId,
    concept_mastery: {},
    kc_mastery: {},
    accuracy: 0,
    attempts: 0,
    hints_used: 0,
    error_type: '',
    interaction_history: []
  };
}

export function classifyError(question, submission) {
  const input = String(submission).toLowerCase();
  if (question.type === 'visual') return 'visual_error';
  if (question.kc === 'KC3' && input.length > 0) return 'rule_error';
  if (/\d/.test(input) && question.kc === 'KC2') return 'arithmetic_error';
  if (!input) return 'guessing';
  return 'pattern_error';
}

export function updateLearner(learner, { conceptId, kc, correct, errorType }) {
  const next = structuredClone(learner);
  next.attempts += 1;
  const c = next.concept_mastery[conceptId] ?? 0.3;
  const k = next.kc_mastery[kc] ?? 0.3;
  next.concept_mastery[conceptId] = clamp(c + (correct ? 0.08 : -0.03));
  next.kc_mastery[kc] = clamp(k + (correct ? 0.08 : -0.02));
  const correctCount = Math.round((next.accuracy || 0) * (next.attempts - 1)) + (correct ? 1 : 0);
  next.accuracy = correctCount / next.attempts;
  next.error_type = correct ? '' : errorType;
  return next;
}

export function pickDifficulty(mastery) {
  if (mastery < 0.4) return 'easy';
  if (mastery < 0.8) return 'medium';
  return 'hard';
}

export function pedagogicalDecision({ correct, attemptCount, mastery, errorType }) {
  if (correct) {
    if (mastery >= 0.8) return { action: 'next_concept' };
    return { action: 'next_harder_question' };
  }

  if (attemptCount === 1) return { action: 'retry' };
  if (attemptCount === 2) return { action: 'hint', hintLevel: 1 };
  if (attemptCount === 3) return { action: 'hint', hintLevel: 2 };
  if (attemptCount === 4) return { action: 'explanation' };

  const adaptation = {
    pattern_error: 'Show pattern hint and similar easier pattern.',
    rule_error: 'Re-teach rule with worked example.',
    arithmetic_error: 'Provide step-by-step arithmetic breakdown.',
    visual_error: 'Provide visual explanation of figure growth.',
    guessing: 'Lower question difficulty and scaffold strongly.'
  };
  return { action: 'remedial', adaptation: adaptation[errorType] || 'General remediation' };
}

function clamp(v) {
  return Math.max(0, Math.min(1, v));
}

export function difficultyDelta(diff) {
  return DIFF[diff] ?? 0.08;
}
