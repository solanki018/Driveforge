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
  originalName?: string; // Original file name before upload
}

export interface FileAnalytics {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  summarized: boolean;
  uploaded_at: string;
}

export interface UserStats {
  totalFiles: number;
  summarizedFiles: number;
  uploadHistory: Record<string, number>;
  
}

