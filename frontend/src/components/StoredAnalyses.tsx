import type { RefObject } from 'react';
import type { StoredArticle } from '../types';
import { formatDate } from '../utils/date';
import { PaginationControls } from './PaginationControls';

interface StoredAnalysesProps {
  articles: StoredArticle[];
  isLoading: boolean;
  isError: boolean;
  currentPage: number;
  totalPages: number;
  isPageChanging: boolean;
  sectionRef: RefObject<HTMLElement | null>;
  onPageChange: (page: number) => void;
}

export const StoredAnalyses = ({
  articles,
  isLoading,
  isError,
  currentPage,
  totalPages,
  isPageChanging,
  sectionRef,
  onPageChange
}: StoredAnalysesProps) => {
  return (
    <section className="panel stored-panel" ref={sectionRef}>
      <h2>Stored Analyses</h2>
      {isLoading ? <div className="panel-empty">Loading saved analyses...</div> : null}
      {isError ? <div className="error-message">Failed to load stored analyses.</div> : null}
      {!isLoading && !isError && articles.length === 0 ? (
        <div className="panel-empty">No analyses saved yet.</div>
      ) : null}
      {!isLoading && !isError && articles.length > 0 ? (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Sentiment</th>
                  <th>Summary</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article._id}>
                    <td>
                      <a href={article.url} target="_blank" rel="noreferrer">
                        {article.title}
                      </a>
                    </td>
                    <td>
                      <span className={`sentiment ${article.sentiment}`}>{article.sentiment}</span>
                    </td>
                    <td>{article.summary}</td>
                    <td>{formatDate(article.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={isPageChanging}
            onPageChange={onPageChange}
          />
        </>
      ) : null}
    </section>
  );
};
