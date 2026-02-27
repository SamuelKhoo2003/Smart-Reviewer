import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

type GenAiProvider = 'openai' | 'gemini';

const cwdEnvPath = resolve(process.cwd(), '.env');
const parentEnvPath = resolve(process.cwd(), '..', '.env');

if (existsSync(cwdEnvPath)) {
  dotenv.config({ path: cwdEnvPath });
} else if (existsSync(parentEnvPath)) {
  dotenv.config({ path: parentEnvPath });
} else {
  dotenv.config();
}

const required = ['NEWS_API_KEY', 'GENAI_API_KEY', 'MONGODB_URI'] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  genAiProvider: (process.env.GENAI_PROVIDER ?? 'openai') as GenAiProvider,
  port: Number(process.env.PORT ?? 4000),
  newsApiKey: process.env.NEWS_API_KEY as string,
  genAiApiKey: process.env.GENAI_API_KEY as string,
  mongodbUri: process.env.MONGODB_URI as string,
  genAiModel: process.env.GENAI_MODEL ?? 'gpt-4o-mini'
};

if (!['openai', 'gemini'].includes(env.genAiProvider)) {
  throw new Error('GENAI_PROVIDER must be either "openai" or "gemini"');
}
