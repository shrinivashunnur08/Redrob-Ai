# Redrob AI — Intelligent Candidate Discovery Engine

A multi-signal candidate ranking dashboard built for the **India Runs Hackathon — Track 1**. This repository contains the React frontend that visualizes and interacts with a JD-based candidate ranking pipeline: upload a candidate CSV, run the ranking engine, and explore results through a sortable ranking table, per-candidate score breakdowns, and a full architecture explainer.

## What this does

Given a Job Description and a pool of candidate profiles, the ranking pipeline scores every candidate across **8 weighted signal components** — skills trust, career trajectory, behavioral availability, experience band, location, education, anti-services penalty, and honeypot/anomaly detection — and produces a ranked Top-100 list with a human-readable, auditable reasoning string per candidate. No LLM calls, no GPU, and no network access are used at ranking time.

This repo (`redrob-ui`) is the **dashboard**, not the scoring engine itself. It reads ranking output (candidate ID, rank, score, reasoning) and renders it for a recruiter to explore and validate.

## Pages

| Route | Page | Purpose |
|---|---|---|
| `/` | Dashboard | Overview metrics, score distribution, compute-constraint summary |
| `/upload` | Upload | Drag-and-drop a `candidates.csv`, validate required columns, kick off ranking |
| `/rankings` | Ranking Table | Sortable, filterable, searchable table of all ranked candidates |
| `/candidate/:id` | Candidate Detail | Per-candidate score breakdown, radar chart, hiring-risk flags, and reasoning |
| `/architecture` | Architecture | Full explanation of the 8 scoring components, trap-avoidance logic, and compute constraints |

## Scoring components

| Signal | Weight | What it checks |
|---|---|---|
| Skills Match | 28% | Domain vocabulary weighted by a trust multiplier (proficiency × duration × endorsements); penalizes keyword stuffing |
| Career / Title | 24% | Title signal + months in AI/ML roles + seniority differentiation |
| Behavioral Signals | 22% | Response rate, last-active date, open-to-work flag, notice period, GitHub activity |
| Experience Band | 10% | Peak score at 6–8 yrs; penalized below 3 yrs, diminishing returns beyond 12 yrs |
| Location | 6% | Preferred regions weighted higher; non-relocatable non-local candidates discounted |
| Education | 4% | Institution tier + CS/ML field relevance + degree level |
| Anti-Services | 4% | Penalizes careers spent primarily at pure IT-services firms |
| Honeypot Detection | multiplier | Flags implausible profiles (e.g. expert-level skill with 0 months duration and 0 endorsements) |

## Compute constraints (as designed)

| Constraint | Requirement | Result |
|---|---|---|
| Runtime | < 5 minutes | ~55 seconds |
| RAM | ≤ 16 GB | < 2 GB |
| GPU | Not allowed | Not used |
| Network during ranking | Not allowed | Not used |
| LLM API calls | Not allowed | Not used |

## Tech stack

- **React 19** + **Vite** — UI framework and build tooling
- **React Router 7** — client-side routing across the 5 pages
- **Tailwind CSS** — styling
- **Recharts** — radar chart (candidate signal breakdown) and score-distribution line chart
- **PapaParse** — client-side CSV parsing/validation on upload
- **Lucide React** / **React Icons** — iconography

## Project structure

```
redrob-ui/
├── src/
│   ├── components/
│   │   ├── charts/           # ScoreDistribution, ComponentBreakdown
│   │   ├── CandidateCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── ScoreBar.jsx
│   │   └── SignalBadge.jsx
│   ├── data/
│   │   └── candidates.js     # Sample ranked output (100 candidates)
│   ├── hooks/
│   │   └── useRankings.js
│   ├── pages/
│   │   ├── Architecture.jsx
│   │   ├── CandidateDetail.jsx
│   │   ├── Dashboard.jsx
│   │   ├── RankingTable.jsx
│   │   └── Upload.jsx
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## Getting started

```bash
cd redrob-ui
npm install
npm run dev
```

App runs locally at `http://localhost:5173` by default.

### Build for production

```bash
npm run build
```

Output is generated in `redrob-ui/dist`.

## Deployment (Vercel)

This app is deployed as a static Vite build:

1. Import the repo into Vercel
2. Set **Root Directory** to `redrob-ui`
3. Framework preset: **Vite**
4. Build command: `vite build`, Output directory: `dist`

Because routing is client-side (`react-router-dom`'s `BrowserRouter`), a rewrite rule is needed so deep links (e.g. `/rankings`, `/candidate/:id`) don't 404 on refresh. Add `redrob-ui/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Sample dataset

`src/data/candidates.js` contains a sample Top-100 ranked output — 100 India-based candidates with composite scores ranging from **0.6615 to 0.7109**, all in ML/AI/Data Science/Search/Recommendation roles.
