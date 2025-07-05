'use client';

import { useEffect, useState } from 'react';
import { FileSummary } from '../types';
import { createClient } from '@supabase/supabase-js';
import { XCircle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RightSidebar({
  file,
  onDropFile,
  onClose,
}: {
  file: FileSummary | null;
  onDropFile: (file: FileSummary) => void;
  onClose: () => void;
}) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async (file: FileSummary) => {
    setLoading(true);
    setError('');
    setSummary('');

    try {
      const res = await fetch(`/api/summarize/${file.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: file.user_id,
          name: file.name,
          path: file.path,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to generate summary');
      }

      setSummary(json.summary);
    } catch (err) {
      console.error(err);
      setError('❌ Something went wrong during summarization.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    try {
      const parsedFile = JSON.parse(data);
      onDropFile(parsedFile);
    } catch {
      console.warn('Invalid file drop data');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (file) handleSummarize(file);
  }, [file]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="absolute right-0 top-0 w-[26rem] h-full bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white border-l border-gray-800 p-6 shadow-2xl z-20 backdrop-blur-md overflow-y-auto"
    >
      {file ? (
        <>
          <h2 className="text-xl font-bold mb-1 truncate text-blue-400">
            📄 {file.originalName || file.name}
          </h2>

          {loading && (
            <p className="text-yellow-400 text-sm animate-pulse mt-2">Summarizing file...</p>
          )}

          {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}

          {summary && (
            <>
              <h3 className="font-semibold mt-5 text-green-400 text-sm uppercase tracking-wide">
                Summary
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">
                {summary}
              </p>
            </>
          )}
        </>
      ) : (
        <p className="text-gray-400 text-sm mt-10">
          👉 Drag a pdf or text file here to summarize it.
        </p>
      )}

      {/* Close Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={onClose}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition"
        >
          <XCircle size={16} />
          Close
        </button>
      </div>
    </div>
  );
}
