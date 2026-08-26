const state = {
  dates: [],
  selectedDate: 'All',
  selectedCategory: 'All',
  selectedDifficulty: 'All',
  searchQuery: '',
  articles: [],
  currentArticle: null,
  currentQuiz: null,
  quizCurrentIndex: 0,
  quizUserAnswers: {}
};

const dom = {
  dashboardView: document.getElementById('dashboardView'),
  readingView: document.getElementById('readingView'),
  quizView: document.getElementById('quizView'),
  resultsView: document.getElementById('resultsView'),
  
  brandHomeBtn: document.getElementById('brandHomeBtn'),
  statQuizzes: document.getElementById('statQuizzes'),
  statAvgScore: document.getElementById('statAvgScore'),
  fetchNewsBtn: document.getElementById('fetchNewsBtn'),
  fetchNewsBtnText: document.getElementById('fetchNewsBtnText'),
  
  dateChipsContainer: document.getElementById('dateChipsContainer'),
  categoryTabs: document.getElementById('categoryTabs'),
  searchInput: document.getElementById('searchInput'),
  difficultyFilter: document.getElementById('difficultyFilter'),
  articlesViewTitle: document.getElementById('articlesViewTitle'),
  articlesCountBadge: document.getElementById('articlesCountBadge'),
  articlesGrid: document.getElementById('articlesGrid'),
  emptyState: document.getElementById('emptyState'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),
  
  readingProgressBar: document.getElementById('readingProgressBar'),
  backToDashBtn: document.getElementById('backToDashBtn'),
  startQuizFromReaderBtn: document.getElementById('startQuizFromReaderBtn'),
  readerQuizCount: document.getElementById('readerQuizCount'),
  readerCategory: document.getElementById('readerCategory'),
  readerDifficulty: document.getElementById('readerDifficulty'),
  readerReadTime: document.getElementById('readerReadTime'),
  readerWordCount: document.getElementById('readerWordCount'),
  readerSource: document.getElementById('readerSource'),
  readerDate: document.getElementById('readerDate'),
  readerTitle: document.getElementById('readerTitle'),
  readerDesc: document.getElementById('readerDesc'),
  readerImage: document.getElementById('readerImage'),
  readerContent: document.getElementById('readerContent'),
  readerBottomQuizBtn: document.getElementById('readerBottomQuizBtn'),
  
  backToReaderBtn: document.getElementById('backToReaderBtn'),
  quizHeaderProgress: document.getElementById('quizHeaderProgress'),
  quizCategoryBadge: document.getElementById('quizCategoryBadge'),
  quizArticleTitle: document.getElementById('quizArticleTitle'),
  quizProgressBarFill: document.getElementById('quizProgressBarFill'),
  quizQuestionsContainer: document.getElementById('quizQuestionsContainer'),
  prevQuestionBtn: document.getElementById('prevQuestionBtn'),
  nextQuestionBtn: document.getElementById('nextQuestionBtn'),
  submitQuizBtn: document.getElementById('submitQuizBtn'),
  
  resultsHeading: document.getElementById('resultsHeading'),
  resultsScoreNumber: document.getElementById('resultsScoreNumber'),
  resultsScorePercent: document.getElementById('resultsScorePercent'),
  resultsMessage: document.getElementById('resultsMessage'),
  resultsBreakdownList: document.getElementById('resultsBreakdownList'),
  retakeQuizBtn: document.getElementById('retakeQuizBtn'),
  backToHomeFromResultsBtn: document.getElementById('backToHomeFromResultsBtn'),
  
  toast: document.getElementById('toastNotification'),
  toastMessage: document.getElementById('toastMessage')
};

function showToast(message) {
  if (!dom.toast || !dom.toastMessage) return;
  dom.toastMessage.textContent = message;
  dom.toast.classList.remove('hidden');
  setTimeout(() => {
    dom.toast.classList.add('hidden');
  }, 3500);
}

