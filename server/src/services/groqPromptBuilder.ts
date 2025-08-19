const docTypeFormatting: Record<string, any> = {
  Affidavit: {
    titleFontSize: 14,
    bodyFontSize: 12,
    titleAlignment: "Center",
    lineSpacing: 1.5,
    beforeSpacing: 12,
    afterSpacing: 12,
    bodyAlignment: "Justify",
    titleCase: true, // Use all uppercase for title
    headingBold: true,
    fontFamily: "Arial", // Changed to Arial for universal availability
  },
  Contract: {
    titleFontSize: 16,
    bodyFontSize: 12,
    titleAlignment: "Center",
    lineSpacing: 1.15,
    beforeSpacing: 10,
    afterSpacing: 10,
    bodyAlignment: "Justify",
    titleCase: true,
    headingBold: true,
    fontFamily: "Arial",
  },
  Certificate: {
    titleFontSize: 16,
    bodyFontSize: 12,
    titleAlignment: "Center",
    lineSpacing: 1.5,
    beforeSpacing: 24,
    afterSpacing: 12,
    bodyAlignment: "Justify",
    titleCase: true,
    headingBold: true,
    fontFamily: "Arial",
  },
  "Authorization Letter": {
    titleFontSize: 14,
    bodyFontSize: 12,
    titleAlignment: "Center",
    lineSpacing: 1.5,
    beforeSpacing: 20,
    afterSpacing: 10,
    bodyAlignment: "Left",
    titleCase: false,
    headingBold: true,
    fontFamily: "Arial",
  },
  default: {
    titleFontSize: 14,
    bodyFontSize: 12,
    titleAlignment: "Center",
    lineSpacing: 1.5,
    beforeSpacing: 12,
    afterSpacing: 12,
    bodyAlignment: "Justify",
    titleCase: true,
    headingBold: true,
    fontFamily: "Arial",
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
        },
        "headerDistance": 36,
        "footerDistance": 36,
        "differentFirstPage": true,
        "header": {
          "blocks": [
            {
              "paragraphFormat": {
                "textAlignment": "Center",
                "lineSpacing": 1,
                "beforeSpacing": 0,
                "afterSpacing": 0
              },
              "inlines": [
                {
                  "text": "CONFIDENTIAL LEGAL DOCUMENT",
                  "characterFormat": {
                    "fontSize": 10,
                    "fontFamily": "Arial",
                    "italic": true
                  }
                }
              ]
            }
          ]
        },
        "footer": {
          "blocks": [
            {
              "paragraphFormat": {
                "textAlignment": "Center",
                "lineSpacing": 1,
                "beforeSpacing": 0,
                "afterSpacing": 0
              },
              "inlines": [
                {
                  "text": "Page ",
                  "characterFormat": {
                    "fontSize": 10,
                    "fontFamily": "Arial"
                  }
                },
                {
                  "fieldType": 0, // Field begin
                  "characterFormat": {}
                },
                {
                  "text": "PAGE",
                  "characterFormat": {}
                },
                {
                  "fieldType": 1, // Field separator
                  "characterFormat": {}
                },
                {
                  "fieldType": 2, // Field end
                  "characterFormat": {}
                }
              ]
            }
          ]
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
                "fontFamily": "Arial",
                "allCaps": true
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
              "text": "Subheading: ",
              "characterFormat": {
                "bold": true,
                "fontSize": 12,
                "fontFamily": "Arial"
              }
            },
            {
              "text": "Content under subheading",
              "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Arial"
              }
            }
          ]
        },
        // Example signature block
        {
          "paragraphFormat": {
            "textAlignment": "Left",
            "beforeSpacing": 24,
            "afterSpacing": 0,
            "lineSpacing": 1,
            "lineSpacingType": "Multiple"
          },
          "inlines": [
            {
              "text": "Signature: _______________________________",
              "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Arial"
              }
            }
          ]
        }
      ]
    }
  ]
}`;

  // Normalize docType for lookup (e.g., convert "certificate_of_employment" to "Certificate")
  const normalizedDocType = docType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  const formatting = docTypeFormatting[normalizedDocType] || docTypeFormatting.default;

  let specificInstructions = `
