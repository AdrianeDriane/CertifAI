const docTypeFormatting: Record<string, any> = {
  "Affidavit": {
    titleFontSize: 14,
    bodyFontSize: 12,
    titleAlignment: "Center",
    lineSpacing: 1.5,
    beforeSpacing: 12,
    afterSpacing: 12
  },
  "Contract": {
    titleFontSize: 16,
    bodyFontSize: 12,
    titleAlignment: "Center",
    lineSpacing: 1.15,
    beforeSpacing: 10,
    afterSpacing: 10
  },
  "Certificate": {
    titleFontSize: 16,
    bodyFontSize: 12,
    titleAlignment: "Center",
    lineSpacing: 1.5,
    beforeSpacing: 24,
    afterSpacing: 12
  },
  "Authorization Letter": {
    titleFontSize: 14,
    bodyFontSize: 12,
    titleAlignment: "Center",
    lineSpacing: 1.5,
    beforeSpacing: 20,
    afterSpacing: 10
  },
  "default": {
    titleFontSize: 14,
    bodyFontSize: 12,
    titleAlignment: "Center",
    lineSpacing: 1.5,
    beforeSpacing: 12,
    afterSpacing: 12
  }
};

export function buildLegalDocumentPrompt(docType: string, userPrompt: string): string {
  return `
You are Certifai, an AI legal assistant specializing in Philippine legal documents.

Objective:
Generate a complete, formally structured legal document suitable for Philippine use based on the following:

- Document Type: ${docType}
- Purpose: ${userPrompt}

Output Format:
You must return a single valid JSON object only in SFDT (Syncfusion Document Text) format with proper formatting for professional legal documents. DO NOT include any code block, markdown, explanation, or commentary.

Required Formatting:
- Use "Times New Roman", 12pt for body text
- Use bold and 16pt for titles (center aligned)
- Margins: 1 inch (72 points) on all sides
- Line spacing: 1.5 with lineSpacingType set to "Multiple"
- Paragraphs must be separate blocks
- Center alignment for document title only
- Left alignment for body content
- Set beforeSpacing: 12 and afterSpacing: 12 for body paragraphs
- Include signature blocks, dates, and legal formalities

Instructions:
- Output realistic, professional, and comprehensive legal language
- Simulate the full structure of real Philippine legal documents
- Use legal terms, section headers, and closing statements
- Use placeholders if needed (e.g., [Employee Name], [Date], [Address])
- Return only valid JSON in SFDT format

Example SFDT JSON output structure:
{
  "sections": [
    {
      "sectionFormat": {
        "pageSetup": {
          "topMargin": 72,
          "bottomMargin": 72,
          "leftMargin": 72,
          "rightMargin": 72
        }
      },
      "blocks": [
        {
          "paragraphFormat": {
            "textAlignment": "Center",
            "beforeSpacing": 12,
            "afterSpacing": 18,
            "lineSpacing": 1.5,
            "lineSpacingType": "Multiple"
          },
          "inlines": [
            {
              "text": "[DOCUMENT TITLE]",
              "characterFormat": {
                "bold": true,
                "fontSize": 16,
                "fontFamily": "Times New Roman"
              }
            }
          ]
        },
        {
          "paragraphFormat": {
            "textAlignment": "Left",
            "beforeSpacing": 12,
            "afterSpacing": 12,
            "lineSpacing": 1.5,
            "lineSpacingType": "Multiple"
          },
          "inlines": [
            {
              "text": "[First paragraph of legal content]",
              "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Times New Roman"
              }
            }
          ]
        },
        {
          "inlines": [
            {
              "text": "[Additional paragraphs, signatories, date lines, etc.]"
            }
          ]
        }
      ]
    }
  ]
}
`.trim();
}
