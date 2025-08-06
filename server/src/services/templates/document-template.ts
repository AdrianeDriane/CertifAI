// document-templates.ts
interface DocumentTemplate {
  title: string;
  blocks: Array<{
    text: string;
    alignment: 'Center' | 'Left' | 'Right' | 'Justify';
    bold?: boolean;
    fontSize?: number;
    beforeSpacing?: number;
    afterSpacing?: number;
  }>;
}

export const documentTemplates: Record<string, DocumentTemplate> = {
  certificate_of_employment: {
    title: 'CERTIFICATE OF EMPLOYMENT',
    blocks: [
      {
        text: 'CERTIFICATE OF EMPLOYMENT',
        alignment: 'Center',
        bold: true,
        fontSize: 16,
        beforeSpacing: 12,
        afterSpacing: 24
      },
      {
        text: 'TO WHOM IT MAY CONCERN:',
        alignment: 'Left',
        bold: true,
        fontSize: 12,
        beforeSpacing: 24,
        afterSpacing: 18
      },
      {
        text: 'This is to certify that [EMPLOYEE_NAME] has been employed with [COMPANY_NAME] as [POSITION] from [START_DATE] to [END_DATE].',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 18,
        afterSpacing: 18
      },
      {
        text: 'During the tenure of employment, [he/she] has shown dedication, professionalism, and competence in the performance of [his/her] duties and responsibilities.',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 18,
        afterSpacing: 18
      },
      {
        text: 'This certification is issued upon the request of [EMPLOYEE_NAME] for whatever legal purpose it may serve.',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 18,
        afterSpacing: 24
      },
      {
        text: '[CITY], Philippines',
        alignment: 'Left',
        fontSize: 12,
        beforeSpacing: 24,
        afterSpacing: 6
      },
      {
        text: '[DATE]',
        alignment: 'Left',
        fontSize: 12,
        beforeSpacing: 6,
        afterSpacing: 36
      },
      {
        text: '_____________________________',
        alignment: 'Left',
        fontSize: 12,
        beforeSpacing: 36,
        afterSpacing: 6
      },
      {
        text: '[AUTHORIZED_SIGNATORY]',
        alignment: 'Left',
        fontSize: 11,
        beforeSpacing: 0,
        afterSpacing: 6
      },
      {
        text: '[TITLE/POSITION]',
        alignment: 'Left',
        fontSize: 11,
        beforeSpacing: 0,
        afterSpacing: 12
      }
    ]
  },

  affidavit: {
    title: 'AFFIDAVIT',
    blocks: [
      {
        text: 'AFFIDAVIT',
        alignment: 'Center',
        bold: true,
        fontSize: 16,
        beforeSpacing: 12,
        afterSpacing: 24
      },
      {
        text: 'REPUBLIC OF THE PHILIPPINES',
        alignment: 'Left',
        bold: true,
        fontSize: 12,
        beforeSpacing: 24,
        afterSpacing: 6
      },
      {
        text: '[CITY/MUNICIPALITY] )',
        alignment: 'Left',
        fontSize: 12,
        beforeSpacing: 0,
        afterSpacing: 6
      },
      {
        text: '                              ) S.S.',
        alignment: 'Left',
        fontSize: 12,
        beforeSpacing: 0,
        afterSpacing: 18
      },
      {
        text: 'I, [AFFIANT_NAME], of legal age, [CIVIL_STATUS], [NATIONALITY], and a resident of [ADDRESS], after having been duly sworn to in accordance with law, do hereby depose and state:',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 18,
        afterSpacing: 18
      },
      {
        text: '1. [STATEMENT_1]',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 12,
        afterSpacing: 12
      },
      {
        text: '2. [STATEMENT_2]',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 12,
        afterSpacing: 12
      },
      {
        text: '3. I am executing this affidavit to attest to the truthfulness of the foregoing statements and for whatever legal purpose this may serve.',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 12,
        afterSpacing: 24
      },
      {
        text: 'IN WITNESS WHEREOF, I have hereunto set my hand this [DATE] at [CITY], Philippines.',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 24,
        afterSpacing: 36
      },
      {
        text: '_____________________________',
        alignment: 'Left',
        fontSize: 12,
        beforeSpacing: 36,
        afterSpacing: 6
      },
      {
        text: '[AFFIANT_NAME]',
        alignment: 'Left',
        fontSize: 11,
        beforeSpacing: 0,
        afterSpacing: 24
      },
      {
        text: 'SUBSCRIBED AND SWORN TO before me this [DATE] at [CITY], Philippines, by the above-named affiant who exhibited to me [his/her] valid government-issued ID.',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 24,
        afterSpacing: 36
      },
      {
        text: '_____________________________',
        alignment: 'Left',
        fontSize: 12,
        beforeSpacing: 36,
        afterSpacing: 6
      },
      {
        text: 'NOTARY PUBLIC',
        alignment: 'Left',
        fontSize: 11,
        beforeSpacing: 0,
        afterSpacing: 12
      }
    ]
  },

  contract_agreement: {
    title: 'CONTRACT AGREEMENT',
    blocks: [
      {
        text: 'CONTRACT AGREEMENT',
        alignment: 'Center',
        bold: true,
        fontSize: 16,
        beforeSpacing: 12,
        afterSpacing: 24
      },
      {
        text: 'This Contract Agreement is entered into this [DATE] between [PARTY_1_NAME], of legal age, and a resident of [PARTY_1_ADDRESS] (hereinafter referred to as "First Party"), and [PARTY_2_NAME], of legal age, and a resident of [PARTY_2_ADDRESS] (hereinafter referred to as "Second Party").',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 24,
        afterSpacing: 18
      },
      {
        text: 'WITNESSETH:',
        alignment: 'Center',
        bold: true,
        fontSize: 12,
        beforeSpacing: 18,
        afterSpacing: 18
      },
      {
        text: 'WHEREAS, [WHEREAS_CLAUSE_1];',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 12,
        afterSpacing: 12
      },
      {
        text: 'WHEREAS, [WHEREAS_CLAUSE_2];',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 12,
        afterSpacing: 18
      },
      {
        text: 'NOW, THEREFORE, for and in consideration of the mutual covenants and agreements hereinafter set forth, the parties agree as follows:',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 18,
        afterSpacing: 18
      },
      {
        text: '1. [TERM_1]',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 12,
        afterSpacing: 12
      },
      {
        text: '2. [TERM_2]',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 12,
        afterSpacing: 12
      },
      {
        text: '3. [TERM_3]',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 12,
        afterSpacing: 24
      },
      {
        text: 'IN WITNESS WHEREOF, the parties have executed this Contract Agreement on the date and place first above written.',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 24,
        afterSpacing: 36
      },
      {
        text: '[PARTY_1_NAME]                    [PARTY_2_NAME]',
        alignment: 'Justify',
        fontSize: 12,
        beforeSpacing: 36,
        afterSpacing: 6
      },
      {
        text: 'First Party                           Second Party',
        alignment: 'Justify',
        fontSize: 11,
        beforeSpacing: 0,
        afterSpacing: 24
      }
    ]
  }
};

