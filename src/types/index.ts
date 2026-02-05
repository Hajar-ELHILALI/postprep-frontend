// Add/Update these interfaces

export enum ArticleStatus {
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Matches LiteArticleDTO
export interface LiteArticle {
  id: string;
  title: string | null;
  owner: string;
  status: ArticleStatus;
}

// Matches ArticleDTO (The full version)
export interface Article {
  id: string;
  title: string | null;
  language: string;
  owner: string;
  status: ArticleStatus;
  createdAt: string; // Timestamp comes as string in JSON
  outputJson: {
    title?: string;
    summary?: string;
    keywords?: string[];
    seoTitle?: string;
    categories?: string[];
  } | null;
}
