import { Request, Response } from "express";
import { getGroqResponse } from "../services/groqService";
import { sanitizeToValidJSON } from "../utils/groqUtils";

export const generateDocument = async (req: Request, res: Response) => {
  const { docType, userPrompt } = req.body;

  if (!docType || !userPrompt) {
    return res
      .status(400)
      .json({ success: false, error: "Missing docType or userPrompt" });
  }

  try {
    const rawResponse = await getGroqResponse(docType, userPrompt);
    const sanitized = sanitizeToValidJSON(rawResponse);

    let parsedDocument;
    try {
      parsedDocument = JSON.parse(sanitized);
    } catch (jsonError) {
      console.error("Invalid JSON from Groq:", sanitized);
      return res
        .status(500)
        .json({ success: false, error: "Groq returned invalid JSON." });
    }

    res.json({ success: true, document: parsedDocument });
  } catch (error: any) {
    console.error("Groq Error:", error.message || error);
    res
      .status(500)
      .json({ success: false, error: "Failed to generate document." });
  }
};
