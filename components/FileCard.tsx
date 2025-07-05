import { FileSummary } from '../types';
import { useState } from 'react';
import { MoreVertical, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import clsx from 'clsx';

function getFileEmoji(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return '📕';
    case 'doc':
    case 'docx':
      return '📝';
    case 'txt':
      return '📃';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
      return '🖼️';
    default:
      return '📄';
  }
}

export default function FileCard({
  file,
  onDragStart,
  draggable = false,
  onDelete,
}: {
  file: FileSummary;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  draggable?: boolean;
  onDelete?: () => void | Promise<void>;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const icon = getFileEmoji(file.name);

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={() => {
        const url = supabase.storage.from('uploads').getPublicUrl(file.path).data.publicUrl;
        window.open(url, '_blank');
      }}
      className={clsx(
        'relative group w-full max-w-xs rounded-2xl bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6',
        'text-white shadow-xl hover:shadow-2xl border border-gray-700 transition-all duration-300 cursor-pointer',
        'flex flex-col items-center justify-between h-60 overflow-hidden'
      )}
    >
      {/* File Icon */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm text-4xl mb-4 shadow-inner">
        {icon}
      </div>

      {/* File Name */}
      <div className="text-center px-2">
        <p className="text-md font-medium truncate">{file.originalName || file.name}</p>
      </div>

      {/* Three-dot Menu */}
      <div className="absolute top-3 right-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(prev => !prev);
          }}
          className="p-1 rounded hover:bg-white/10 transition"
        >
          <MoreVertical size={18} />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-20 overflow-hidden">
            <button
              onClick={async (e) => {
                e.stopPropagation();
                setShowMenu(false);
                await onDelete?.();
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700 w-full transition"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
