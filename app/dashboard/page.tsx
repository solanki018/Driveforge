// ✅ app/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { supabase } from 'lib/supabaseClient';
import Sidebar from 'components/Sidebar';
import RightSidebar from 'components/RightSidebar';
import FileCard from 'components/FileCard';

export default function DashboardPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);

  const fetchFiles = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return;

  // Get uploaded file names
  const { data: storageFiles, error: storageError } = await supabase
    .storage
    .from('uploads')
    .list(user.id + '/', { limit: 100, offset: 0 });

  if (storageError || !storageFiles) return;

  // Get summaries from Supabase DB
  const { data: summaries, error: summariesError } = await supabase
    .from('summaries')
    .select('*')
    .eq('user_id', user.id); // use the correct column to filter

  if (summariesError) return;

  // Merge each file with its corresponding summary ID
  const filesWithId = storageFiles.map((file) => {
    const matchingSummary = summaries.find((s) => s.name === file.name);
    return {
      ...file,
      id: matchingSummary?.id ?? null,
      summary: matchingSummary?.summary ?? null,
    };
  });

  setFiles(filesWithId);
};


  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDropToSidebar = (file: any) => {
    setSelectedFile(file);
  };

  return (
    <div className="flex h-screen relative">
      <Sidebar onFileUploaded={fetchFiles} />

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 pr-[26rem]">
        <h1 className="text-2xl font-bold mb-4">📁 Your Files</h1>
        {files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {files.map((file) => (
              <FileCard
                key={file.name}
                file={file}
                draggable
                onDragStart={() => setSelectedFile(file)}
                onDelete={fetchFiles} // Re-fetch after deletion
              />
            ))}
          </div>
        )}
      </div>

      <RightSidebar
        file={selectedFile}
        onDropFile={handleDropToSidebar}
        onClose={() => setSelectedFile(null)}
      />
    </div>
  );
}
