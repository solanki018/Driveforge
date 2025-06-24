'use client';

import { useState } from 'react';
// Make sure this import points to the correct UploadModal component that accepts onClose and onUpload props
import UploadModal from './UploadModal';
import { useRouter } from 'next/navigation';
import { supabase } from 'lib/supabaseClient';

export default function Sidebar({ onFileUploaded }: { onFileUploaded: () => void }) {
  const [showUpload, setShowUpload] = useState(false);
  const router = useRouter();

  return (
    <div className="w-64 bg-white border-r p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">DriveForge</h2>
        <button
          onClick={() => setShowUpload(true)}
          className="w-full bg-blue-600 text-white py-2 rounded mb-4"
        >
          + Upload File
        </button>
        <button
          onClick={() => router.push('/analytics')}
          className="w-full bg-gray-200 text-gray-800 py-2 rounded"
        >
          📊 Analytics
        </button>
      </div>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push('/login');
        }}
        className="w-full bg-red-500 text-white py-2 rounded mt-6"
      >
        Logout
      </button>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUpload={onFileUploaded} />}
    </div>
  );
}
