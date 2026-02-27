import { Schema, model } from 'mongoose';
import type { Sentiment } from '../types.js';

interface ArticleAnalysisDoc {
  title: string;
  url: string;
  summary: string;
  sentiment: Sentiment;
  createdAt: Date;
  updatedAt: Date;
}

const articleAnalysisSchema = new Schema<ArticleAnalysisDoc>(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, unique: true, trim: true },
    summary: { type: String, required: true },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

articleAnalysisSchema.index({ createdAt: -1 });

export const ArticleAnalysis = model<ArticleAnalysisDoc>(
  'ArticleAnalysis',
  articleAnalysisSchema
);
