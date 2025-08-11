import { Groq } from "groq-sdk";
import { buildLegalDocumentPrompt } from "./groqPromptBuilder";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface SFDTInline {
  text: string;
  characterFormat: {
    bold?: boolean;
    fontSize?: number;
    fontFamily?: string;
    italic?: boolean;
  };
}

interface SFDTBlock {
  paragraphFormat: {
    textAlignment?: string;
    beforeSpacing?: number;
    afterSpacing?: number;
    lineSpacing?: number;
    lineSpacingType?: string;
  };
  inlines: SFDTInline[];
}

interface SFDTSection {
  sectionFormat: {
    pageSetup: {
      topMargin: number;
      bottomMargin: number;
      leftMargin: number;
      rightMargin: number;
    };
  };
  blocks: SFDTBlock[];
}

interface SFDTDocument {
  sections: SFDTSection[];
}

function validateSFDTStructure(data: any): data is SFDTDocument {
  console.log("Validating SFDT structure:", JSON.stringify(data, null, 2));

  if (!data || typeof data !== "object") {
    console.error("Data is not an object");
    return false;
  }

  if (!Array.isArray(data.sections)) {
    console.error("Sections is not an array");
    return false;
  }

  return data.sections.every((section: any, sectionIndex: number) => {
    console.log(`Validating section ${sectionIndex}:`, section);

    if (!section.sectionFormat || !section.sectionFormat.pageSetup) {
      console.error(
        `Section ${sectionIndex}: Missing sectionFormat or pageSetup`
      );
      return false;
    }

    if (!Array.isArray(section.blocks)) {
      console.error(`Section ${sectionIndex}: blocks is not an array`);
      return false;
    }

    return section.blocks.every((block: any, blockIndex: number) => {
      console.log(`Validating block ${blockIndex}:`, block);

      // Check for invalid nested blocks structure
      if (block.blocks) {
        console.error(
          `Block ${blockIndex}: Invalid nested blocks structure detected`
        );
        return false;
      }

      if (!block.paragraphFormat) {
        console.error(`Block ${blockIndex}: Missing paragraphFormat`);
        return false;
      }

      if (!Array.isArray(block.inlines)) {
        console.error(`Block ${blockIndex}: inlines is not an array`);
        return false;
      }

      return block.inlines.every((inline: any, inlineIndex: number) => {
        if (typeof inline.text !== "string") {
          console.error(
            `Block ${blockIndex}, Inline ${inlineIndex}: text is not a string`
          );
          return false;
        }

        if (
          !inline.characterFormat ||
          typeof inline.characterFormat !== "object"
        ) {
          console.error(
            `Block ${blockIndex}, Inline ${inlineIndex}: Missing or invalid characterFormat`
          );
          return false;
        }

        return true;
      });
    });
  });
}

function sanitizeSFDTStructure(data: any): SFDTDocument {
  // Fix common structural issues that Groq might generate
  if (!data.sections || !Array.isArray(data.sections)) {
    throw new Error("Missing or invalid sections array");
  }

  const sanitizedSections = data.sections.map((section: any) => {
    if (!section.blocks || !Array.isArray(section.blocks)) {
      throw new Error("Missing or invalid blocks array in section");
    }

    // Flatten any nested blocks structures
    const flattenedBlocks: any[] = [];

    section.blocks.forEach((block: any) => {
      if (block.blocks && Array.isArray(block.blocks)) {
        // This is the problematic nested structure - flatten it
        console.log("Flattening nested blocks structure");
        block.blocks.forEach((nestedBlock: any) => {
          flattenedBlocks.push(nestedBlock);
        });
      } else {
        // Normal block structure
        flattenedBlocks.push(block);
      }
    });

    return {
      ...section,
      blocks: flattenedBlocks,
    };
  });

  return {
    sections: sanitizedSections,
  };
}

function extractJSON(text: string): string {
  // Remove code blocks and markdown
  let cleaned = text
    .replace(/```(?:json|javascript)?\s*/gi, "")
    .replace(/```\s*$/g, "")
    .trim();

  // Find JSON object boundaries
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
    .trim();
}

export async function getGroqResponse(
  docType: string,
  userPrompt: string
): Promise<SFDTDocument> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY environment variable is not set");
  }

  const fullPrompt = buildLegalDocumentPrompt(docType, userPrompt);

  try {
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: `You are a legal document generator. You must respond ONLY with valid JSON in SFDT format.

CRITICAL RULES:
1. NO nested "blocks" arrays inside blocks - this is invalid
2. Each block must contain only: paragraphFormat and inlines
3. Never put blocks inside blocks
4. Follow this exact structure:

{
  "sections": [{
    "sectionFormat": {
      "pageSetup": {
        "topMargin": 72,
        "bottomMargin": 72,
        "leftMargin": 72,
        "rightMargin": 72
      }
    },
    "blocks": [{
      "paragraphFormat": {
        "textAlignment": "Center",
        "beforeSpacing": 12,
        "afterSpacing": 18,
        "lineSpacing": 1.5,
        "lineSpacingType": "Multiple"
      },
      "inlines": [{
        "text": "Your text here",
        "characterFormat": {
          "bold": true,
          "fontSize": 16,
          "fontFamily": "Times New Roman"
        }
      }]
    }]
  }]
}

Respond with ONLY the JSON, no explanations.`,
        },
        { role: "user", content: fullPrompt },
      ],
      temperature: 0.1, // Very low temperature for consistency
      max_tokens: 4000,
      top_p: 0.8,
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

    let parsedDocument: any;
    try {
      parsedDocument = JSON.parse(sanitizedJSON);
    } catch (parseError: any) {
      console.error("JSON Parse Error:", parseError.message);
      console.error("Failed JSON:", sanitizedJSON);
      throw new Error(`Invalid JSON format: ${parseError.message}`);
    }

    // Sanitize structure to fix common issues
    const sanitizedDocument = sanitizeSFDTStructure(parsedDocument);

    // Validate SFDT structure
    if (!validateSFDTStructure(sanitizedDocument)) {
      console.error("Invalid SFDT structure after sanitization");
      throw new Error(
        "Generated document does not match SFDT format requirements"
      );
    }

    return sanitizedDocument as SFDTDocument;
  } catch (error: any) {
    console.error("Groq API Error:", error);

    if (error.message?.includes("rate limit")) {
      throw new Error(
        "API rate limit exceeded. Please try again in a few minutes."
      );
    }

    if (error.message?.includes("API key")) {
      throw new Error("Invalid API key configuration");
    }

    throw error;
  }
}
