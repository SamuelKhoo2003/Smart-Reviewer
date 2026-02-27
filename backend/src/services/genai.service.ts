import axios from 'axios';
import { env } from '../config/env.js';
import type { AnalyzeResponse, AnalysisInput, Sentiment } from '../types.js';

interface OpenAIMessage {
  role: 'system' | 'user';
  content: string;
}

interface OpenAIChoice {
  message: {
    content: string;
  };
}

interface OpenAIResponse {
  choices: OpenAIChoice[];
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

const sentimentSet = new Set<Sentiment>(['positive', 'neutral', 'negative']);

const instruction =
  'You analyze news text. Respond as strict JSON: {"summary":"...","sentiment":"positive|neutral|negative"}.';

const buildOpenAIMessages = (input: AnalysisInput): OpenAIMessage[] => [
  {
    role: 'system',
    content: instruction
  },
  {
    role: 'user',
    content: `Title: ${input.title}\nDescription: ${input.description ?? ''}\nURL: ${input.url}\nGenerate concise summary (2-3 sentences) and sentiment.`
  }
];

const buildGeminiPrompt = (input: AnalysisInput): string =>
  `${instruction}\nTitle: ${input.title}\nDescription: ${input.description ?? ''}\nURL: ${input.url}\nGenerate concise summary (2-3 sentences) and sentiment.`;

const parseAnalysis = (content: string): AnalyzeResponse => {
  const parsed = JSON.parse(content) as AnalyzeResponse;

  if (!parsed.summary || !sentimentSet.has(parsed.sentiment)) {
    throw new Error('Invalid GenAI response shape');
  }

  return {
    summary: parsed.summary.trim(),
    sentiment: parsed.sentiment
  };
};

const analyzeWithOpenAI = async (input: AnalysisInput): Promise<AnalyzeResponse> => {
  const { data } = await axios.post<OpenAIResponse>(
    'https://api.openai.com/v1/chat/completions',
    {
      model: env.genAiModel,
      messages: buildOpenAIMessages(input),
      temperature: 0.2,
      response_format: { type: 'json_object' }
    },
    {
      headers: {
        Authorization: `Bearer ${env.genAiApiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    }
  );

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Empty response from GenAI provider');
  }

  return parseAnalysis(content);
};

const analyzeWithGemini = async (input: AnalysisInput): Promise<AnalyzeResponse> => {
  const normalizedModel = env.genAiModel.replace(/^models\//, '');
  const encodedModel = encodeURIComponent(normalizedModel);
  const { data } = await axios.post<GeminiResponse>(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodedModel}:generateContent?key=${encodeURIComponent(env.genAiApiKey)}`,
    {
      contents: [
        {
          role: 'user',
          parts: [{ text: buildGeminiPrompt(input) }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    },
    {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000
    }
  );

  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error('Empty response from GenAI provider');
  }

  return parseAnalysis(content);
};

export const analyzeArticle = async (input: AnalysisInput): Promise<AnalyzeResponse> => {
  if (env.genAiProvider === 'gemini') {
    return analyzeWithGemini(input);
  }

  return analyzeWithOpenAI(input);
};
