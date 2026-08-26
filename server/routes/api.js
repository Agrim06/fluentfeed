const express = require('express');
const router = express.Router();
const db = require('../db');
const { fetchAndProcessNews } = require('../services/newsService');

router.get('/dates', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT DISTINCT publishedAt 
      FROM articles 
      ORDER BY publishedAt DESC 
      LIMIT 10
    `).all();
    res.json({ dates: rows.map(r => r.publishedAt) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve dates' });
  }
});

router.get('/news', (req, res) => {
  try {
    const { category, date, difficulty, search } = req.query;
    let query = 'SELECT * FROM articles WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    if (date) {
      query += ' AND publishedAt = ?';
      params.push(date);
    }

    if (difficulty && difficulty !== 'All') {
      query += ' AND LOWER(difficulty) = LOWER(?)';
      params.push(difficulty);
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`);
      params.push(`%${search}%`);
    }

    query += ' ORDER BY publishedAt DESC, id DESC';

    const articles = db.prepare(query).all(...params);

    const quizCountStmt = db.prepare('SELECT COUNT(*) as count FROM quizzes WHERE articleId = ?');
    const enriched = articles.map(art => {
      const q = quizCountStmt.get(art.id);
      return {
        ...art,
        quizCount: q ? q.count : 0
      };
    });

    res.json({
      count: enriched.length,
      articles: enriched
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

router.post('/news/fetch', async (req, res) => {
  try {
    const result = await fetchAndProcessNews();
    res.json({
      message: 'News fetched and processed successfully',
      result
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to execute news fetch' });
  }
});

router.get('/articles/:id', (req, res) => {
  try {
    const articleId = Number(req.params.id);
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(articleId);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const quizzes = db.prepare('SELECT id, question, options FROM quizzes WHERE articleId = ?').all(articleId);
    const parsedQuizzes = quizzes.map(q => ({
      ...q,
      options: JSON.parse(q.options)
    }));

    res.json({
      article: {
        ...article,
        quizzes: parsedQuizzes
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load article' });
  }
});

router.get('/articles/:id/quiz', (req, res) => {
  try {
    const articleId = Number(req.params.id);
    const article = db.prepare('SELECT id, title, category FROM articles WHERE id = ?').get(articleId);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const quizzes = db.prepare('SELECT id, question, options FROM quizzes WHERE articleId = ?').all(articleId);
    
    if (quizzes.length === 0) {
      return res.status(404).json({ error: 'No quizzes found for this article' });
    }

    const parsedQuizzes = quizzes.map(q => ({
      id: q.id,
      question: q.question,
      options: JSON.parse(q.options)
    }));

    res.json({
      articleId: article.id,
      articleTitle: article.title,
      category: article.category,
      totalQuestions: parsedQuizzes.length,
      questions: parsedQuizzes
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve quiz' });
  }
});

router.post('/quiz/:articleId/submit', (req, res) => {
  try {
    const articleId = Number(req.params.articleId);
    const { userAnswers } = req.body;

    if (!userAnswers || typeof userAnswers !== 'object') {
      return res.status(400).json({ error: 'Missing userAnswers object in request body' });
    }

    const dbQuestions = db.prepare('SELECT id, question, options, correctAnswer, explanation FROM quizzes WHERE articleId = ?').all(articleId);

    if (dbQuestions.length === 0) {
      return res.status(404).json({ error: 'No quiz found for this article' });
    }

    let score = 0;
    const totalQuestions = dbQuestions.length;
    const results = [];

    for (const q of dbQuestions) {
      const selectedAnswer = userAnswers[q.id] || null;
      const isCorrect = selectedAnswer === q.correctAnswer;
      if (isCorrect) {
        score++;
      }

      results.push({
        questionId: q.id,
        question: q.question,
        options: JSON.parse(q.options),
        userAnswer: selectedAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      });
    }

    const insertSubmission = db.prepare(`
      INSERT INTO quiz_submissions (articleId, score, totalQuestions, answers, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertSubmission.run(
      articleId,
      score,
      totalQuestions,
      JSON.stringify(userAnswers),
      new Date().toISOString()
    );

    const percentage = Math.round((score / totalQuestions) * 100);

    res.json({
      articleId,
      score,
      totalQuestions,
      percentage,
      passed: percentage >= 70,
      results
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to evaluate quiz submission' });
  }
});

router.get('/stats', (req, res) => {
  try {
    const totalArticles = db.prepare('SELECT COUNT(*) as c FROM articles').get().c;
    const totalQuizzes = db.prepare('SELECT COUNT(*) as c FROM quizzes').get().c;
    const submissions = db.prepare('SELECT score, totalQuestions FROM quiz_submissions').all();

    let totalScore = 0;
    let totalMaxScore = 0;
    for (const s of submissions) {
      totalScore += s.score;
      totalMaxScore += s.totalQuestions;
    }

    const avgScore = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

    res.json({
      totalArticles,
      totalQuizzes,
      quizzesTaken: submissions.length,
      averageScorePercentage: avgScore
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate stats' });
  }
});

module.exports = router;
