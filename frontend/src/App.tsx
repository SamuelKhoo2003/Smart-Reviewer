import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { analyzeArticle, fetchStoredArticles } from './api/articles';
import { useNewsSearch } from './hooks/useNewsSearch';
import type { NewsArticle } from './types';
import { SearchBar } from './components/SearchBar';
import { NewsList } from './components/NewsList';
import { AnalysisPanel } from './components/AnalysisPanel';
import { PaginationControls } from './components/PaginationControls';
import { StoredAnalyses } from './components/StoredAnalyses';
import './styles.css';

const DEFAULT_QUERY = 'technology';

function App() {
  const [searchInput, setSearchInput] = useState(DEFAULT_QUERY);
  const [activeQuery, setActiveQuery] = useState(DEFAULT_QUERY);
  const [newsPage, setNewsPage] = useState(1);
  const [knownNewsMaxPage, setKnownNewsMaxPage] = useState(1);
  const [storedArticlesPage, setStoredArticlesPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const newsSectionRef = useRef<HTMLElement | null>(null);
  const storedSectionRef = useRef<HTMLElement | null>(null);
  const pendingScrollTarget = useRef<'news' | 'stored' | null>(null);
  const queryClient = useQueryClient();

  const scrollSectionIntoView = (section: HTMLElement | null) => {
    if (!section) {
      return;
    }

    const top = section.getBoundingClientRect().top + window.scrollY - 12;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  };

  const newsQuery = useNewsSearch(activeQuery, newsPage);

  const storedArticlesQuery = useQuery({
    queryKey: ['stored-articles', storedArticlesPage],
    queryFn: () => fetchStoredArticles(storedArticlesPage)
  });

  const analyzeMutation = useMutation({
    mutationFn: analyzeArticle,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['stored-articles'] });
      setStoredArticlesPage(1);
    }
  });

  const analyzeError = useMemo(() => {
    if (!analyzeMutation.error) {
      return undefined;
    }

    if (analyzeMutation.error instanceof AxiosError) {
      const apiError = analyzeMutation.error.response?.data as { error?: string } | undefined;
      return apiError?.error ?? 'Unable to analyze article. Please try again.';
    }

    return 'Unable to analyze article. Please try again.';
  }, [analyzeMutation.error]);

  const latestSelectedAnalysis = useMemo(() => {
    if (!selectedArticle || !analyzeMutation.data) {
      return undefined;
    }

    if (analyzeMutation.data.article.url !== selectedArticle.url) {
      return undefined;
    }

    return analyzeMutation.data;
  }, [selectedArticle, analyzeMutation.data]);

  const newsTotalPages = useMemo(() => Math.max(1, knownNewsMaxPage), [knownNewsMaxPage]);

  const storedTotalPages = useMemo(() => {
    if (!storedArticlesQuery.data) {
      return storedArticlesPage;
    }

    return Math.max(
      1,
      Math.ceil(storedArticlesQuery.data.total / storedArticlesQuery.data.pageSize)
    );
  }, [storedArticlesQuery.data, storedArticlesPage]);

  useEffect(() => {
    if (pendingScrollTarget.current === 'news' && !newsQuery.isFetching) {
      scrollSectionIntoView(newsSectionRef.current);
      pendingScrollTarget.current = null;
    }
  }, [newsQuery.isFetching, newsPage]);

  useEffect(() => {
    if (!newsQuery.data) {
      return;
    }

    setKnownNewsMaxPage((current) => {
      if (newsQuery.data.hasMore) {
        return Math.max(current, newsPage + 1);
      }

      return Math.max(1, Math.min(current, newsPage));
    });
  }, [newsQuery.data, newsPage]);

  useEffect(() => {
    if (pendingScrollTarget.current === 'stored' && !storedArticlesQuery.isFetching) {
      scrollSectionIntoView(storedSectionRef.current);
      pendingScrollTarget.current = null;
    }
  }, [storedArticlesQuery.isFetching, storedArticlesPage]);

  return (
    <main className="app-shell">
      <header>
        <h1>Smart Reviewer</h1>
        <p>Search recent news and generate AI-based summary + sentiment insights.</p>
      </header>

      <SearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSubmit={() => {
          setActiveQuery(searchInput.trim() || DEFAULT_QUERY);
          setNewsPage(1);
          setKnownNewsMaxPage(1);
          setSelectedArticle(null);
        }}
      />

      <section className="layout-grid">
        <section className="panel" ref={newsSectionRef}>
          <h2>Recent News</h2>
          {newsQuery.isLoading ? <div className="panel-empty">Fetching news...</div> : null}
          {newsQuery.isError ? (
            <div className="error-message">Failed to fetch news. Check API configuration.</div>
          ) : null}
          {!newsQuery.isLoading && !newsQuery.isError ? (
            <>
              <NewsList
                articles={newsQuery.data?.articles ?? []}
                selectedUrl={selectedArticle?.url}
                onSelect={setSelectedArticle}
              />
              <PaginationControls
                currentPage={newsPage}
                totalPages={newsTotalPages}
                isLoading={newsQuery.isFetching}
                onPageChange={(page) => {
                  pendingScrollTarget.current = 'news';
                  setNewsPage(page);
                  setSelectedArticle(null);
                }}
              />
            </>
          ) : null}
        </section>

        <AnalysisPanel
          selected={selectedArticle}
          isProcessing={analyzeMutation.isPending}
          error={analyzeError}
          latestAnalysis={latestSelectedAnalysis}
          onAnalyze={() => {
            if (!selectedArticle) {
              return;
            }

            analyzeMutation.mutate({
              title: selectedArticle.title,
              url: selectedArticle.url,
              description: selectedArticle.description
            });
          }}
        />
      </section>

      <StoredAnalyses
        articles={storedArticlesQuery.data?.articles ?? []}
        isLoading={storedArticlesQuery.isLoading}
        isError={storedArticlesQuery.isError}
        currentPage={storedArticlesPage}
        totalPages={storedTotalPages}
        isPageChanging={storedArticlesQuery.isFetching}
        sectionRef={storedSectionRef}
        onPageChange={(page) => {
          pendingScrollTarget.current = 'stored';
          setStoredArticlesPage(page);
        }}
      />
    </main>
  );
}

export default App;
