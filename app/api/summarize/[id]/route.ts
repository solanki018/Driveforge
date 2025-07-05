import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import 'dotenv/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function extractText(buffer: Buffer, filename: string): Promise<string> {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (!ext || buffer.length === 0) {
    throw new Error('Unsupported file or empty buffer.');
  }

  if (ext === 'pdf') {
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    return data.text || '';
  }

  if (ext === 'docx') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  }

  if (ext === 'txt') {
    return buffer.toString('utf-8');
  }

  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    const base64Image = `data:image/${ext};base64,${buffer.toString('base64')}`;
    const result = await Tesseract.recognize(base64Image, 'eng');
    return result.data.text || '';
  }

  throw new Error(`Unsupported file type: ${ext}`);
}

export async function POST(req: NextRequest) {
  try {
    const { user_id, name, path } = await req.json();

    if (!user_id || !name || !path) {
      return Response.json({ error: 'Missing file metadata' }, { status: 400 });
    }

    // 🔽 Step 1: Get public URL of uploaded file
    const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(path);
    const fileUrl = publicData?.publicUrl;

    if (!fileUrl) {
      return Response.json({ error: 'Failed to get public URL from Supabase' }, { status: 400 });
    }

    // 🔽 Step 2: Fetch file from public URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error('Unable to download file from Supabase storage.');
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🔽 Step 3: Extract text
    const extractedText = await extractText(buffer, name);

    if (!extractedText.trim()) {
      return Response.json({ error: 'No text found in file' }, { status: 400 });
    }

    // 🔽 Step 4: Summarize with Gemini
    const geminiRes = await model.generateContent('Summarize this:\n' + extractedText);
    const summary = geminiRes.response.text();

    // 🔽 Step 5: Update analytics in Supabase
    await supabase
      .from('file_analytics')
      .update({ summarized: true })
      .match({ user_id, file_name: name });

    return Response.json({ summary });
  } catch (error: any) {
    console.error('Summarize API Error:', error);
    return Response.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
