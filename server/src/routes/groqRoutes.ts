import express from "express";
import { generateDocument } from "../controllers/groqControllers";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

<<<<<<< HEAD
// Fallback document generator for when Groq fails
function generateFallbackDocument(docType: string, userPrompt: string) {
  const title = docType === 'certificate_of_employment' ? 'CERTIFICATE OF EMPLOYMENT' : 
                docType.toUpperCase().replace(/_/g, ' ');
  
  return {
    sections: [
      {
        sectionFormat: {
          pageSetup: {
            topMargin: 72,
            bottomMargin: 72,
            leftMargin: 72,
            rightMargin: 72
          }
        },
        blocks: [
          // Document Title
          {
            paragraphFormat: {
              textAlignment: "Center",
              beforeSpacing: 12,
              afterSpacing: 24,
              lineSpacing: 1.5,
              lineSpacingType: "Multiple"
            },
            inlines: [
              {
                text: title,
                characterFormat: {
                  bold: true,
                  fontSize: 16,
                  fontFamily: "Times New Roman"
                }
              }
            ]
          },
          // Greeting
          {
            paragraphFormat: {
              textAlignment: "Left",
              beforeSpacing: 24,
              afterSpacing: 18,
              lineSpacing: 1.5,
              lineSpacingType: "Multiple"
            },
            inlines: [
              {
                text: "TO WHOM IT MAY CONCERN:",
                characterFormat: {
                  bold: true,
                  fontSize: 12,
                  fontFamily: "Times New Roman"
                }
              }
            ]
          },
          // Main Content
          {
            paragraphFormat: {
              textAlignment: "Justify",
              beforeSpacing: 18,
              afterSpacing: 18,
              lineSpacing: 1.5,
              lineSpacingType: "Multiple"
            },
            inlines: [
              {
                text: `This is to certify that [Employee Name] has been employed with [Company Name] as [Position] from [Start Date] to [End Date/Present].`,
                characterFormat: {
                  bold: false,
                  fontSize: 12,
                  fontFamily: "Times New Roman"
                }
              }
            ]
          },
          // Additional Info
          {
            paragraphFormat: {
              textAlignment: "Justify",
              beforeSpacing: 18,
              afterSpacing: 18,
              lineSpacing: 1.5,
              lineSpacingType: "Multiple"
            },
            inlines: [
              {
                text: "During their employment, they demonstrated professionalism and dedication to their assigned responsibilities.",
                characterFormat: {
                  bold: false,
                  fontSize: 12,
                  fontFamily: "Times New Roman"
                }
              }
            ]
          },
          // Purpose
          {
            paragraphFormat: {
              textAlignment: "Justify",
              beforeSpacing: 18,
              afterSpacing: 24,
              lineSpacing: 1.5,
              lineSpacingType: "Multiple"
            },
            inlines: [
              {
                text: "This certification is issued for whatever legal purpose it may serve.",
                characterFormat: {
                  bold: false,
                  fontSize: 12,
                  fontFamily: "Times New Roman"
                }
              }
            ]
          },
          // Location and Date
          {
            paragraphFormat: {
              textAlignment: "Left",
              beforeSpacing: 24,
              afterSpacing: 18,
              lineSpacing: 1.5,
              lineSpacingType: "Multiple"
            },
            inlines: [
              {
                text: "Manila, Philippines",
                characterFormat: {
                  bold: false,
                  fontSize: 12,
                  fontFamily: "Times New Roman"
                }
              }
            ]
          },
          {
            paragraphFormat: {
              textAlignment: "Left",
              beforeSpacing: 6,
              afterSpacing: 36,
              lineSpacing: 1.5,
              lineSpacingType: "Multiple"
            },
            inlines: [
              {
                text: `${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
                characterFormat: {
                  bold: false,
                  fontSize: 12,
                  fontFamily: "Times New Roman"
                }
              }
            ]
          },
          // Signature Line
          {
            paragraphFormat: {
              textAlignment: "Left",
              beforeSpacing: 36,
              afterSpacing: 6,
              lineSpacing: 1.5,
              lineSpacingType: "Multiple"
            },
            inlines: [
              {
                text: "_____________________________",
                characterFormat: {
                  bold: false,
                  fontSize: 12,
                  fontFamily: "Times New Roman"
                }
              }
            ]
          },
          // Signature Label
          {
            paragraphFormat: {
              textAlignment: "Left",
              beforeSpacing: 0,
              afterSpacing: 6,
              lineSpacing: 1.5,
              lineSpacingType: "Multiple"
            },
            inlines: [
              {
                text: "[Authorized Signatory]",
                characterFormat: {
                  bold: false,
                  fontSize: 11,
                  fontFamily: "Times New Roman"
                }
              }
            ]
          },
          // Title
          {
            paragraphFormat: {
              textAlignment: "Left",
              beforeSpacing: 0,
              afterSpacing: 12,
              lineSpacing: 1.5,
              lineSpacingType: "Multiple"
            },
            inlines: [
              {
                text: "[Title/Position]",
                characterFormat: {
                  bold: false,
                  fontSize: 11,
                  fontFamily: "Times New Roman"
                }
              }
            ]
          }
        ]
      }
    ]
  };
}

router.post('/', async (req: Request, res: Response) => {
  const { docType, userPrompt } = req.body;

  // Validate input
  if (!docType || typeof docType !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing or invalid docType parameter' 
    });
  }

  if (!userPrompt || typeof userPrompt !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing or invalid userPrompt parameter' 
    });
  }

  if (userPrompt.length > 1000) {
    return res.status(400).json({ 
      success: false, 
      error: 'User prompt too long. Maximum 1000 characters allowed.' 
    });
  }

  try {
    console.log(`Generating document: ${docType}`);
    console.log(`User prompt: ${userPrompt.substring(0, 100)}...`);

    const document = await getGroqResponse(docType, userPrompt);
    
    console.log('Document generated successfully');
    res.json({ 
      success: true, 
      document,
      source: 'groq'
    });

  } catch (error: any) {
    console.error('Primary generation failed:', error.message);
    
    // Use fallback document generation
    try {
      const fallbackDocument = generateFallbackDocument(docType, userPrompt);
      console.log('Using fallback document generator');
      
      res.json({ 
        success: true, 
        document: fallbackDocument,
        source: 'fallback',
        warning: 'Generated using fallback due to AI service unavailability'
      });
    } catch (fallbackError: any) {
      console.error('Fallback generation failed:', fallbackError.message);
      
      res.status(500).json({ 
        success: false, 
        error: 'Document generation failed',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
});
=======
router.post("/", authenticate, generateDocument);
>>>>>>> b179dc0f36a9337bcd6e8ad008c78e030e637cc7

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    service: 'groq',
    timestamp: new Date().toISOString()
  });
});

export default router;