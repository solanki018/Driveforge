'use client';

import { useEffect, useState } from 'react';
import { supabase } from 'lib/supabaseClient';
import { FileAnalytics, FileSummary, UserStats } from '../../types';
import UserStatsCard from 'components/UserStatsCard';
import AnalyticsPanel from 'components/AnalyticsPanel';
import Link from 'next/link';

type EnhancedStats = {
  totalFiles: number;
  summarizedFiles: number;
  totalSizeGB: number;
  uploadHistory: Record<string, number>;
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<FileAnalytics[]>([]);
  const [summaries, setSummaries] = useState<FileSummary[]>([]);
  const [stats, setStats] = useState<EnhancedStats | null>(null);

  const fetchAnalytics = async () => {
  const { data: files, error: analyticsError } = await supabase
    .from('file_analytics')
    .select('*')
    .order('uploaded_at', { ascending: true });

  if (analyticsError || !files) return;

  const totalFiles = files.length;
  const summarizedFiles = files.filter((f) => f.summarized === true).length;

  const totalSizeBytes = files.reduce((acc, file) => acc + (file.file_size || 0), 0);
  const totalSizeGB = +(totalSizeBytes / (1024 ** 3)).toFixed(2); // GB

  const uploadHistory: Record<string, number> = {};
  files.forEach((f) => {
    const date = new Date(f.uploaded_at).toISOString().split('T')[0];
    uploadHistory[date] = (uploadHistory[date] || 0) + 1;
  });

  setAnalytics(files);
  setStats({ totalFiles, summarizedFiles, totalSizeGB, uploadHistory });
};


  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <main className="p-6 bg-gray-950 text-white min-h-screen">
      {/* 🔵 Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <h2 className="text-2xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            DriveForge
          </h2>
        </Link>
        <h1 className="text-2xl font-bold">📊 Analytics Dashboard</h1>
      </div>

      {/* 🟩 Stats & Chart */}
      {stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <UserStatsCard label="Total Files" value={stats.totalFiles} />
            <UserStatsCard label="Used Storage (GB)" value={stats.totalSizeGB} />
            <UserStatsCard label="Auto-Generated Summaries" value={stats.summarizedFiles} />
            <UserStatsCard label="Days with Uploads" value={Object.keys(stats.uploadHistory).length} />
          </div>
          <AnalyticsPanel uploadHistory={stats.uploadHistory} />
        </>
      )}
    </main>
  );
}
