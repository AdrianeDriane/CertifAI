// routes/groqRoutes.ts
import express, { Request, Response } from 'express';
import { getGroqResponse } from '../services/groqService';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { docType, userPrompt } = req.body;

  if (!docType || !userPrompt) {
    return res.status(400).json({ success: false, error: 'Missing docType or userPrompt' });
  }

  try {
    const document = await getGroqResponse(docType, userPrompt);
    res.json({ success: true, document });
  } catch (error: any) {
    console.error('Groq Error:', error.message || error);
    res.status(500).json({ success: false, error: 'Failed to generate document.' });
  }
});

export default router;
