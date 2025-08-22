// Enhanced Groq service with better error handling and validation
import { Groq } from "groq-sdk";
import { buildLegalDocumentPrompt } from "./groqPromptBuilder";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Enhanced JSON extraction with better validation
function extractJSON(text: string): string {
  // Remove various markdown formats
  let cleaned = text
    .replace(/```(?:json|javascript|js)?\s*/gi, "")
    .replace(/```\s*$/g, "")
    .replace(/^\s*```\s*/g, "")
    .replace(/\s*```\s*$/g, "")
    .trim();

  // Try to find the main JSON object
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    throw new Error("No valid JSON object found in response");
  }

  return cleaned.substring(jsonStart, jsonEnd + 1);
}

function sanitizeJSON(jsonString: string): string {
  return jsonString
    .replace(/[""]/g, '"') // Replace smart quotes
    .replace(/['']/g, "'") // Replace smart single quotes
    .replace(/,\s*([}\]])/g, "$1") // Remove trailing commas
    .replace(/\r?\n/g, " ") // Replace newlines with spaces
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/\\n/g, "\\n") // Preserve escaped newlines
    .replace(/\\t/g, "\\t") // Preserve escaped tabs
    .trim();
}

// Validate the generated document structure
function validateDocumentStructure(parsed: any): void {
  const requiredFields = [
    "metadata",
    "header",
    "preamble",
    "parties",
    "signatures",
  ];

  for (const field of requiredFields) {
    if (!parsed[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate parties array
  if (!Array.isArray(parsed.parties) || parsed.parties.length === 0) {
    throw new Error("Document must have at least one party");
  }

  // Validate signatures array
  if (!Array.isArray(parsed.signatures) || parsed.signatures.length === 0) {
    throw new Error("Document must have signature provisions");
  }
}

// Main enhanced function
export async function getGroqResponse(
  docType: string,
  userPrompt: string
): Promise<any> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY environment variable is not set");
  }

  const fullPrompt = buildLegalDocumentPrompt(docType, userPrompt);

  try {
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192", // Use more powerful model for complex legal docs
      messages: [
        {
          role: "system",
          content: `You are a specialized Philippine legal document AI. Generate ONLY valid JSON responses with no additional text, explanations, or markdown formatting. Focus on legal precision, SFDT compatibility, and Philippine legal standards.`,
        },
        {
          role: "user",
          content: fullPrompt,
        },
      ],
      temperature: 0.1, // Low temperature for consistency
      max_tokens: 8000, // Increased for complex documents
      top_p: 0.9, // Slightly higher for better variety
      frequency_penalty: 0.1, // Reduce repetition
      presence_penalty: 0.1, // Encourage diverse content
    });

    const rawContent = response.choices[0]?.message?.content;

    if (!rawContent) {
      throw new Error("No content received from Groq API");
    }

    console.log("Raw Groq Response:", rawContent.substring(0, 500) + "...");

    // Extract and sanitize JSON
    const jsonString = extractJSON(rawContent);
    const sanitizedJSON = sanitizeJSON(jsonString);

    console.log("Sanitized JSON:", sanitizedJSON.substring(0, 500) + "...");

    // Parse JSON with enhanced error handling
    let parsed: any;
    try {
      parsed = JSON.parse(sanitizedJSON);
    } catch (parseError: any) {
      console.error("JSON Parse Error:", parseError.message);
      console.error("Failed JSON substring:", sanitizedJSON.substring(0, 1000));
      throw new Error(`Invalid JSON format: ${parseError.message}`);
    }

    // Validate document structure
    try {
      validateDocumentStructure(parsed);
    } catch (validationError: any) {
      console.warn(
        "Document structure validation warning:",
        validationError.message
      );
      // Don't throw - just warn, as some documents may have different structures
    }

    return parsed;
  } catch (error: any) {
    console.error("Groq API Error:", error);

    // Enhanced error handling
    if (error.message?.includes("rate limit") || error.code === 429) {
      throw new Error(
        "API rate limit exceeded. Please try again in a few minutes."
      );
    }

    if (error.message?.includes("API key") || error.code === 401) {
      throw new Error("Invalid API key configuration");
    }

    if (error.message?.includes("timeout") || error.code === 408) {
      throw new Error(
        "Request timeout. The document may be too complex. Please try with simpler requirements."
      );
    }

    if (error.message?.includes("content filter") || error.code === 400) {
      throw new Error(
        "Content filtered. Please ensure your request complies with usage policies."
      );
    }

    throw error;
  }
}
