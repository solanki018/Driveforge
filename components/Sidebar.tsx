'use client';

import { useState } from 'react';
import UploadModal from './UploadModal';
import { useRouter } from 'next/navigation';
import { supabase } from 'lib/supabaseClient';
import { Upload, BarChart3, LogOut } from 'lucide-react';

export default function Sidebar({ onFileUploaded }: { onFileUploaded: () => void }) {
  const [showUpload, setShowUpload] = useState(false);
  const router = useRouter();

  return (
    <div className="w-64 h-full bg-gradient-to-b from-gray-950 via-gray-900 to-black border-r border-gray-800 p-5 flex flex-col justify-between text-white shadow-xl">
      <div>
        {/* Logo */}
        <h2 className="text-2xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          DriveForge
        </h2>

        {/* Upload Button */}
        <button
          onClick={() => setShowUpload(true)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg font-medium mb-4"
        >
          <Upload size={16} />
          Upload File
        </button>

        {/* Analytics */}
        <button
          onClick={() => router.push('/analytics')}
          className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 transition px-4 py-2 rounded-lg font-medium"
        >
          <BarChart3 size={16} />
          Analytics
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push('/login');
        }}
        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg font-medium mt-6"
      >
        <LogOut size={16} />
        Logout
      </button>

      {/* Upload Modal */}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUpload={onFileUploaded} />}
    </div>
  );
}
