import { app } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const start = async (): Promise<void> => {
  try {
    await connectDb();

    app.listen(env.port, () => {
      logger.info(`Backend listening on http://localhost:${env.port}`);
    });
  } catch (error) {
    logger.error('Failed to start backend', {
      error: error instanceof Error ? error.message : 'unknown'
    });
    process.exit(1);
  }
};

start();
