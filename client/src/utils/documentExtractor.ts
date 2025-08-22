export const extractTextFromSFDT = (sfdtContent: any): string => {
  try {
    let sfdt;
    if (typeof sfdtContent === "string") {
      sfdt = JSON.parse(sfdtContent);
    } else {
      sfdt = sfdtContent;
    }

    const extractTextFromSections = (sections: any[]): string => {
      let text = "";

      sections.forEach((section) => {
        if (section.blocks) {
          section.blocks.forEach((block: any) => {
            if (block.inlines) {
              block.inlines.forEach((inline: any) => {
                if (inline.text) {
                  text += inline.text;
                }
              });
              text += "\n";
            }
          });
        }
      });

      return text;
    };

    if (sfdt.sections) {
      return extractTextFromSections(sfdt.sections);
    }

    return "";
  } catch (error) {
    console.error("Error extracting text from SFDT:", error);
    return "";
  }
};

export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;

      // Handle different file types
      if (file.type === "text/plain") {
        resolve(content);
      } else if (file.type.includes("json")) {
        // Assuming SFDT JSON files
        try {
          const sfdtContent = JSON.parse(content);
          const extractedText = extractTextFromSFDT(sfdtContent);
          resolve(extractedText);
        } catch {
          reject(new Error("Invalid JSON file"));
        }
      } else if (
        file.name.endsWith(".docx") ||
        file.type.includes("wordprocessingml")
      ) {
        // For DOCX files, you might want to handle this differently
        // For now, we'll treat it as text
        resolve(content);
      } else {
        // For other file types
        resolve(content);
      }
    };

    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsText(file);
  });
};
