import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getGroqResponse(docType: string, userPrompt: string): Promise<string> {
  const fullPrompt = `
You are **Certifai**, a legal AI assistant that generates structured legal documents for professionals, MSMEs, individuals, and government use in the Philippines.

=========================
📤 TASK
=========================
Generate a legally formatted document in **valid SFDT JSON format** (Syncfusion Document Text) based on the document type and user prompt.

=========================
📄 OUTPUT FORMAT
=========================
Return ONLY valid, compact JSON with the following structure:

{
  "sections": [
    {
      "blocks": [
        {
          "paragraphFormat": { "styleName": "Heading 1" },
          "inlines": [
            { "text": "[Document Title]", "characterFormat": { "bold": true } }
          ]
        },
        {
          "inlines": [
            { "text": "[Preamble or introduction paragraph]" }
          ]
        },
        {
          "paragraphFormat": { "styleName": "Heading 2" },
          "inlines": [
            { "text": "[Section Title]" }
          ]
        },
        {
          "inlines": [
            { "text": "[Section content using placeholders like [Client Name], [Date], [Amount], etc.]" }
          ]
        },
        {
          "inlines": [
            { "text": "IN WITNESS WHEREOF, the parties have executed this document on [Date]." }
          ]
        },
        {
          "inlines": [
            { "text": "[Party A Name] _____________________" }
          ]
        },
        {
          "inlines": [
            { "text": "[Party B Name] _____________________" }
          ]
        }
      ]
    }
  ]
}

=========================
🧠 RULES
=========================
- Maintain a professional, legal tone.
- DO NOT include Markdown, comments, or explanations.
- Adapt to any document type: agreement, contract, certificate, affidavit, etc.
- Follow proper Philippine legal formatting conventions.
- Ensure the output is valid, minimal JSON for Syncfusion Word Processor (SFDT).

=========================
📥 USER INPUT
=========================
Document Type: ${docType}
Request: ${userPrompt}
`;

  const response = await groq.chat.completions.create({
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    messages: [
      {
        role: 'system',
        content: 'You generate legal documents in SFDT JSON format only. Respond with valid JSON only.'
      },
      {
        role: 'user',
        content: fullPrompt
      }
    ],
    temperature: 0.5,
    max_tokens: 2048,
  });

  return response.choices[0]?.message?.content?.trim() || '';
}
