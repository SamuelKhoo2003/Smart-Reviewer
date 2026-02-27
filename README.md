# Smart Reviewer

[![Netlify Status](https://api.netlify.com/api/v1/badges/75dfe56e-5e4f-4896-8faf-89bc482cda02/deploy-status)](https://app.netlify.com/projects/effulgent-faloodeh-3ac727/deploys)

Single-page React + TypeScript app with a Node.js/Express backend that:
- searches recent news articles,
- analyzes selected articles using a GenAI API (summary + sentiment),
- stores and retrieves analysis results from MongoDB.

## Architecture Overview

- `frontend/`: React SPA (Vite + TypeScript + React Query)
  - Search recent news via backend `/api/news`
  - Analyze selected article via backend `/api/analyze`
  - View stored analyses via backend `/api/articles`
- `backend/`: Express API (TypeScript)
  - Service layer for GNews and GenAI API calls
  - MongoDB persistence with Mongoose
  - Caching: reuses existing analysis if URL already exists

## API Endpoints

- `GET /api/news?q=<query>&max=<n>`: fetch recent news from GNews
- `GET /api/articles`: fetch stored analyses
- `POST /api/analyze`: analyze and store article
  - body: `{ "title": string, "url": string, "description"?: string }`
- Compatibility path (required by prompt):
  - `GET /articles`
  - `POST /analyze`

## Environment Variables

Copy `.env.example` to `.env` in the project root and set values:

- `NEWS_API_KEY`: API key for GNews
- `GENAI_API_KEY`: API key for your GenAI provider
- `GENAI_PROVIDER`: `openai` or `gemini` (default `openai`)
- `GENAI_MODEL`: GenAI model name (default `gpt-4o-mini` for OpenAI, example `gemini-1.5-flash` for Gemini)
- `MONGODB_URI`: MongoDB connection string
- `PORT`: backend port (default `4000`)
- `VITE_API_BASE_URL`: frontend API base URL (default `http://localhost:4000/api`)

## Setup

1. Install dependencies:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

2. Configure env:

```bash
cp .env.example .env
# edit .env with real credentials
```

3. Run both apps in development:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Build

```bash
npm run build
```

## Deployment Status

- Frontend deploy status is shown via the Netlify badge above.
- Render does not provide an equivalent built-in public deploy badge like Netlify.

## Production Notes

- Keep secrets in environment variables only.
- Add rate limits and auth if exposing publicly.
- Consider background jobs for heavy analysis workloads.
- Add integration tests for API routes and service mocks.

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