function switchView(viewName) {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (dom.readingProgressBar) dom.readingProgressBar.style.width = '0%';
  
  dom.dashboardView.classList.remove('active');
  dom.readingView.classList.remove('active');
  dom.quizView.classList.remove('active');
  dom.resultsView.classList.remove('active');

  if (viewName === 'dashboard') {
    dom.dashboardView.classList.add('active');
  } else if (viewName === 'reading') {
    dom.readingView.classList.add('active');
  } else if (viewName === 'quiz') {
    dom.quizView.classList.add('active');
  } else if (viewName === 'results') {
    dom.resultsView.classList.add('active');
  }
}

async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    if (res.ok) {
      const data = await res.json();
      if (dom.statQuizzes) dom.statQuizzes.textContent = data.quizzesTaken;
      if (dom.statAvgScore) dom.statAvgScore.textContent = `${data.averageScorePercentage}%`;
    }
  } catch (err) {
    console.error(err);
  }
}

function formatDateDisplay(dateStr) {
  const dateObj = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const diffDays = Math.round((today - dateObj) / (1000 * 60 * 60 * 24));
  
  let dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  if (diffDays === 0) dayLabel = 'Today';
  else if (diffDays === 1) dayLabel = 'Yesterday';

  const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { dayLabel, dateFormatted };
}

async function loadDates() {
  try {
    const res = await fetch('/api/dates');
    if (res.ok) {
      const data = await res.json();
      state.dates = data.dates || [];
      renderDateChips();
    }
  } catch (err) {
    console.error(err);
  }
}

function renderDateChips() {
  dom.dateChipsContainer.innerHTML = '';
  
  const allChip = document.createElement('div');
  allChip.className = `date-chip ${state.selectedDate === 'All' ? 'active' : ''}`;
  allChip.innerHTML = `
    <span class="date-chip-day">Past 5 Days</span>
    <span class="date-chip-date">All Dates</span>
  `;
  allChip.addEventListener('click', () => {
    state.selectedDate = 'All';
    renderDateChips();
    loadNews();
  });
  dom.dateChipsContainer.appendChild(allChip);

  state.dates.forEach(dateStr => {
    const { dayLabel, dateFormatted } = formatDateDisplay(dateStr);
    const chip = document.createElement('div');
    chip.className = `date-chip ${state.selectedDate === dateStr ? 'active' : ''}`;
    chip.innerHTML = `
      <span class="date-chip-day">${dayLabel}</span>
      <span class="date-chip-date">${dateFormatted}</span>
    `;
    chip.addEventListener('click', () => {
      state.selectedDate = dateStr;
      renderDateChips();
      loadNews();
    });
    dom.dateChipsContainer.appendChild(chip);
  });
}

