export interface User {
  id: string;
  username: string; // Updated from 'name'
  email: string;
  role: string;
}

export interface AiAnalysisResult {
  title: string;
  cleanedContent: string;
  language: string;
  summary: string;
  keywords: string[];
  seoTitle: string;
  categories: string[];
}

export enum ArticleStatus {
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface Article {
  id: string;
  title: string;
  content: string;
  language: string;
  owner: string; // UUID string
  status: ArticleStatus;
  outputJson: AiAnalysisResult | null; // This holds the extracted data
  createdAt: string; // Timestamp
}
