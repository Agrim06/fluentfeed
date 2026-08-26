const Parser = require('rss-parser');
const db = require('../db');
const { calculateDifficulty } = require('./difficultyService');
const { generateMCQsForArticle } = require('./quizService');

const parser = new Parser({
  timeout: 5000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
});

const CATEGORIES = ['Technology', 'Business', 'Sports', 'World'];

const RSS_FEEDS = {
  Technology: [
    'https://feeds.bbci.co.uk/news/technology/rss.xml',
    'https://www.wired.com/feed/category/gear/latest/rss'
  ],
  Business: [
    'https://feeds.bbci.co.uk/news/business/rss.xml',
    'https://search.cnbc.com/rs/search/view.html?partnerId=2000&keywords=business&sort=date&output=rss'
  ],
  Sports: [
    'https://feeds.bbci.co.uk/sport/rss.xml',
    'https://www.espn.com/espn/rss/news'
  ],
  World: [
    'https://feeds.bbci.co.uk/news/world/rss.xml',
    'https://feeds.npr.org/1004/rss.xml'
  ]
};

async function fetchFromNewsApiOrg(category) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];

  let url;
  if (category === 'Technology') {
    url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=10&apiKey=${apiKey}`;
  } else if (category === 'Business') {
    url = `https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=10&apiKey=${apiKey}`;
  } else if (category === 'Sports') {
    url = `https://newsapi.org/v2/top-headlines?category=sports&language=en&pageSize=10&apiKey=${apiKey}`;
  } else {
    url = `https://newsapi.org/v2/top-headlines?category=general&q=world&language=en&pageSize=10&apiKey=${apiKey}`;
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'FluentFeed/1.0'
      }
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status === 'ok' && data.articles && data.articles.length > 0) {
      return data.articles
        .filter(a => a.title && a.title !== '[Removed]')
        .map(a => ({
          title: a.title,
          description: a.description || a.title,
          content: a.content || a.description || a.title,
          image: a.urlToImage || null,
          source: a.source ? a.source.name : 'NewsAPI Network',
          category: category,
          publishedAt: a.publishedAt ? a.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0],
          articleUrl: a.url
        }));
    }
  } catch (err) {
    return [];
  }
  return [];
}

async function fetchFromRealWorldRss(category) {
  const feeds = RSS_FEEDS[category] || [];
  const articles = [];

  for (const feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);
      if (feed && feed.items) {
        for (const item of feed.items.slice(0, 3)) {
          let imageUrl = null;
          if (item.enclosure && item.enclosure.url) {
            imageUrl = item.enclosure.url;
          } else if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
            imageUrl = item['media:content'].$.url;
          } else if (item['media:thumbnail'] && item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
            imageUrl = item['media:thumbnail'].$.url;
          }

          const pubDate = item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

          articles.push({
            title: item.title ? item.title.trim() : `Latest ${category} Report`,
            description: item.contentSnippet || item.summary || item.title || '',
            content: item.content || item['content:encoded'] || item.contentSnippet || item.title || '',
            image: imageUrl,
            source: feed.title ? feed.title.replace(/RSS Feed|Latest News/gi, '').trim() : 'BBC / Global Wire',
            category: category,
            publishedAt: pubDate,
            articleUrl: item.link || item.guid || `https://fluentfeed.internal/${category.toLowerCase()}/${Date.now()}`
          });
        }
      }
      if (articles.length >= 2) break;
    } catch (err) {
      continue;
    }
  }

  return articles;
}

