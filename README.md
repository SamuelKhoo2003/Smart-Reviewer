# Smart Reviewer

[![Netlify Status](https://api.netlify.com/api/v1/badges/75dfe56e-5e4f-4896-8faf-89bc482cda02/deploy-status)](https://app.netlify.com/projects/effulgent-faloodeh-3ac727/deploys)

Smart Reviewer is a full-stack web app for exploring current news, analyzing selected articles with GenAI (summary + sentiment), and storing those analysis results for later review.

## Live App

- Frontend (Netlify): https://smart-reviewer.netlify.app
- Backend API (Render): https://smart-reviewer-lkhk.onrender.com
  - Health check: `GET /health`
  - API index: `GET /api`

## What It Does

- Search live news articles from GNews.
- Paginate search results with numbered page navigation.
- Analyze selected articles using either OpenAI or Gemini.
- Cache analysis by article URL to avoid repeat model calls.
- Persist analyzed articles in MongoDB and browse them with pagination.
- Show the latest analysis result directly in the analysis panel.

## Tech Stack

- Frontend: React, TypeScript, Vite, React Query
- Backend: Node.js, Express, TypeScript, Axios
- Database: MongoDB Atlas + Mongoose
- Deployment: Netlify (frontend), Render (backend)

## API Endpoints

- `GET /api/news?q=<query>&page=<n>&max=<n>`
  - Searches GNews and returns paginated results.
- `GET /api/articles?page=<n>`
  - Returns paginated saved analysis records.
- `POST /api/analyze`
  - Body: `{ "title": string, "url": string, "description"?: string }`
  - Runs GenAI analysis and stores/returns the record.
  - If URL already exists, returns cached record instead of creating a duplicate.

Compatibility paths:

- `GET /articles`
- `POST /analyze`

## Environment Variables

Copy `.env.example` to `.env` and fill in real values:

```bash
cp .env.example .env
```

Required variables:

- `NEWS_API_KEY`: GNews API key
- `GENAI_API_KEY`: API key for selected GenAI provider
- `GENAI_PROVIDER`: `openai` or `gemini` (default `openai`)
- `GENAI_MODEL`: model name (for example `gpt-4o-mini` or `gemini-2.5-flash`)
- `MONGODB_URI`: MongoDB connection string
- `PORT`: backend port (default `4000`)
- `VITE_API_BASE_URL`: frontend backend base URL (default `http://localhost:4000/api`)

## Local Development

### Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm 9+
- MongoDB Atlas cluster (or local MongoDB)
- Valid GNews and GenAI credentials

### Install

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

### Run

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

### Quick Health Checks

- `GET http://localhost:4000/health`
- `GET http://localhost:4000/api`
- `GET http://localhost:4000/api/news?q=technology&page=1&max=10`

## Build

```bash
npm run build
```

## Deployment

### Frontend (Netlify)

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable:
  - `VITE_API_BASE_URL=https://smart-reviewer-lkhk.onrender.com/api`

### Backend (Render)

- Root directory: `backend`
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Set backend env vars in Render dashboard (`NEWS_API_KEY`, `GENAI_*`, `MONGODB_URI`, etc.)

## Important Notes

- Some sites block iframe embedding; the app provides an open-in-new-tab fallback link.
- Render backend root `/` may show 404 by design; use `/health` or `/api`.
- Render free tier can cold-start after inactivity, so the first API request may take longer (sometimes 30-60+ seconds).

## Project Structure

```text
smart_reviewer/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
  frontend/
    src/
      api/
      components/
      hooks/
      types/
      utils/
```
