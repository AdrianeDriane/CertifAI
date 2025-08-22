export const extractTextFromSfdt = (sfdt: any): string => {
  try {
    const sfdtObj = typeof sfdt === "string" ? JSON.parse(sfdt) : sfdt;

    // Recursive function to extract text from SFDT structure
    const extractText = (obj: any): string => {
      let text = "";

      // Handle direct text content
      if (typeof obj === "string") {
        return obj;
      }

      // Handle text link property (tlp) - this is where the actual text is stored
      if (obj.tlp) {
        text += obj.tlp + " ";
      }

      // Handle sections array (sec)
      if (obj.sec && Array.isArray(obj.sec)) {
        obj.sec.forEach((section: any) => {
          text += extractText(section);
        });
      }

      // Handle blocks array (b)
      if (obj.b && Array.isArray(obj.b)) {
        obj.b.forEach((block: any) => {
          text += extractText(block);
        });
      }

      // Handle inlines array (i)
      if (obj.i && Array.isArray(obj.i)) {
        obj.i.forEach((inline: any) => {
          text += extractText(inline);
        });
      }

      // Handle children array (fallback)
      if (obj.children && Array.isArray(obj.children)) {
        obj.children.forEach((child: any) => {
          text += extractText(child);
        });
      }

      // Handle other possible arrays
      if (obj.blocks && Array.isArray(obj.blocks)) {
        obj.blocks.forEach((block: any) => {
          text += extractText(block);
        });
      }

      if (obj.sections && Array.isArray(obj.sections)) {
        obj.sections.forEach((section: any) => {
          text += extractText(section);
        });
      }

      if (obj.inlines && Array.isArray(obj.inlines)) {
        obj.inlines.forEach((inline: any) => {
          text += extractText(inline);
        });
      }

      return text;
    };

    const extractedText = extractText(sfdtObj).trim();

    // Clean up extra whitespace
    const cleanedText = extractedText.replace(/\s+/g, " ").trim();

    console.log("Extracted text length:", cleanedText.length);
    console.log("First 200 chars:", cleanedText.substring(0, 200));

    return cleanedText;
  } catch (error) {
    console.error("Error extracting text from SFDT:", error);
    return "";
  }
};