Generate a professional ${normalizedDocType} document in a formal legal style.
Key formatting guidelines:
- Title: Font size ${formatting.titleFontSize}pt, ${formatting.headingBold ? 'bold, ' : ''}aligned ${formatting.titleAlignment.toLowerCase()}, ${formatting.fontFamily}${formatting.titleCase ? ', all uppercase' : ''}
- Headings/Subheadings: Bold, font size ${formatting.bodyFontSize}pt, left-aligned or centered as appropriate, ${formatting.fontFamily}; use separate inlines for bold heading text followed by non-bold content if in same paragraph
- Body text: Font size ${formatting.bodyFontSize}pt, ${formatting.fontFamily}, aligned ${formatting.bodyAlignment.toLowerCase()}, line spacing ${formatting.lineSpacing}, before spacing ${formatting.beforeSpacing}pt, after spacing ${formatting.afterSpacing}pt
- Ensure proper content placement: Each section (title, greeting, paragraphs, signatures) must be in its own dedicated block; do not mix content from different sections in the same block; follow the logical order specified
- Use justified alignment for body paragraphs unless left-aligned for letters or specific sections
- Include standard legal design elements: All caps for titles if specified, bold/underline for headings, numbered lists for clauses (use "listFormat" in paragraphFormat for numbering, e.g., {"listId": 0, "listLevelNumber": 0}), signature lines with underlines (use inlines with text like "____________________"), date lines, witness sections, notarization blocks if relevant
- Structure with clear, hierarchical sections: Use bold subheadings as separate blocks or inline bold text; indented subclauses if needed (use tabs or spaces in text, or listFormat for levels)
- For multi-page docs: Add headers (e.g., document title or confidential notice) and footers (e.g., page numbers using fields)
- Use formal language: Avoid contractions, use precise legal terminology (e.g., "hereinafter referred to as"), ensure objectivity and clarity
- If applicable, include tables for schedules, exhibits, or itemized lists (use "rows" with "cells" in table blocks); ensure table content is properly placed within cells' blocks/inlines
- To avoid misplaced content: Strictly adhere to the section order; map user prompt details to the correct sections (e.g., employee name in certification paragraph, not in title); validate that all required sections are present and content is not duplicated or out of order

Use the user prompt to fill in specific details like names, dates, terms, etc., and adapt the structure accordingly without misplacing elements.
`;

  switch (docType) {
    case "certificate_of_employment":
      specificInstructions = `
Generate a Certificate of Employment with these sections in formal legal style, in this exact order:
1. Title block: "CERTIFICATE OF EMPLOYMENT"${formatting.titleCase ? ' (all caps)' : ''} (centered, ${formatting.headingBold ? 'bold, ' : ''}${formatting.titleFontSize}pt, ${formatting.fontFamily})
2. Greeting block: "TO WHOM IT MAY CONCERN:" (left-aligned, bold, ${formatting.bodyFontSize}pt, uppercase)
3. Main certification paragraph block (justified, ${formatting.bodyFontSize}pt, line spacing ${formatting.lineSpacing}; place certification text here only)
4. Employment details paragraph block (justified, ${formatting.bodyFontSize}pt; place details like position, dates here)  
5. Purpose statement block (justified, ${formatting.bodyFontSize}pt; place purpose text here)
6. Location and date line block (left-aligned, ${formatting.bodyFontSize}pt, e.g., "Done at [City], this [Date]")
7. Signature section block: Name and title placeholders with underline for signature (left-aligned, ${formatting.bodyFontSize}pt, e.g., "Signature: ____________________\\nName: [Name]\\nTitle: [Title]"; use separate inlines or blocks for multi-line)

Apply spacing: before ${formatting.beforeSpacing}pt, after ${formatting.afterSpacing}pt for paragraphs.
Use formal, objective language like "This is to certify that...".
Use the user prompt to fill in specific details like employee name, position, company, dates of employment, etc., placing them in the correct blocks only.
Add a header with "CERTIFICATE" if multi-page.
Ensure no content overlap: e.g., do not put employment details in the purpose block.
`;
      break;

    case "affidavit":
      specificInstructions = `
Generate an Affidavit with these sections in formal legal style, in this exact order:
1. Title block: "AFFIDAVIT"${formatting.titleCase ? ' (all caps)' : ''} (centered, ${formatting.headingBold ? 'bold, ' : ''}${formatting.titleFontSize}pt, ${formatting.fontFamily})
2. Affiant's details block (left-aligned, ${formatting.bodyFontSize}pt, e.g., "I, [Name], of legal age...")
3. Body statements blocks (multiple blocks: use numbered paragraphs with listFormat, justified, ${formatting.bodyFontSize}pt, line spacing ${formatting.lineSpacing}; one block per statement if needed)
4. Jurat block (sworn statement, left-aligned, ${formatting.bodyFontSize}pt, e.g., "SUBSCRIBED AND SWORN to before me...")
5. Signature and notary section block: Underline for signatures, placeholders for notary seal (left-aligned, ${formatting.bodyFontSize}pt; use separate inlines for bold labels like "Affiant:")

Apply spacing: before ${formatting.beforeSpacing}pt, after ${formatting.afterSpacing}pt for paragraphs.
Use formal language with phrases like "I, [Name], do solemnly swear...".
Use the user prompt to fill in specific details like affiant's name, facts, jurisdiction, etc., placing facts only in body statements.
Include a footer with page numbers.
Ensure no misplaced content: e.g., jurat after body, not before.
`;
      break;

    case "contract":
      specificInstructions = `
