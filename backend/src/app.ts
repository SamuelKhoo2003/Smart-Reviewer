import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { articlesRouter } from './routes/articles.routes.js';
import { newsRouter } from './routes/news.routes.js';
import { errorMiddleware } from './middleware/error.middleware.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api', (_req, res) => {
  res.json({
    ok: true,
    endpoints: ['/api/news', '/api/articles', '/api/analyze']
  });
});

app.use('/api', newsRouter);
app.use('/api', articlesRouter);

// Compatibility with required endpoint paths.
app.use('/', articlesRouter);

app.use(errorMiddleware);
