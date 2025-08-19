export interface LegalDocumentJSON {
  metadata?: {
    titleFontSize?: number;
    bodyFontSize?: number;
    titleAlignment?: "Left"|"Center"|"Right";
    lineSpacing?: number;
    beforeSpacing?: number;
    afterSpacing?: number;
    paragraphSpacing?: number;
  };
  title: string;
  date: string;
  location: string;
  parties?: Party[];
  recitals?: string;
  definitions?: Definition[];
  body?: string;
  sections?: Section[];
  clauses?: Clause[];
  references?: Reference[];
  signatures?: Signature[];
  notary?: Notary;
  attachments?: Attachment[];
  annexes?: Annex[];
}

export interface Party { name: string; role: string; age?: number; civilStatus?: string; address?: string; representative?: string; contact?: string; }
export interface Definition { term: string; definition: string; }
export interface Section { heading: string; content: string; }
export interface Clause { number: string; title: string; content: string; conditions?: {condition: string; effect: string;}[]; }
export interface Reference { law: string; section: string; description: string; }
export interface Signature { name: string; role: string; date: string; witness?: string; }
export interface Notary { name: string; commissionNumber: string; date: string; }
export interface Attachment { title: string; description: string; type?: string; }
export interface Annex { title: string; content: string; }

// SFDT types
export interface SFDTDocument { sections: SFDTSection[]; }
export interface SFDTSection { blocks: SFDTBlock[]; pageSetup?: { orientation?: "Portrait" | "Landscape"; pageWidth?: number; pageHeight?: number; margins?: { top: number; bottom: number; left: number; right: number; }; }; }
export interface SFDTBlock { paragraphFormat?: ParagraphFormat; characterFormat?: CharacterFormat; inlines: SFDTInline[]; }
export interface ParagraphFormat { alignment?: "Left"|"Right"|"Center"|"Justify"; lineSpacing?: number; beforeSpacing?: number; afterSpacing?: number; }
export interface CharacterFormat { bold?: boolean; italic?: boolean; fontSize?: number; fontFamily?: string; }
export interface SFDTInline { text: string; }
