import { FileSummary } from '../types';

export async function getSummaryFromGemini({
  file,
}: {
  file: FileSummary;
}): Promise<string> {
  const res = await fetch(`/api/summarize/${file.id}`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error('Failed to generate summary');
  }

  const data = await res.json();
  return data.summary;
}