async function loadNews() {
  dom.articlesGrid.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--color-muted); font-size: 0.9rem;">
      Loading stories...
    </div>
  `;
  dom.emptyState.classList.add('hidden');

  try {
    const params = new URLSearchParams();
    if (state.selectedCategory && state.selectedCategory !== 'All') {
      params.append('category', state.selectedCategory);
    }
    if (state.selectedDate && state.selectedDate !== 'All') {
      params.append('date', state.selectedDate);
    }
    if (state.selectedDifficulty && state.selectedDifficulty !== 'All') {
      params.append('difficulty', state.selectedDifficulty);
    }
    if (state.searchQuery) {
      params.append('search', state.searchQuery);
    }

    const res = await fetch(`/api/news?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      state.articles = data.articles || [];
      renderArticles();
    }
  } catch (err) {
    dom.articlesGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--color-incorrect); font-size: 0.9rem;">
        Failed to load articles. Please verify server connection.
      </div>
    `;
  }
}

function renderArticles() {
  dom.articlesGrid.innerHTML = '';
  dom.articlesCountBadge.textContent = `${state.articles.length} article${state.articles.length === 1 ? '' : 's'}`;

  let titlePrefix = 'All Curated Stories';
  if (state.selectedCategory !== 'All') {
    titlePrefix = `${state.selectedCategory} Stories`;
  }

  if (state.selectedDate && state.selectedDate !== 'All') {
    const { dayLabel, dateFormatted } = formatDateDisplay(state.selectedDate);
    dom.articlesViewTitle.textContent = `${titlePrefix} for ${dayLabel} (${dateFormatted})`;
  } else {
    dom.articlesViewTitle.textContent = `${titlePrefix} (Past 5 Days)`;
  }

  if (state.articles.length === 0) {
    dom.emptyState.classList.remove('hidden');
    return;
  }

  dom.emptyState.classList.add('hidden');

  state.articles.forEach(art => {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.innerHTML = `
      <div class="card-image-wrap">
        <img src="${art.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'}" alt="${art.title}" loading="lazy">
        <div class="card-floating-badges">
          <span class="badge badge-${art.category}">${art.category}</span>
          <span class="badge badge-${art.difficulty}">${art.difficulty}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-meta-line">
          <span class="card-source">${art.source}</span>
          <span>${art.publishedAt} • ${art.readingTime || 3}m read</span>
        </div>
        <h3 class="card-title">${art.title}</h3>
        <p class="card-desc">${art.description}</p>
        <div class="card-footer">
          <button class="btn btn-secondary read-article-btn" data-id="${art.id}">
            Read Story
          </button>
          <button class="btn btn-primary play-quiz-btn" data-id="${art.id}">
            Play Quiz (${art.quizCount || 4})
          </button>
        </div>
      </div>
    `;

    card.querySelector('.read-article-btn').addEventListener('click', () => openReader(art.id));
    card.querySelector('.play-quiz-btn').addEventListener('click', () => startQuiz(art.id));

    dom.articlesGrid.appendChild(card);
  });
}

async function openReader(articleId) {
  try {
    const res = await fetch(`/api/articles/${articleId}`);
    if (!res.ok) throw new Error('Could not load article');
    const data = await res.json();
    const art = data.article;
    state.currentArticle = art;

    dom.readerCategory.textContent = art.category;
    dom.readerDifficulty.textContent = art.difficulty;
    dom.readerReadTime.textContent = `${art.readingTime || 3} min read`;
    dom.readerWordCount.textContent = `${art.wordCount || 550} words`;
    dom.readerSource.textContent = art.source;
    dom.readerDate.textContent = art.publishedAt;
    dom.readerTitle.textContent = art.title;
    dom.readerDesc.textContent = art.description;
    dom.readerImage.src = art.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';
    
    const quizCount = art.quizzes ? art.quizzes.length : 4;
    dom.readerQuizCount.textContent = quizCount;

    const paragraphs = art.content.split('\n\n');
    dom.readerContent.innerHTML = paragraphs.map(p => {
      const formatted = p.replace(/\b([A-Za-z]{7,})\b/g, (match) => {
        return `<span class="vocab-word" title="Click for vocabulary context">${match}</span>`;
      });
      return `<p>${formatted}</p>`;
    }).join('');

    dom.readerContent.querySelectorAll('.vocab-word').forEach(el => {
      el.addEventListener('click', () => {
        showToast(`Vocabulary note: "${el.textContent}" — Key term used in context.`);
      });
    });

    switchView('reading');
  } catch (err) {
    alert('Failed to load article details');
  }
}

window.addEventListener('scroll', () => {
  if (dom.readingView.classList.contains('active')) {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      dom.readingProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  }
});

async function startQuiz(articleId) {
  try {
    const res = await fetch(`/api/articles/${articleId}/quiz`);
    if (!res.ok) throw new Error('No quiz available');
    const data = await res.json();
    
    state.currentQuiz = data;
    state.quizCurrentIndex = 0;
    state.quizUserAnswers = {};

    dom.quizCategoryBadge.textContent = data.category;
    dom.quizArticleTitle.textContent = data.articleTitle;

    renderQuizQuestion();
    switchView('quiz');
  } catch (err) {
    alert('Failed to load quiz for this article.');
  }
}

function renderQuizQuestion() {
  const quiz = state.currentQuiz;
  const currentQ = quiz.questions[state.quizCurrentIndex];
  const qNum = state.quizCurrentIndex + 1;
  const total = quiz.totalQuestions;

  dom.quizHeaderProgress.textContent = `Question ${qNum} of ${total}`;
  const percentProgress = ((qNum) / total) * 100;
  dom.quizProgressBarFill.style.width = `${percentProgress}%`;

  const selectedAnswer = state.quizUserAnswers[currentQ.id] || null;

  dom.quizQuestionsContainer.innerHTML = `
    <div class="question-block active">
      <div class="question-counter">Question ${qNum} of ${total}</div>
      <h3 class="question-text">${currentQ.question}</h3>
      <div class="options-list">
        ${currentQ.options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isSelected = selectedAnswer === opt;
          return `
            <div class="option-item ${isSelected ? 'selected' : ''}" data-value="${opt.replace(/"/g, '&quot;')}">
              <div class="option-marker">${letter}</div>
              <div class="option-text">${opt}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  dom.quizQuestionsContainer.querySelectorAll('.option-item').forEach(optEl => {
    optEl.addEventListener('click', () => {
      const val = optEl.getAttribute('data-value');
      state.quizUserAnswers[currentQ.id] = val;
      renderQuizQuestion();
    });
  });

  dom.prevQuestionBtn.disabled = state.quizCurrentIndex === 0;

  if (state.quizCurrentIndex === total - 1) {
    dom.nextQuestionBtn.classList.add('hidden');
    dom.submitQuizBtn.classList.remove('hidden');
  } else {
    dom.nextQuestionBtn.classList.remove('hidden');
    dom.submitQuizBtn.classList.add('hidden');
  }
}

async function submitQuiz() {
  const quiz = state.currentQuiz;
  const answeredCount = Object.keys(state.quizUserAnswers).length;

  if (answeredCount < quiz.totalQuestions) {
    const confirmProceed = confirm(`You have answered ${answeredCount} of ${quiz.totalQuestions} questions. Do you wish to submit now?`);
    if (!confirmProceed) return;
  }

  try {
    const res = await fetch(`/api/quiz/${quiz.articleId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userAnswers: state.quizUserAnswers })
    });

    if (!res.ok) throw new Error('Submission failed');
    const result = await res.json();
    renderQuizResults(result);
    loadStats();
  } catch (err) {
    alert('Failed to submit quiz.');
  }
}

