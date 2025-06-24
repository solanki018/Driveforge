'use client';

import { FileSummary } from '../types';

export default function FileCard({
  file,
  onDragStart,
  draggable = false,
  onDelete,

}: {
  file: FileSummary;
  onDragStart?: () => void;
  draggable?: boolean;
  onDelete?: () => void | Promise<void>,
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-100"
    >
      <p className="text-sm font-semibold truncate">{file.name}</p>
      <p className="text-xs text-gray-500 mt-1">{file.wordCount} words</p>
    </div>
  );
}

// type FileCardProps = {
//   file: FileSummary;
//   onDragStart?: () => void;
//   draggable?: boolean;
//   onDelete?: () => void | Promise<void>;
// };