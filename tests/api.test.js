const assert = require('assert');
const { calculateDifficulty } = require('../server/services/difficultyService');
const { generateMCQsForArticle } = require('../server/services/quizService');

const sampleText = "Autonomous systems and quantum artificial intelligence are accelerating global computational paradigms across international scientific institutions. Multi-tiered neural architectures evaluate intricate data points with unprecedented precision and operational efficiency.";

const difficultyResult = calculateDifficulty(sampleText);
assert.ok(difficultyResult.difficulty, 'Difficulty must be defined');
assert.ok(difficultyResult.wordCount > 0, 'Word count must be greater than 0');
assert.ok(difficultyResult.readingTime >= 1, 'Reading time must be at least 1 min');

const mcqs = generateMCQsForArticle({
  id: 1,
  title: "Test Article Title",
  category: "Technology",
  content: sampleText
});

assert.ok(Array.isArray(mcqs), 'MCQs must be an array');
assert.ok(mcqs.length > 0, 'Should generate at least one MCQ');
assert.ok(mcqs[0].question, 'MCQ must have question');
assert.ok(Array.isArray(mcqs[0].options), 'MCQ options must be an array');
assert.ok(mcqs[0].correctAnswer, 'MCQ must have correctAnswer');
assert.ok(mcqs[0].explanation, 'MCQ must have explanation');

console.log('All backend unit tests passed successfully!');
