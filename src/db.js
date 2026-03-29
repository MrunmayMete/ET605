import Database from 'better-sqlite3';
import { DOMAIN } from './domainData.js';

const db = new Database('ats.db');

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS chapters (id TEXT PRIMARY KEY, title TEXT);
    CREATE TABLE IF NOT EXISTS subtopics (id TEXT PRIMARY KEY, chapter_id TEXT, title TEXT);
    CREATE TABLE IF NOT EXISTS concepts (
      id TEXT PRIMARY KEY,
      subtopic_id TEXT,
      title TEXT,
      content TEXT,
      example TEXT,
      story_example TEXT,
      remedial TEXT
    );
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      concept_id TEXT,
      type TEXT,
      prompt TEXT,
      options TEXT,
      answer TEXT,
      difficulty TEXT,
      kc TEXT,
      hints TEXT,
      explanation TEXT,
      remedial TEXT
    );
    CREATE TABLE IF NOT EXISTS learners (
      user_id TEXT PRIMARY KEY,
      concept_mastery TEXT,
      kc_mastery TEXT,
      accuracy REAL,
      attempts INTEGER,
      hints_used INTEGER,
      error_type TEXT,
      interaction_history TEXT
    );
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      concept_id TEXT,
      question_id TEXT,
      attempt_count INTEGER DEFAULT 0
    );
  `);

  const chapter = DOMAIN.chapter;
  db.prepare('INSERT OR IGNORE INTO chapters (id, title) VALUES (?, ?)').run(chapter.id, chapter.title);

  const insertSubtopic = db.prepare('INSERT OR IGNORE INTO subtopics (id, chapter_id, title) VALUES (?, ?, ?)');
  const insertConcept = db.prepare(
    'INSERT OR IGNORE INTO concepts (id, subtopic_id, title, content, example, story_example, remedial) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const insertQuestion = db.prepare(
    'INSERT OR IGNORE INTO questions (id, concept_id, type, prompt, options, answer, difficulty, kc, hints, explanation, remedial) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  for (const st of chapter.subtopics) {
    insertSubtopic.run(st.id, chapter.id, st.title);
    for (const c of st.concepts) {
      insertConcept.run(c.id, st.id, c.title, c.content, c.example, c.storyExample, c.remedial);
      for (const q of c.questions) {
        insertQuestion.run(
          q.id,
          c.id,
          q.type,
          q.prompt,
          JSON.stringify(q.options || []),
          q.answer,
          q.difficulty,
          q.kc,
          JSON.stringify(q.hints || []),
          q.explanation,
          q.remedial
        );
      }
    }
  }
}

export function getDb() {
  return db;
}
