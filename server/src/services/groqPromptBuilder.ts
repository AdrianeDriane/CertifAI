const docTypeFormatting: Record<string, any> = {
  Affidavit: {
    titleFontSize: 14,
    bodyFontSize: 12,
    titleAlignment: "Center",
    lineSpacing: 1.5,
    beforeSpacing: 12,
    afterSpacing: 12,
  },
  Contract: {
    titleFontSize: 16,
    bodyFontSize: 12,
    titleAlignment: "Center",
    lineSpacing: 1.15,
    beforeSpacing: 10,
    afterSpacing: 10,
  },
  Certificate: {
    titleFontSize: 16,
    bodyFontSize: 12,
    titleAlignment: "Center",
    lineSpacing: 1.5,
    beforeSpacing: 24,
    afterSpacing: 12,
  },
  "Authorization Letter": {
    titleFontSize: 14,
    bodyFontSize: 12,
    titleAlignment: "Center",
    lineSpacing: 1.5,
    beforeSpacing: 20,
    afterSpacing: 10,
  },
  default: {
    titleFontSize: 14,
    bodyFontSize: 12,
    titleAlignment: "Center",
    lineSpacing: 1.5,
    beforeSpacing: 12,
    afterSpacing: 12,
  },
};

export function buildLegalDocumentPrompt(
  docType: string,
  userPrompt: string
): string {
  const baseStructureExample = `{
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
              "text": "DOCUMENT TITLE",
              "characterFormat": {
                "bold": true,
                "fontSize": 16,
                "fontFamily": "Times New Roman"
              }
            }
          ]
        }
      ]
    }
  ]
}`;

  let specificInstructions = "";

  switch (docType) {
    case "certificate_of_employment":
      specificInstructions = `
Generate a Certificate of Employment with these sections:
1. Title: "CERTIFICATE OF EMPLOYMENT" (centered, bold, 16pt)
2. Greeting: "TO WHOM IT MAY CONCERN:" (left-aligned, bold, 12pt)
3. Main certification paragraph (justified, 12pt)
4. Employment details paragraph (justified, 12pt)  
5. Purpose statement (justified, 12pt)
6. Location and date (left-aligned, 12pt)
7. Signature section with name and title placeholders (left-aligned, 12pt)

Use the user prompt to fill in specific details like employee name, position, company, etc.
`;
      break;

    default:
      specificInstructions = `
Generate a professional ${docType.replace(/_/g, " ")} document.
Use the user prompt to determine the specific content and details.
`;
  }

  return `
Create a legal document in SFDT (Syncfusion Document Format) JSON format.

CRITICAL FORMATTING RULES:
- NEVER create nested "blocks" arrays inside blocks
- Each block must only contain "paragraphFormat" and "inlines"
- Use proper spacing with beforeSpacing and afterSpacing
- All text must be in "inlines" array within each block
- Use Times New Roman font family
- Standard margins: 72 points (1 inch) on all sides

${specificInstructions}

User Requirements: ${userPrompt}

EXAMPLE STRUCTURE (DO NOT DEVIATE FROM THIS PATTERN):
${baseStructureExample}

Generate ONLY the JSON structure, no explanations or markdown formatting.
Ensure the JSON is valid and follows the exact SFDT format shown above.
`;
}
