import type { NewsArticle } from '../types';

interface AnalysisPanelProps {
  selected: NewsArticle | null;
  isProcessing: boolean;
  error?: string;
  latestAnalysis?: {
    article: {
      summary: string;
      sentiment: 'positive' | 'neutral' | 'negative';
    };
    cached: boolean;
  };
  onAnalyze: () => void;
}

export const AnalysisPanel = ({
  selected,
  isProcessing,
  error,
  latestAnalysis,
  onAnalyze
}: AnalysisPanelProps) => {
  if (!selected) {
    return (
      <section className="panel analysis-panel">
        <h2>AI Analysis</h2>
        <div className="panel-empty">Select an article to generate summary and sentiment.</div>
      </section>
    );
  }

  return (
    <section className="panel analysis-panel">
      <h2>AI Analysis</h2>
      <p className="analysis-title">{selected.title}</p>
      <div className="analysis-preview">
        <p className="analysis-preview-title">Article Preview</p>
        <iframe
          title="Article preview"
          src={selected.url}
          className="analysis-preview-frame"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <p className="analysis-link">
          If preview is blocked,{' '}
          <a href={selected.url} target="_blank" rel="noreferrer">
            open source in new tab
          </a>
          .
        </p>
      </div>
      <button onClick={onAnalyze} disabled={isProcessing}>
        {isProcessing ? 'Analyzing...' : 'Analyze & Save'}
      </button>
      {latestAnalysis ? (
        <div className="analysis-result">
          <p className="analysis-result-title">Latest result</p>
          <p className="analysis-result-summary">{latestAnalysis.article.summary}</p>
          <p className="analysis-result-meta">
            Sentiment:{' '}
            <span className={`sentiment ${latestAnalysis.article.sentiment}`}>
              {latestAnalysis.article.sentiment}
            </span>
            {latestAnalysis.cached ? ' (from cache)' : ' (newly analyzed)'}
          </p>
        </div>
      ) : null}
      {error ? <p className="error-message">{error}</p> : null}
    </section>
  );
};