function expandContentToLearningStandard(title, description, rawContent, category) {
  let cleanText = (rawContent || description || title)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleanText.split(/\s+/);
  if (words.length >= 480 && words.length <= 720) {
    return cleanText;
  }

  const categoryContexts = {
    Technology: `From an architectural and engineering perspective, these technological developments signify a notable shift in system design principles. Technical practitioners emphasize that deploying scalable, fault-tolerant infrastructure requires a delicate balance between computational performance, cryptographic integrity, and energy consumption. As organizations integrate these methodologies into operational pipelines, automated verification protocols and machine-learning diagnostics are becoming indispensable. Industry standard bodies continue to collaborate internationally to establish transparent governance metrics, ensuring that emergent computing paradigms align with safety, privacy, and sustainability benchmarks.`,
    Business: `In the broader macroeconomic and corporate sphere, this development underscores the strategic realignments taking place across international markets. Financial analysts and investment strategists highlight that resilience in supply networks, disciplined capital allocation, and sustainable operational models are paramount for long-term shareholder value. Enterprises that proactively anticipate regulatory transformations and diversify their revenue streams are positioning themselves favorably against inflationary pressures and geopolitical headwinds. The convergence of fiscal prudence and market innovation remains a defining trait of modern commercial leadership.`,
    Sports: `Across the competitive sports landscape, this milestone demonstrates the powerful convergence of athletic discipline, tactical preparation, and physiological science. Modern training regimens increasingly leverage data-driven analytics and biomechanical assessments to optimize athlete performance while preventing chronic strain injuries. Coaching philosophies now emphasize psychological adaptability and strategic situational awareness as much as raw physical endurance. These high-caliber achievements inspire grassroots athletic academies globally, demonstrating the enduring impact of structured mentorship and perseverance.`,
    World: `Within the international diplomatic arena, this event illustrates the ongoing necessity for constructive multilateral engagement and institutional transparency. Policy experts and international observers note that addressing interconnected cross-border challenges—ranging from economic stability to environmental stewardship—demands sustained diplomatic cooperation and evidence-based policy formulation. By prioritizing equitable dialogue and mutual accountability, sovereign nations can build enduring frameworks that foster international peace, regional security, and socio-economic progress.`
  };

  const extraContext = categoryContexts[category] || categoryContexts.World;
  const learningSynthesis = `For students of the English language and international communications, analyzing contemporary journalistic discourse offers invaluable educational exposure. Authentic reporting combines advanced syntactic structures, descriptive adjectives, and specialized subject terminology that collectively enhance both contextual reading comprehension and active vocabulary recall. Engaging with such nuanced editorial prose sharpens linguistic precision, critical thinking faculties, and global awareness.`;

  return `${cleanText}\n\n${extraContext}\n\n${learningSynthesis}`;
}

async function fetchAndProcessNews() {
  const insertArticleStmt = db.prepare(`
    INSERT INTO articles (
      title, description, content, image, source, category, publishedAt, articleUrl, difficulty, wordCount, readingTime
    ) VALUES (
      @title, @description, @content, @image, @source, @category, @publishedAt, @articleUrl, @difficulty, @wordCount, @readingTime
    )
  `);

  const updateArticleStmt = db.prepare(`
    UPDATE articles SET
      title = @title,
      description = @description,
      content = @content,
      image = @image,
      source = @source,
      category = @category,
      publishedAt = @publishedAt,
      difficulty = @difficulty,
      wordCount = @wordCount,
      readingTime = @readingTime
    WHERE articleUrl = @articleUrl
  `);

  const insertQuizStmt = db.prepare(`
    INSERT INTO quizzes (
      articleId, question, options, correctAnswer, explanation
    ) VALUES (
      @articleId, @question, @options, @correctAnswer, @explanation
    )
  `);

  const findByUrlStmt = db.prepare('SELECT id FROM articles WHERE articleUrl = ?');
  const findByTitleStmt = db.prepare('SELECT id FROM articles WHERE LOWER(TRIM(title)) = LOWER(TRIM(?))');

  let insertedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  const defaultCategoryImages = {
    Technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    Business: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    World: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80'
  };

  for (const category of CATEGORIES) {
    let rawArticles = await fetchFromNewsApiOrg(category);

    if (!rawArticles || rawArticles.length === 0) {
      rawArticles = await fetchFromRealWorldRss(category);
    }

    for (const item of rawArticles) {
      const fullContent = expandContentToLearningStandard(
        item.title,
        item.description,
        item.content,
        category
      );

      const stats = calculateDifficulty(fullContent);

      const articlePayload = {
        title: item.title,
        description: item.description ? item.description.substring(0, 180) : item.title,
        content: fullContent,
        image: item.image || defaultCategoryImages[category],
        source: item.source || 'NewsAPI Source',
        category: category,
        publishedAt: item.publishedAt || new Date().toISOString().split('T')[0],
        articleUrl: item.articleUrl,
        difficulty: stats.difficulty,
        wordCount: stats.wordCount,
        readingTime: stats.readingTime
      };

      const existingByUrl = findByUrlStmt.get(articlePayload.articleUrl);
      const existingByTitle = findByTitleStmt.get(articlePayload.title);

      if (existingByUrl) {
        updateArticleStmt.run(articlePayload);
        updatedCount++;
      } else if (existingByTitle) {
        skippedCount++;
      } else {
        const result = insertArticleStmt.run(articlePayload);
        const newArticleId = result.lastInsertRowid;
        insertedCount++;

        const mcqs = generateMCQsForArticle({
          id: newArticleId,
          title: articlePayload.title,
          category: articlePayload.category,
          content: fullContent
        });

        for (const mcq of mcqs) {
          insertQuizStmt.run({
            articleId: newArticleId,
            question: mcq.question,
            options: JSON.stringify(mcq.options),
            correctAnswer: mcq.correctAnswer,
            explanation: mcq.explanation
          });
        }
      }
    }
  }

  return {
    success: true,
    insertedCount,
    updatedCount,
    skippedCount,
    totalProcessed: insertedCount + updatedCount + skippedCount
  };
}

module.exports = {
  fetchAndProcessNews,
  expandContentToLearningStandard
};
