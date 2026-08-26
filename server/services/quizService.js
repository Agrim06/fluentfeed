function extractKeyTerms(text) {
  const commonWords = new Set([
    'about', 'above', 'after', 'again', 'against', 'all', 'and', 'any', 'are', 'aren',
    'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
    'can', 'could', 'did', 'does', 'doing', 'down', 'during', 'each', 'few', 'for',
    'from', 'further', 'had', 'has', 'have', 'having', 'her', 'here', 'hers', 'herself',
    'him', 'himself', 'his', 'how', 'into', 'its', 'itself', 'just', 'more', 'most',
    'not', 'off', 'once', 'only', 'other', 'our', 'ours', 'ourselves', 'out', 'over',
    'own', 'same', 'she', 'should', 'some', 'such', 'than', 'that', 'the', 'their',
    'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those',
    'through', 'too', 'under', 'until', 'very', 'was', 'were', 'what', 'when', 'where',
    'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'will', 'also', 'said'
  ]);

  const words = text.match(/\b[A-Za-z]{6,}\b/g) || [];
  const frequency = {};
  for (const word of words) {
    const lower = word.toLowerCase();
    if (!commonWords.has(lower)) {
      frequency[lower] = (frequency[lower] || 0) + 1;
    }
  }

  return Object.keys(frequency).sort((a, b) => frequency[b] - frequency[a]).slice(0, 10);
}

function generateMCQsForArticle(article) {
  const sentences = article.content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 40);
  const terms = extractKeyTerms(article.content);
  const questions = [];

  if (sentences.length > 0) {
    const s1 = sentences[0];
    questions.push({
      question: `According to the article, what is the primary focus of "${article.title}"?`,
      options: [
        `${s1.substring(0, 65)}...`,
        `A decline in international market interest across related sectors.`,
        `An unexpected legal ban enacted by regional authorities.`,
        `A historical review with no modern practical implications.`
      ],
      correctAnswer: `${s1.substring(0, 65)}...`,
      explanation: `The opening paragraph establishes that: "${s1}."`
    });
  }

  if (sentences.length > 2) {
    const s2 = sentences[Math.min(2, sentences.length - 1)];
    const fakeOpts = [
      'Immediate reduction in consumer expenditures',
      'Stricter global supply chain tariffs',
      'Technological obsolescence of existing systems'
    ];
    questions.push({
      question: `What key development is highlighted regarding this event in ${article.category}?`,
      options: [
        s2.substring(0, 75),
        fakeOpts[0],
        fakeOpts[1],
        fakeOpts[2]
      ].sort(() => Math.random() - 0.5),
      correctAnswer: s2.substring(0, 75),
      explanation: `The article directly states that ${s2}.`
    });
  }

  if (terms.length > 0) {
    const term = terms[0];
    const capitalized = term.charAt(0).toUpperCase() + term.slice(1);
    questions.push({
      question: `Vocabulary in Context: What role does the concept of "${capitalized}" play in this text?`,
      options: [
        `It represents a central theme and key operating factor in the reported subject.`,
        `It is cited merely as an obsolete historical footnote.`,
        `It is described as an irrelevant metric discarded by analysts.`,
        `It is exclusively used as a negative criticism by competitors.`
      ],
      correctAnswer: `It represents a central theme and key operating factor in the reported subject.`,
      explanation: `"${capitalized}" is one of the most prominent subject terms analyzed throughout the article.`
    });
  }

  if (sentences.length > 4) {
    const sLast = sentences[sentences.length - 1];
    questions.push({
      question: `What conclusion or future outlook is drawn by the article?`,
      options: [
        sLast.substring(0, 70),
        'All ongoing developments will be halted by the end of next month.',
        'Industry experts foresee zero impact on regular consumers.',
        'Market participants are advised to abandon related efforts.'
      ].sort(() => Math.random() - 0.5),
      correctAnswer: sLast.substring(0, 70),
      explanation: `The final analysis concludes with: "${sLast}."`
    });
  }

  return questions;
}

module.exports = {
  generateMCQsForArticle
};
