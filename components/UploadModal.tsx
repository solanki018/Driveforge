'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 📄 File icon based on file extension
function getFileIcon(filename?: string) {
  if (!filename) return '📄';
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return '📕';
    case 'docx':
      return '📝';
    case 'txt':
      return '📃';
    default:
      return '📄';
  }
}

export default function UploadModal({
  onClose,
  onUpload,
}: {
  onClose: () => void;
  onUpload: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      setError('User not logged in');
      setUploading(false);
      return;
    }

    const path = `${user.id}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from('uploads')
      .upload(path, file);

    setUploading(false);

    if (error) {
      setError(error.message || 'Upload failed');
    } else {
      onUpload();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Upload & Summarize File</h2>

        <input
          type="file"
          accept=".txt,.pdf,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4 w-full"
        />

        {/* Preview selected file safely */}
        {file && (
          <div className="flex items-center mb-4 text-sm text-gray-700">
            <span className="mr-2 text-lg">{getFileIcon(file.name)}</span>
            <span className="truncate">{file.name}</span>
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={uploading || !file}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
