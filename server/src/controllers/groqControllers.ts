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
    const parsedDocument = await getGroqResponse(docType, userPrompt);

    res.json({ success: true, document: parsedDocument });
  } catch (error: any) {
    console.error("Groq Error:", error.message || error);
    res
      .status(500)
      .json({ success: false, error: "Failed to generate document." });
  }
};
