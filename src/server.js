import express from 'express';
import { initDb, getDb } from './db.js';
import { classifyError, defaultLearner, pickDifficulty, pedagogicalDecision, updateLearner } from './engine.js';

initDb();
const db = getDb();

const app = express();
app.use(express.json());
app.use(express.static('public'));

function parseLearner(row) {
  if (!row) return null;
  return {
    user_id: row.user_id,
    concept_mastery: JSON.parse(row.concept_mastery),
    kc_mastery: JSON.parse(row.kc_mastery),
    accuracy: row.accuracy,
    attempts: row.attempts,
    hints_used: row.hints_used,
    error_type: row.error_type,
    interaction_history: JSON.parse(row.interaction_history)
  };
}

function saveLearner(learner) {
  db.prepare(`INSERT INTO learners (user_id, concept_mastery, kc_mastery, accuracy, attempts, hints_used, error_type, interaction_history)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      concept_mastery=excluded.concept_mastery,
      kc_mastery=excluded.kc_mastery,
      accuracy=excluded.accuracy,
      attempts=excluded.attempts,
      hints_used=excluded.hints_used,
      error_type=excluded.error_type,
      interaction_history=excluded.interaction_history`).run(
    learner.user_id,
    JSON.stringify(learner.concept_mastery),
    JSON.stringify(learner.kc_mastery),
    learner.accuracy,
    learner.attempts,
    learner.hints_used,
    learner.error_type,
    JSON.stringify(learner.interaction_history)
  );
}

function ensureLearner(userId) {
  const row = db.prepare('SELECT * FROM learners WHERE user_id = ?').get(userId);
  if (row) return parseLearner(row);
  const learner = defaultLearner(userId);
  saveLearner(learner);
  return learner;
}

app.get('/chapter', (_, res) => {
  const chapters = db.prepare('SELECT * FROM chapters').all();
  res.json(chapters);
});

app.get('/subtopic', (req, res) => {
  const { chapterId = 'ch1' } = req.query;
  const subtopics = db.prepare('SELECT * FROM subtopics WHERE chapter_id = ?').all(chapterId);
  res.json(subtopics);
});

app.get('/concept', (req, res) => {
  const { subtopicId } = req.query;
  const concepts = subtopicId
    ? db.prepare('SELECT * FROM concepts WHERE subtopic_id = ?').all(subtopicId)
    : db.prepare('SELECT * FROM concepts').all();
  res.json(concepts);
});

app.get('/learner', (req, res) => {
  const userId = req.query.userId || 'demo-user';
  res.json(ensureLearner(userId));
});

app.post('/update-learner', (req, res) => {
  const learner = req.body;
  saveLearner(learner);
  res.json({ ok: true });
});

app.get('/next-question', (req, res) => {
  const userId = req.query.userId || 'demo-user';
  const conceptId = req.query.conceptId || 'c1';
  const learner = ensureLearner(userId);
  const mastery = learner.concept_mastery[conceptId] ?? 0.3;
  const difficulty = pickDifficulty(mastery);

  let q = db.prepare('SELECT * FROM questions WHERE concept_id = ? AND difficulty = ? ORDER BY RANDOM() LIMIT 1').get(conceptId, difficulty);
  if (!q) q = db.prepare('SELECT * FROM questions WHERE concept_id = ? ORDER BY RANDOM() LIMIT 1').get(conceptId);

  const session = db.prepare('SELECT * FROM sessions WHERE user_id = ? AND concept_id = ? ORDER BY id DESC LIMIT 1').get(userId, conceptId);
  let attemptCount = 0;
  if (!session || session.question_id !== q.id) {
    db.prepare('INSERT INTO sessions (user_id, concept_id, question_id, attempt_count) VALUES (?, ?, ?, 0)').run(userId, conceptId, q.id);
  } else {
    attemptCount = session.attempt_count;
  }

  res.json({
    id: q.id,
    concept_id: q.concept_id,
    type: q.type,
    prompt: q.prompt,
    options: JSON.parse(q.options),
    difficulty: q.difficulty,
    kc: q.kc,
    attemptCount
  });
});

app.post('/submit-answer', (req, res) => {
  const { userId = 'demo-user', conceptId, questionId, answer } = req.body;
  const learner = ensureLearner(userId);
  const q = db.prepare('SELECT * FROM questions WHERE id = ?').get(questionId);
  if (!q) return res.status(404).json({ error: 'Question not found' });

  const correct = String(answer).trim().toLowerCase() === String(q.answer).trim().toLowerCase();
  const errorType = correct ? '' : classifyError(q, answer);

  const session = db.prepare('SELECT * FROM sessions WHERE user_id = ? AND concept_id = ? AND question_id = ? ORDER BY id DESC LIMIT 1').get(userId, conceptId, questionId);
  const attemptCount = (session?.attempt_count ?? 0) + 1;
  db.prepare('UPDATE sessions SET attempt_count = ? WHERE id = ?').run(attemptCount, session.id);

  const updated = updateLearner(learner, { conceptId, kc: q.kc, correct, errorType });
  const mastery = updated.concept_mastery[conceptId] ?? 0.3;
  const decision = pedagogicalDecision({ correct, attemptCount, mastery, errorType });

  if (decision.action === 'hint') updated.hints_used += 1;
  updated.interaction_history.push({
    ts: new Date().toISOString(),
    conceptId,
    questionId,
    answer,
    correct,
    errorType,
    decision
  });
  saveLearner(updated);

  const hints = JSON.parse(q.hints);
  res.json({
    correct,
    mastery,
    decision,
    feedback: correct ? 'Correct!' : 'Not quite.',
    hint: decision.action === 'hint' ? hints[decision.hintLevel - 1] : null,
    explanation: decision.action === 'explanation' ? q.explanation : null,
    remedial: decision.action === 'remedial' ? q.remedial : null,
    errorType
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`ATS running on http://localhost:${port}`);
});
