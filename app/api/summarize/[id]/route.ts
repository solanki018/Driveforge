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
    try {
      // Use pdf-parse which is designed for Node.js environments
      const pdfParse = (await import('pdf-parse-debugging-disabled')).default;
      
      const data = await pdfParse(buffer, {
        // Disable external resources that might cause issues
        max: 0, // Parse all pages
        version: 'v1.10.100'
      });
      
      return data.text;
    } catch (pdfError: unknown) {
      console.error('PDF parsing error:', pdfError);
      const errorMessage = pdfError instanceof Error ? pdfError.message : 'Unknown PDF parsing error';
      throw new Error(`Failed to parse PDF: ${errorMessage}`);
    }
  } else if (filename.endsWith('.docx')) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else if (filename.endsWith('.txt')) {
    return buffer.toString('utf-8');
  } else {
    throw new Error('Unsupported file type');
  }
}

// ✅ New endpoint: file summarization based on query params
export async function POST(req: NextRequest) {
  try {
    const { user_id, name, path } = await req.json();

    if (!user_id || !name || !path) {
      return Response.json({ error: 'Missing file metadata' }, { status: 400 });
    }

    // 🧠 Get public URL of file
    const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(path);
    const fileUrl = publicData?.publicUrl;

    if (!fileUrl) {
      return Response.json({ error: 'Unable to generate file URL' }, { status: 400 });
    }

    // ⬇️ Download file buffer
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) throw new Error('Failed to download file from storage');
    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 📖 Extract text
    const text = await extractText(buffer, name);

    // ✨ Summarize using Gemini
    const geminiRes = await model.generateContent('Summarize this: \n' + text);
    const summary = geminiRes.response.text();

    // 💾 Optional: store in DB if needed
    // await supabase.from('summaries').insert({ user_id, name, summary });

    return Response.json({ summary });

  } catch (error: any) {
    console.error('Summarize API Error:', error);
    return Response.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