function renderQuizResults(result) {
  dom.resultsScoreNumber.textContent = `${result.score}/${result.totalQuestions}`;
  dom.resultsScorePercent.textContent = `${result.percentage}%`;

  if (result.passed) {
    dom.resultsHeading.textContent = 'Quiz Mastered';
    dom.resultsMessage.textContent = `You scored ${result.percentage}%. Your English reading comprehension and contextual vocabulary recall were accurate.`;
  } else {
    dom.resultsHeading.textContent = 'Practice Completed';
    dom.resultsMessage.textContent = `You scored ${result.percentage}%. Review the explanations below to reinforce your understanding of the text.`;
  }

  dom.resultsBreakdownList.innerHTML = result.results.map((r, idx) => {
    return `
      <div class="breakdown-item ${r.isCorrect ? 'correct' : 'incorrect'}">
        <div class="breakdown-q-title">Q${idx + 1}: ${r.question}</div>
        <div class="breakdown-answers-row">
          <div>Your Selection: <span class="user-ans-text">${r.userAnswer || 'No answer selected'}</span> ${r.isCorrect ? '✓' : '✗'}</div>
          ${!r.isCorrect ? `<div>Correct Answer: <span class="correct-ans-text">${r.correctAnswer}</span></div>` : ''}
        </div>
        <div class="breakdown-explanation">
          <strong>Context & Explanation:</strong> ${r.explanation}
        </div>
      </div>
    `;
  }).join('');

  switchView('results');
}

