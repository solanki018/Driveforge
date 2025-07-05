'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { UploadCloud, X } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 📄 File icon based on extension
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
    const { error: uploadError } = await supabase.storage.from('uploads').upload(path, file);

    if (uploadError) {
      setError(uploadError.message || 'Upload failed');
      setUploading(false);
      return;
    }

    // ✅ Insert into file_analytics table
    const { error: insertError } = await supabase.from('file_analytics').insert({
      user_id: user.id,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,                 // for storage usage
      path,                                 // file location in storage
      summarized: false,
      uploaded_at: new Date().toISOString() // for history chart
    });

    if (insertError) {
      setError(insertError.message || 'Failed to save analytics');
      setUploading(false);
      return;
    }

    setUploading(false);
    onUpload(); // Refresh UI
    onClose();  // Close modal
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-700">
        {/* ❌ Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition"
        >
          <X size={18} />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-400">
          Upload a File
        </h2>

        {/* 📤 File input */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition mb-4"
        />

        {/* 📄 File name preview */}
        {file && (
          <div className="flex items-center gap-2 text-sm text-gray-200 mb-3 truncate">
            <span className="text-xl">{getFileIcon(file.name)}</span>
            <span className="truncate">{file.name}</span>
          </div>
        )}

        {/* ⚠️ Error message */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* ✅ Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <UploadCloud size={16} />
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
