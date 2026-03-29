import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultLearner, pedagogicalDecision, pickDifficulty, updateLearner } from '../src/engine.js';

test('difficulty selection tracks mastery bands', () => {
  assert.equal(pickDifficulty(0.2), 'easy');
  assert.equal(pickDifficulty(0.5), 'medium');
  assert.equal(pickDifficulty(0.9), 'hard');
});

test('update learner increases mastery when correct', () => {
  const learner = defaultLearner('u1');
  const updated = updateLearner(learner, { conceptId: 'c1', kc: 'KC1', correct: true, errorType: '' });
  assert.ok(updated.concept_mastery.c1 > 0.3);
  assert.ok(updated.kc_mastery.KC1 > 0.3);
});

test('pedagogical decision follows attempt logic', () => {
  assert.equal(pedagogicalDecision({ correct: false, attemptCount: 2, mastery: 0.2, errorType: 'pattern_error' }).action, 'hint');
  assert.equal(pedagogicalDecision({ correct: false, attemptCount: 5, mastery: 0.2, errorType: 'pattern_error' }).action, 'remedial');
  assert.equal(pedagogicalDecision({ correct: true, attemptCount: 1, mastery: 0.85, errorType: '' }).action, 'next_concept');
});
