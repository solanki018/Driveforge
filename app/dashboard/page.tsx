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
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) return;

    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('uploads')
      .list(user.id + '/', { limit: 100 });

    if (storageError || !storageFiles) return;

    const filesWithMeta = storageFiles.map((file) => {
      const originalName = file.name.includes('-')
        ? file.name.split('-').slice(1).join('-')
        : file.name;

      return {
        ...file,
        path: `${user.id}/${file.name}`,
        user_id: user.id,
        originalName,
      };
    });

    setFiles(filesWithMeta);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDropToSidebar = (file: any) => {
    setSelectedFile(file);
  };

  return (
    <div className="flex h-screen relative bg-gradient-to-br from-black via-gray-900 to-gray-800 text-gray-100">
      <Sidebar onFileUploaded={fetchFiles} />

      <main className="flex-1 overflow-y-auto p-6 pr-0 md:pr-[26rem]">
       
      
        

        {files.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📂</p>
            <p className="text-lg">No files uploaded yet</p>
            <p className="text-sm mt-2">Use the Upload button on the left sidebar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {files.map((file) => (
              <FileCard
                key={file.name}
                file={file}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', JSON.stringify(file));
                }}
                onDelete={async () => {
                  const { error } = await supabase.storage
                    .from('uploads')
                    .remove([file.path]);
                  if (error) {
                    console.error('Error deleting file:', error);
                  } else {
                    fetchFiles(); // Refresh list
                  }
                }}
              />
            ))}
          </div>
        )}
      </main>

      <RightSidebar
        file={selectedFile}
        onDropFile={handleDropToSidebar}
        onClose={() => setSelectedFile(null)}
      />
    </div>
  );
}
