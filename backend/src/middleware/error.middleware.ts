import type { ErrorRequestHandler } from 'express';
import axios from 'axios';
import { logger } from '../utils/logger.js';

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (axios.isAxiosError(error)) {
    const upstreamStatus = error.response?.status;
    const upstreamMessage =
      typeof error.response?.data?.error?.message === 'string'
        ? error.response.data.error.message
        : undefined;

    let message = upstreamMessage ?? 'Upstream API request failed';

    if (upstreamStatus === 429) {
      message =
        upstreamMessage ??
        'GenAI rate limit reached. Please wait a moment and try again.';
    }

    if (upstreamStatus === 401) {
      message = upstreamMessage ?? 'Invalid GenAI API key or insufficient permissions.';
    }

    logger.error('Upstream API error', {
      status: upstreamStatus,
      message: error.message,
      upstreamMessage
    });

    res.status(upstreamStatus && upstreamStatus >= 400 ? upstreamStatus : 502).json({
      error: message
    });
    return;
  }

  logger.error('Unhandled API error', { message: error.message, stack: error.stack });
  res.status(500).json({ error: 'Internal server error' });
};
