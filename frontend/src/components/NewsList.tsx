import type { NewsArticle } from '../types';
import { formatDate } from '../utils/date';

interface NewsListProps {
  articles: NewsArticle[];
  selectedUrl?: string;
  onSelect: (article: NewsArticle) => void;
}

export const NewsList = ({ articles, selectedUrl, onSelect }: NewsListProps) => {
  if (articles.length === 0) {
    return <div className="panel-empty">No matching news articles found.</div>;
  }

  return (
    <ul className="news-list">
      {articles.map((article) => {
        const isSelected = article.url === selectedUrl;
        return (
          <li key={article.url}>
            <button
              className={`news-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(article)}
            >
              <p className="news-title">{article.title}</p>
              <p className="news-meta">
                {article.source} | {formatDate(article.publishedAt)}
              </p>
              <p className="news-description">{article.description}</p>
            </button>
          </li>
        );
      })}
    </ul>
  );
};
