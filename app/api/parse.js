import { NextApiRequest, NextApiResponse } from 'next';
import getRawBody from 'raw-body';

export const config = {
  api: {
    bodyParser: false, // We'll read raw body for PDF
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Only POST allowed');
  }

  const pdfParse = (await import('pdf-parse')).default;
  const buffer = await getRawBody(req); // get the uploaded file as buffer
  const result = await pdfParse(buffer);

  res.status(200).json({ text: result.text });
}
