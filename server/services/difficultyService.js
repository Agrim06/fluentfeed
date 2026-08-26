function countSyllables(word) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return 1;
  if (clean.length <= 3) return 1;
  const matches = clean.match(/[aeiouy]{1,2}/g);
  let count = matches ? matches.length : 1;
  if (clean.endsWith('e') && !clean.endsWith('le')) {
    count = Math.max(1, count - 1);
  }
  return Math.max(1, count);
}

function calculateDifficulty(text) {
  if (!text) {
    return {
      difficulty: 'Medium',
      wordCount: 0,
      readingTime: 1,
      avgWordLength: 0,
      readingEaseScore: 60
    };
  }

  const cleanWords = text.replace(/[^a-zA-Z\s]/g, ' ').trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = cleanWords.length;
  const rawSentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5);
  const sentenceCount = Math.max(1, rawSentences.length);

  let totalLetters = 0;
  let totalSyllables = 0;
  let complexWords = 0;

  for (const w of cleanWords) {
    totalLetters += w.length;
    const syl = countSyllables(w);
    totalSyllables += syl;
    if (syl >= 3) {
      complexWords++;
    }
  }

  const avgWordLength = wordCount > 0 ? Number((totalLetters / wordCount).toFixed(2)) : 0;
  const complexRatio = wordCount > 0 ? complexWords / wordCount : 0;

  let difficulty = 'Medium';
  if (avgWordLength < 6.95) {
    difficulty = 'Easy';
  } else if (avgWordLength >= 7.15) {
    difficulty = 'Hard';
  }

  const readingEaseScore = Math.max(20, Math.min(85, Math.round(100 - (avgWordLength * 8) - (complexRatio * 30))));
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    difficulty,
    wordCount,
    readingTime,
    avgWordLength,
    readingEaseScore
  };
}

module.exports = {
  calculateDifficulty
};
