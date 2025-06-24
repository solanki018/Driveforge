'use client';

import { useEffect, useState } from 'react';

import { supabase } from 'lib/supabaseClient';
// Update the import path below if your types file is located elsewhere
import { FileSummary, UserStats } from '../../types';
import UserStatsCard from 'components/UserStatsCard';
import AnalyticsPanel from 'components/AnalyticsPanel';

export default function AnalyticsPage() {
  const [summaries, setSummaries] = useState<FileSummary[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);

  const fetchAnalytics = async () => {
    const { data, error } = await supabase
      .from('summaries')
      .select('*')
      .order('created_at', { ascending: true });

    if (data) {
      setSummaries(data);

      const totalFiles = data.length;
      const totalWords = data.reduce((sum, file) => sum + (file.wordCount || 0), 0);
      const averageSummaryLength = Math.round(
        data.reduce((sum, f) => sum + (f.summaryLength || 0), 0) / totalFiles
      );

      // Format: { "2025-06-21": 2, ... }
      const uploadHistory: Record<string, number> = {};
      data.forEach((f) => {
        const date = new Date(f.created_at).toISOString().split('T')[0];
        uploadHistory[date] = (uploadHistory[date] || 0) + 1;
      });

      setStats({ totalFiles, totalWords, averageSummaryLength, uploadHistory });
    }

    if (error) console.error(error.message);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">📊 Analytics Dashboard</h1>
      {stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <UserStatsCard label="Total Files" value={stats.totalFiles} />
            <UserStatsCard label="Words Summarized" value={stats.totalWords} />
            <UserStatsCard label="Avg. Summary Length" value={stats.averageSummaryLength} />
          </div>
          <AnalyticsPanel uploadHistory={stats.uploadHistory} />
        </>
      )}
    </main>
  );
}
