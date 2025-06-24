// lib/extractText.ts
export async function extractTextFromFile(file: File): Promise<string> {
  const text = await file.text(); // works for .txt, .md, etc.
  return text;
}
