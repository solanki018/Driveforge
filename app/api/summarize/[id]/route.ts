// ✅ File: app/api/summarize/[id]/route.ts

import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import mammoth from 'mammoth';
import 'dotenv/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function extractText(buffer: Buffer, filename: string): Promise<string> {
  if (filename.endsWith('.pdf')) {
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    return data.text;
  } else if (filename.endsWith('.docx')) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else if (filename.endsWith('.txt')) {
    return buffer.toString('utf-8');
  } else {
    throw new Error('Unsupported file type');
  }
}

// Test version - let's see if this works first
export async function POST(req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract ID from URL manually
    const url = req.url;
    const id = url.split('/').pop();
    
    console.log('Extracted ID:', id); // Debug log
    
    if (!id) {
      return Response.json({ error: 'ID not found in URL' }, { status: 400 });
    }

    // ⛳ Fetch file metadata from Supabase
    const { data: fileData, error } = await supabase
      .from('summaries')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !fileData) {
      console.log('Supabase error:', error); // Debug log
      return new Response(JSON.stringify({ error: 'File not found' }), {
        status: 500,
      });
    }

    // ⬇️ Fetch the file from Supabase Storage URL
    const response = await fetch(fileData.url);
    const arrayBuffer = await response.arrayBuffer();
    const text = await extractText(Buffer.from(arrayBuffer), fileData.name);

    // 🔮 Use Gemini to summarize
    const geminiRes = await model.generateContent(text);
    const summary = geminiRes.response.text();

    // 💾 Save summary to DB
    await supabase.from('summaries').update({ summary }).eq('id', id);

    return Response.json({ summary });
  } catch (error: any) {
    console.error('Summarize API Error:', error);
    return Response.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}