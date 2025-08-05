import express, { Request, Response } from 'express';
import { getGroqResponse } from '../services/groqService';

const router = express.Router();

// Utility: sanitize and clean Groq response into valid JSON
function sanitizeToValidJSON(raw: string): string {
  return raw
    .replace(/^```(?:json)?/i, '')   // remove starting ```
    .replace(/```$/, '')             // remove ending ```
    .replace(/[“”]/g, '"')           // replace fancy double quotes
    .replace(/[‘’]/g, "'")           // replace fancy single quotes
    .replace(/\r?\n|\r/g, '')        // remove line breaks
    .trim();
}

router.post('/', async (req: Request, res: Response) => {
  const { docType, userPrompt } = req.body;

  if (!docType || !userPrompt) {
    return res.status(400).json({ success: false, error: 'Missing docType or userPrompt' });
  }

  try {
    const rawResponse = await getGroqResponse(docType, userPrompt);
    const sanitized = sanitizeToValidJSON(rawResponse);

    let parsedDocument;
    try {
      parsedDocument = JSON.parse(sanitized);
    } catch (jsonError) {
      console.error('Invalid JSON from Groq:', sanitized);
      return res.status(500).json({ success: false, error: 'Groq returned invalid JSON.' });
    }

    res.json({ success: true, document: parsedDocument });
  } catch (error: any) {
    console.error('Groq Error:', error.message || error);
    res.status(500).json({ success: false, error: 'Failed to generate document.' });
  }
});

export default router;
