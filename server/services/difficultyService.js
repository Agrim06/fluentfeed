function countSyllables(word) {
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!cleanWord) return 1;
  if (cleanWord.length <= 3) return 1;
  const matches = cleanWord.match(/[aeiouy]{1,2}/g);
  let syllables = matches ? matches.length : 1;
  if (cleanWord.endsWith('e') && !cleanWord.endsWith('le')) {
    syllables = Math.max(1, syllables - 1);
  }
  return Math.max(1, syllables);
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

  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);

  let totalCharacters = 0;
  let totalSyllables = 0;
  let complexWords = 0;

  for (const word of words) {
    totalCharacters += word.length;
    const syllables = countSyllables(word);
    totalSyllables += syllables;
    if (syllables >= 3) {
      complexWords += 1;
    }
  }

  const avgWordLength = wordCount > 0 ? (totalCharacters / wordCount).toFixed(1) : 0;
  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = wordCount > 0 ? totalSyllables / wordCount : 1;

  const readingEaseScore = Math.max(0, Math.min(100, Math.round(
    206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord)
  )));

  let difficulty = 'Medium';
  if (readingEaseScore >= 70 && avgWordLength < 5.0) {
    difficulty = 'Easy';
  } else if (readingEaseScore < 50 || avgWordLength > 5.5 || (complexWords / wordCount) > 0.18) {
    difficulty = 'Hard';
  }

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    difficulty,
    wordCount,
    readingTime,
    avgWordLength: Number(avgWordLength),
    readingEaseScore
  };
}

module.exports = {
  calculateDifficulty
};