async function handleSyncNews() {
  dom.fetchNewsBtn.disabled = true;
  dom.fetchNewsBtnText.textContent = 'Syncing...';

  try {
    const res = await fetch('/api/news/fetch', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      showToast(`News Synced: ${data.result.insertedCount} new, ${data.result.updatedCount} updated.`);
      await loadDates();
      await loadNews();
      await loadStats();
    } else {
      showToast('Failed to sync news.');
    }
  } catch (err) {
    showToast('Network error while syncing.');
  } finally {
    dom.fetchNewsBtn.disabled = false;
    dom.fetchNewsBtnText.textContent = 'Sync Live News';
  }
}

function selectCategory(category) {
  state.selectedCategory = category;
  dom.categoryTabs.querySelectorAll('.tab-item').forEach(btn => {
    if (btn.getAttribute('data-category') === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  loadNews();
}

function setupEventListeners() {
  dom.brandHomeBtn.addEventListener('click', () => {
    state.selectedCategory = 'All';
    state.selectedDate = 'All';
    dom.categoryTabs.querySelectorAll('.tab-item').forEach(b => b.classList.toggle('active', b.getAttribute('data-category') === 'All'));
    renderDateChips();
    loadNews();
    switchView('dashboard');
  });

  dom.backToDashBtn.addEventListener('click', () => switchView('dashboard'));
  dom.backToHomeFromResultsBtn.addEventListener('click', () => switchView('dashboard'));

  dom.startQuizFromReaderBtn.addEventListener('click', () => {
    if (state.currentArticle) startQuiz(state.currentArticle.id);
  });
  dom.readerBottomQuizBtn.addEventListener('click', () => {
    if (state.currentArticle) startQuiz(state.currentArticle.id);
  });

  dom.backToReaderBtn.addEventListener('click', () => {
    if (state.currentArticle) openReader(state.currentArticle.id);
    else switchView('dashboard');
  });

  dom.prevQuestionBtn.addEventListener('click', () => {
    if (state.quizCurrentIndex > 0) {
      state.quizCurrentIndex--;
      renderQuizQuestion();
    }
  });

  dom.nextQuestionBtn.addEventListener('click', () => {
    if (state.quizCurrentIndex < state.currentQuiz.totalQuestions - 1) {
      state.quizCurrentIndex++;
      renderQuizQuestion();
    }
  });

  dom.submitQuizBtn.addEventListener('click', submitQuiz);

  dom.retakeQuizBtn.addEventListener('click', () => {
    if (state.currentQuiz) startQuiz(state.currentQuiz.articleId);
  });

  dom.fetchNewsBtn.addEventListener('click', handleSyncNews);

  dom.categoryTabs.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.tab-item');
    if (!tabBtn) return;
    const cat = tabBtn.getAttribute('data-category');
    selectCategory(cat);
  });

  dom.difficultyFilter.addEventListener('change', (e) => {
    state.selectedDifficulty = e.target.value;
    loadNews();
  });

  dom.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim();
    loadNews();
  });

  dom.resetFiltersBtn.addEventListener('click', () => {
    state.selectedCategory = 'All';
    state.selectedDate = 'All';
    state.selectedDifficulty = 'All';
    state.searchQuery = '';
    dom.searchInput.value = '';
    dom.difficultyFilter.value = 'All';
    dom.categoryTabs.querySelectorAll('.tab-item').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-category') === 'All');
    });
    renderDateChips();
    loadNews();
  });
}

async function init() {
  setupEventListeners();
  await loadDates();
  await loadNews();
  await loadStats();
}

document.addEventListener('DOMContentLoaded', init);
