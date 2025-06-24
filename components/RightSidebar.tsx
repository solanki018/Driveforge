'use client';

import { useEffect, useState } from 'react';
// Update the import path below to match your actual file structure.
// For example, if types.ts is in driveforge/types.ts, use:
import { FileSummary } from '../types';
import { createClient } from '@supabase/supabase-js';
// Update the import path below to match your actual file structure.
// For example, if summarize.ts is in driveforge/lib/summarize.ts, use:
import { getSummaryFromGemini } from '../lib/summarize';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RightSidebar({
  file,
  onDropFile,
  onClose,
}: {
  file: FileSummary;
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
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log('file', file)
      const summary = await getSummaryFromGemini({ file });
      setSummary(summary);
    } catch (err) {
      console.error(err);
      setError('Something went wrong during summarization.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (file) {
      console.log("📦 File received in RightSidebar:", file); // <-- add this
      handleSummarize(file);
    }
  }, [file]);

  return (
    <div className="absolute right-0 top-0 w-[24rem] bg-white h-full border-l p-4 shadow-lg overflow-y-auto">
      {file ? (
        <>
          <h2 className="text-lg font-semibold mb-2">📄 {file.name}</h2>
          {loading && <p>Summarizing...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {summary && (
            <>
              <h3 className="font-bold mt-4">Summary</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{summary}</p>
            </>
          )}
        </>
      ) : (
        <p className="text-gray-400 text-sm">Drag a file here to summarize it.</p>
      )}

      <div className="mt-6 flex justify-end">
        <button onClick={onClose} className="bg-gray-200 px-3 py-1 rounded">
          Close
        </button>
      </div>
    </div>
  );
}
