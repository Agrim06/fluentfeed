# FluentFeed — News-Based English Learning & Quiz Module

FluentFeed is a news-based English learning module that fetches curated real-world news articles across four core categories, calculates readability and vocabulary complexity metrics, provides an interactive reading experience with learning tooltips, and generates multiple-choice quizzes with instant evaluation and detailed explanations.

---

## 📖 Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Running Automated Tests](#running-automated-tests)
- [How to Use FluentFeed](#how-to-use-fluentfeed)
- [REST API Reference](#rest-api-reference)
- [Architecture & Database Design](#architecture--database-design)
- [Project Directory Structure](#project-directory-structure)

---

## ✨ Features

- **4 Core News Categories**: `Technology`, `Business`, `Sports`, and `World`.
- **5-Day Historical Timeline**: Filter and read news from any of the past 5 days with an interactive timeline selector.
- **Curated Reading Experience**:
  - Articles formatted to 500–700 words with estimated reading time and category badges.
  - Real-time reading progress bar on scroll.
  - Interactive vocabulary tooltips highlighting advanced contextual terms.
  - Automatic image error fallback to ensure zero broken cover images.
- **Bonus Difficulty Classification**:
  - Automated classification into `Easy`, `Medium`, and `Hard` based on word length, syllable structure, and Flesch reading ease metrics.
  - Filter stories by difficulty level on the dashboard.
- **Interactive MCQ Quiz System**:
  - Step-by-step question navigation with progress tracking (`Question X of N`).
  - Interactive answer selection.
  - Instant score calculation, percentage display, pass/fail status, and a full review breakdown with correct answers and explanations.
- **Real-Time News Synchronization**:
  - Live news ingestion from NewsAPI.org and international feeds.
  - Deduplication against `articleUrl` and normalized titles.
- **Zero External Database Configuration**: Built on top of embedded SQLite (`better-sqlite3`) with WAL journal mode.

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher (tested on Node.js v20 / v22)
- **npm**: `v9.0.0` or higher (comes bundled with Node.js)
- **Git**: For cloning the repository

To check your Node.js and npm versions, run:
```bash
node -v
npm -v
```

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/Agrim06/fluentfeed.git
cd fluentfeed
```

### Step 2: Install Dependencies
Install all required backend and runtime dependencies:
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root of the project directory:
```bash
cp .env.example .env
```

Open `.env` and configure your settings:
```env
PORT=3000
NEWS_API_KEY= newsapi.org API KEY
NODE_ENV=development
```
*(Note: A valid NewsAPI.org key is provided above for immediate testing. If left blank, the application automatically falls back to live international RSS wire feeds.)*

---

## 🏃 Running the Application

### Start the Server (Production Mode)
```bash
npm start
```

### Start in Development Mode (with Live Reload)
```bash
npm run dev
```

Once started, open your web browser and navigate to:
```
http://localhost:3000
```

---

## 🧪 Running Automated Tests

To execute the unit test suite covering difficulty calculations and dynamic quiz generation:
```bash
npm test
```

Expected output:
```
> fluentfeed@1.0.0 test
> node tests/api.test.js

All backend unit tests passed successfully!
```

---

## 🖥️ How to Use FluentFeed

1. **Browsing Stories**:
   - Use the **Past 5 Days** calendar bar at the top to filter stories by date, or select **All Dates** to see the full archive.
   - Click category tabs (`Technology`, `Business`, `Sports`, `World`) or use the **Difficulty Filter** (`Easy`, `Medium`, `Hard`) to narrow down articles.
   - Use the search bar to find articles by headline or summary keywords.

2. **Reading an Article**:
   - Click **Read Story** on any card to enter the clean, distraction-free reading mode.
   - Observe the top progress bar as you scroll through the 500–700 word text.
   - Click any underlined vocabulary term to view contextual notes.

3. **Taking the Quiz**:
   - Click **Play Quiz** from either the dashboard card or the bottom of the article reader.
   - Answer each question one by one using the **Next Question** and **Previous** navigation buttons.
   - Click **Submit Quiz** to view your score percentage, pass/fail status, and question-by-question explanations.

4. **Syncing Live News**:
   - Click **Sync Live News** in the top navigation bar to trigger an on-demand fetch from NewsAPI.org.
   - The app enriches incoming news, generates MCQs, deduplicates records, and refreshes the timeline.

---

## 📡 REST API Reference

| Method | Endpoint | Query / Body Parameters | Description |
|:---|:---|:---|:---|
| `GET` | `/api/news` | `category`, `date`, `difficulty`, `search` | Returns filtered list of articles with quiz counts |
| `GET` | `/api/news?category=technology` | `category` | Filter articles by category |
| `POST` | `/api/news/fetch` | None | Ingests latest live news, enriches text, generates MCQs, and updates database |
| `GET` | `/api/articles/:id` | `id` (path param) | Returns complete article details and vocabulary data |
| `GET` | `/api/articles/:id/quiz` | `id` (path param) | Returns MCQ questions and options for a specific article |
| `POST` | `/api/quiz/:articleId/submit` | `{ userAnswers: { [questionId]: "selectedOption" } }` | Evaluates answers, calculates score, records submission, and returns detailed explanations |
| `GET` | `/api/dates` | None | Returns list of available dates in the past 5-day window |
| `GET` | `/api/stats` | None | Returns total articles, quizzes taken, and average user score |

### Example Quiz Submission Request:
```http
POST /api/quiz/1/submit
Content-Type: application/json

{
  "userAnswers": {
    "1": "Extreme communication latency between Earth and distant spacecraft",
    "2": "Real-time situational awareness, route optimization, and terrain navigation"
  }
}
```

### Example Submission Response:
```json
{
  "articleId": 1,
  "score": 2,
  "totalQuestions": 4,
  "percentage": 50,
  "passed": false,
  "results": [
    {
      "questionId": 1,
      "question": "Why has real-time human intervention become impractical for deep-space missions?",
      "userAnswer": "Extreme communication latency between Earth and distant spacecraft",
      "correctAnswer": "Extreme communication latency between Earth and distant spacecraft",
      "isCorrect": true,
      "explanation": "The article highlights that communication latencies ranging from minutes to hours render real-time human commands impossible during critical maneuvers."
    }
  ]
}
```

---

## 🏛️ Architecture & Database Design

- **Backend Framework**: Node.js with Express REST APIs.
- **Embedded Database**: SQLite (`fluentfeed.db`) via `better-sqlite3` with Write-Ahead Logging (WAL) for high concurrency and performance.
- **Schema & Indexes**:
  - `articles` table: Stores article metadata, enriched 500–700 word content, reading times, and difficulty metrics. Indexed on `category` and `publishedAt`.
  - `quizzes` table: Stores questions, 4-choice options JSON, correct answers, and explanations. Foreign key references `articles(id)` with cascading deletes.
  - `quiz_submissions` table: Records user scores, percentage results, timestamped submissions, and answers.
- **Deduplication Engine**: Enforces uniqueness via `articleUrl TEXT UNIQUE` and normalized lowercase title checks prior to insertion.
- **Bonus Readability Engine**: Evaluates word counts, average word lengths, and syllable density to classify texts into `Easy`, `Medium`, and `Hard`.

---

## 📁 Project Directory Structure

```
fluentfeed/
├── .env.example                # Template for environment variables
├── .env                        # Local environment configuration
├── .gitignore                  # Git ignore rules for node_modules and DB
├── package.json                # Project dependencies and npm scripts
├── README.md                   # Complete installation and user guide
├── server/
│   ├── index.js                # Server entry point and static file server
│   ├── db.js                   # SQLite database connection and schema setup
│   ├── seedData.js             # 5-day historical seed news dataset & MCQs
│   ├── routes/
│   │   └── api.js              # REST API endpoint handlers
│   └── services/
│       ├── newsService.js      # NewsAPI.org & RSS live news ingestion engine
│       ├── quizService.js      # Programmatic MCQ generation and term extractor
│       └── difficultyService.js # Readability analysis and difficulty classifier
├── public/
│   ├── index.html              # Main FluentFeed Single Page Application
│   ├── styles.css              # Editorial design system and responsive layout
│   └── app.js                  # Client state machine, reader, and quiz player
└── tests/
    └── api.test.js             # Automated unit tests for services
```

---

## 📬 Assignment Submission Details

- **Email**: `founder.fluentfeed@gmail.com`
- **Repository**: [https://github.com/Agrim06/fluentfeed](https://github.com/Agrim06/fluentfeed)
