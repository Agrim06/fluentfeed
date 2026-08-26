const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'fluentfeed.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    image TEXT,
    source TEXT,
    category TEXT NOT NULL,
    publishedAt TEXT NOT NULL,
    articleUrl TEXT UNIQUE,
    difficulty TEXT NOT NULL DEFAULT 'Medium',
    wordCount INTEGER DEFAULT 0,
    readingTime INTEGER DEFAULT 3
  );

  CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    articleId INTEGER NOT NULL,
    question TEXT NOT NULL,
    options TEXT NOT NULL,
    correctAnswer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    FOREIGN KEY(articleId) REFERENCES articles(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS quiz_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    articleId INTEGER NOT NULL,
    score INTEGER NOT NULL,
    totalQuestions INTEGER NOT NULL,
    answers TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY(articleId) REFERENCES articles(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
  CREATE INDEX IF NOT EXISTS idx_articles_publishedAt ON articles(publishedAt);
  CREATE INDEX IF NOT EXISTS idx_quizzes_articleId ON quizzes(articleId);
`);

module.exports = db;