Generate a Contract with these sections in formal legal style, in this exact order:
1. Title block: "CONTRACT AGREEMENT"${formatting.titleCase ? ' (all caps)' : ''} (centered, ${formatting.headingBold ? 'bold, ' : ''}${formatting.titleFontSize}pt, ${formatting.fontFamily})
2. Parties involved block (left-aligned, ${formatting.bodyFontSize}pt, e.g., "BETWEEN [Party1] AND [Party2]"; bold "Parties:" if needed)
3. Recitals blocks (justified, ${formatting.bodyFontSize}pt, starting with "WHEREAS..."; use multiple blocks for multiple recitals)
4. Terms and conditions blocks (multiple: numbered clauses using listFormat, justified, ${formatting.bodyFontSize}pt, line spacing ${formatting.lineSpacing}; use tables for schedules if needed, placing them as separate blocks)
5. Governing law and dispute resolution block (justified, ${formatting.bodyFontSize}pt)
6. Signature section block: Date lines, underlines for signatures, witness placeholders (left-aligned, ${formatting.bodyFontSize}pt; use inlines for bold "Signed:" etc.)

Apply spacing: before ${formatting.beforeSpacing}pt, after ${formatting.afterSpacing}pt for paragraphs.
Use formal boilerplate language like "NOW THEREFORE, in consideration of...".
Use the user prompt to fill in specific details like parties' names, terms, duration, etc., placing terms only in conditions blocks.
Add headers with "CONTRACT - Page" and footers with page fields.
Ensure no misplaced content: e.g., signatures at the end, not interspersed.
`;
      break;

    case "authorization_letter":
      specificInstructions = `
Generate an Authorization Letter with these sections in formal legal style, in this exact order:
1. Title block: "AUTHORIZATION LETTER"${formatting.titleCase ? ' (all caps)' : ''} (centered, ${formatting.headingBold ? 'bold, ' : ''}${formatting.titleFontSize}pt, ${formatting.fontFamily})
2. Sender's details and date block (right-aligned for business letter style, ${formatting.bodyFontSize}pt; use separate lines/ inlines)
3. Recipient's address block (left-aligned, ${formatting.bodyFontSize}pt)
4. Salutation block (left-aligned, ${formatting.bodyFontSize}pt, e.g., "Dear [Recipient],")
5. Body blocks: Authorization statement (justified, ${formatting.bodyFontSize}pt, line spacing ${formatting.lineSpacing}, e.g., "I hereby authorize..."; use multiple blocks if multi-paragraph)
6. Closing and signature block: "Sincerely," followed by underline for signature and name (left-aligned, ${formatting.bodyFontSize}pt; bold closing if appropriate)

Apply spacing: before ${formatting.beforeSpacing}pt, after ${formatting.afterSpacing}pt for paragraphs; single spacing for address blocks (lineSpacing 1).
Use formal language like "This letter serves to authorize [Name] to act on my behalf in...".
Use the user prompt to fill in specific details like authorizer, authorizee, scope, etc., placing scope in body only.
Ensure no misplaced content: e.g., signature after body, not before salutation.
`;
      break;

    // Add more cases as needed for other docTypes

    default:
      // Fallback to the generic instructions defined above
      break;
  }

  return `
Create a legal document in SFDT (Syncfusion Document Format) JSON format.

CRITICAL FORMATTING RULES:
- NEVER create nested "blocks" arrays inside blocks
- Each block must only contain "paragraphFormat" and "inlines" (or "rows" for tables, etc.)
- Use proper spacing with beforeSpacing and afterSpacing as specified
- All text must be in "inlines" array within each block; use multiple inlines for mixed formatting (e.g., separate inline for bold heading text, then non-bold content)
- Use ${formatting.fontFamily} font family for all text
- Standard margins: 72 points (1 inch) on all sides
- For legal design: Use "allCaps": true for titles if specified; "underline": "Single" for signature lines or emphasis; "listFormat" for numbered/ bulleted lists (e.g., {"listId": 0, "listLevelNumber": 0, "restartLevel": true})
- Add "header" and "footer" in sectionFormat for professional look (e.g., confidential notice in header, page numbers in footer using fields: fieldType 0 for begin, 1 for separator, 2 for end)
- If tables are needed, use block type with "tableFormat" (e.g., borders: {"all": {"lineWidth": 0.5}}, cell padding) and "rows" array containing "cells" with their own blocks/inlines; place table content correctly in cells
- Ensure paragraphs are concise; avoid long run-on sentences for readability
- To prevent misplaced content: Assign each logical section to a distinct block; do not combine unrelated content; follow the exact section order; if content from user prompt doesn't fit a section, adapt but do not force into wrong place

${specificInstructions}

User Requirements: ${userPrompt}

EXAMPLE STRUCTURE (DO NOT DEVIATE FROM THIS PATTERN, BUT EXPAND BLOCKS, ADD HEADERS/FOOTERS, LISTS, TABLES AS NEEDED):
${baseStructureExample}

Generate ONLY the JSON structure, no explanations or markdown formatting.
Ensure the JSON is valid and follows the exact SFDT format shown above, enhanced for formal legal design with proper bold headings and content placement.
`;
}