export function generateDocumentFromTemplate(
  docType: string, 
  userPrompt: string,
  replacements: Record<string, string> = {}
): any {
  const template = documentTemplates[docType];
  
  if (!template) {
    throw new Error(`Template not found for document type: ${docType}`);
  }

  // Default replacements based on current date and common placeholders
  const defaultReplacements: Record<string, string> = {
    '[DATE]': new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    '[CITY]': 'Manila',
    '[EMPLOYEE_NAME]': '[Please fill in employee name]',
    '[COMPANY_NAME]': '[Please fill in company name]',
    '[POSITION]': '[Please fill in position]',
    '[START_DATE]': '[Please fill in start date]',
    '[END_DATE]': '[Please fill in end date or "present"]',
    ...replacements
  };

  const blocks = template.blocks.map(block => ({
    paragraphFormat: {
      textAlignment: block.alignment,
      beforeSpacing: block.beforeSpacing || 12,
      afterSpacing: block.afterSpacing || 12,
      lineSpacing: 1.5,
      lineSpacingType: "Multiple"
    },
    inlines: [
      {
        text: Object.keys(defaultReplacements).reduce(
          (text, placeholder) => text.replace(new RegExp(placeholder.replace(/[[\]]/g, '\\$&'), 'g'), defaultReplacements[placeholder]),
          block.text
        ),
        characterFormat: {
          bold: block.bold || false,
          fontSize: block.fontSize || 12,
          fontFamily: "Times New Roman"
        }
      }
    ]
  }));

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
        blocks
      }
    ]
  };
}