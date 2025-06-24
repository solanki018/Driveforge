export interface FileSummary {
  id: string;
  name: string;
  summary: string;
  url: string;
  wordCount: number;
  summaryLength: number;
  created_at: string;
  user_id: string;
  path: string;
}

export interface UserStats {
  totalFiles: number;
  totalWords: number;
  averageSummaryLength: number;
  uploadHistory: Record<string, number>; // e.g., { "2025-06-21": 3 }
}


