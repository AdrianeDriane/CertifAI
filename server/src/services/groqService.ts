import { Groq } from 'groq-sdk';
import { buildLegalDocumentPrompt } from './groqPromptBuilder';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface SFDTInline {
  text: string;
  characterFormat: {
    bold?: boolean;
    fontSize?: number;
    fontFamily?: string;
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
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.sections)) return false;
  
  return data.sections.every((section: any) => {
    if (!section.sectionFormat || !section.sectionFormat.pageSetup) return false;
    if (!Array.isArray(section.blocks)) return false;
    
    return section.blocks.every((block: any) => {
      if (!block.paragraphFormat || !Array.isArray(block.inlines)) return false;
      
      return block.inlines.every((inline: any) => 
        typeof inline.text === 'string' && 
        inline.characterFormat && 
        typeof inline.characterFormat === 'object'
      );
    });
  });
}

function extractJSON(text: string): string {
  // Remove code blocks and markdown
  let cleaned = text
    .replace(/```(?:json|javascript)?\s*/gi, '')
    .replace(/```\s*$/g, '')
    .trim();

  // Find JSON object boundaries
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    throw new Error('No valid JSON object found in response');
  }
  
  return cleaned.substring(jsonStart, jsonEnd + 1);
}

function sanitizeJSON(jsonString: string): string {
  return jsonString
    .replace(/[""]/g, '"')           // Replace smart quotes
    .replace(/['']/g, "'")           // Replace smart single quotes
    .replace(/,\s*([}\]])/g, '$1')   // Remove trailing commas
    .replace(/\r?\n/g, ' ')          // Replace newlines with spaces
    .replace(/\s+/g, ' ')            // Normalize whitespace
    .trim();
}

export async function getGroqResponse(docType: string, userPrompt: string): Promise<SFDTDocument> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY environment variable is not set');
  }

  const fullPrompt = buildLegalDocumentPrompt(docType, userPrompt);

  try {
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192', // Using a more stable model
      messages: [
        { 
          role: 'system', 
          content: 'You are a legal document generator. Respond only with valid JSON in SFDT format. No explanations or additional text.' 
        },
        { role: 'user', content: fullPrompt }
      ],
      temperature: 0.3, // Lower temperature for more consistent output
      max_tokens: 4000,
      top_p: 0.9,
    });

    const rawContent = response.choices[0]?.message?.content;
    
    if (!rawContent) {
      throw new Error('No content received from Groq API');
    }

    console.log('Raw Groq Response:', rawContent.substring(0, 500) + '...');

    // Extract and sanitize JSON
    const jsonString = extractJSON(rawContent);
    const sanitizedJSON = sanitizeJSON(jsonString);

    console.log('Sanitized JSON:', sanitizedJSON.substring(0, 500) + '...');

    let parsedDocument: any;
    try {
      parsedDocument = JSON.parse(sanitizedJSON);
    } catch (parseError: any) {
      console.error('JSON Parse Error:', parseError.message);
      console.error('Failed JSON:', sanitizedJSON);
      throw new Error(`Invalid JSON format: ${parseError.message}`);
    }

    // Validate SFDT structure
    if (!validateSFDTStructure(parsedDocument)) {
      console.error('Invalid SFDT structure:', JSON.stringify(parsedDocument, null, 2));
      throw new Error('Generated document does not match SFDT format requirements');
    }

    return parsedDocument as SFDTDocument;

  } catch (error: any) {
    console.error('Groq API Error:', error);
    
    if (error.message?.includes('rate limit')) {
      throw new Error('API rate limit exceeded. Please try again in a few minutes.');
    }
    
    if (error.message?.includes('API key')) {
      throw new Error('Invalid API key configuration');
    }
    
    throw error;
  }
}