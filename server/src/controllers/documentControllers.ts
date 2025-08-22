import { RequestHandler } from "express";
import DocumentModel from "../models/Document";
import { IAuthenticatedRequest } from "../types/IAuthenticatedRequest";
import User from "../models/User";
import mongoose, { Types } from "mongoose";
import { hashSfdt } from "../utils/hash";
import { readTxDataAsString, storeHashOnPolygon } from "../utils/blockchain";
import { groq } from "../services/groqService";
import { extractTextFromSfdt } from "../utils/documentExtractors";

export const createNewDocument: RequestHandler = async (req, res) => {
  try {
    const authReq = req as IAuthenticatedRequest;
    if (!authReq.user || !authReq.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, sfdt } = authReq.body;
    const userId = authReq.user.id;

    // Generate document hash
    const hash = hashSfdt(sfdt);

    // Send hash to Polygon Amoy blockchain
    const blockchainTxHash = await storeHashOnPolygon(hash);

    const initialVersion = {
      version: 1,
      action: "uploaded",
      sfdt,
      hash,
      blockchainTxHash,
      createdAt: new Date(),
      modifiedBy: userId,
    };

    const newDoc = new DocumentModel({
      title,
      createdBy: userId,
      currentVersion: 1,
      status: "draft",
      visibility: "private",
      versions: [initialVersion],
    });

    await newDoc.save();

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { documents: newDoc._id } },
      { new: true, runValidators: true }
    );

    res.status(201).json(newDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Document upload failed" });
  }
};

export const getDocuments: RequestHandler = async (req, res) => {
  try {
    const user = req.user as { id: string };

    if (!user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userDocuments = await User.findById(user.id).select("documents");
    const documentIds = userDocuments?.documents ?? [];

    const documents = await DocumentModel.find({
      _id: { $in: documentIds },
    });

    res.status(200).json({ documents });
  } catch (error) {
    console.error("Error fetching documents: ", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getDocumentById: RequestHandler = async (req, res) => {
  try {
    const user = req.user as { id: string };
    const { document_id } = req.params;

    const document = await DocumentModel.findById(document_id);

    if (!document) {
      res.status(404).json({ message: "Document not found." });
      return;
    }

    if (document.visibility === "public") {
      res.status(200).json(document);
      return;
    }

    const isUserEditor =
      document.createdBy.equals(user.id) ||
      document.editors.some((editorId) => editorId.equals(user.id));

    if (!isUserEditor) {
      res
        .status(403)
        .json({ message: "User is not authorized to view document." });
      return;
    }

    res.status(200).json(document);
    return;
  } catch (error) {
    console.error("Error fetching document: ", error);
    res.status(500).json({ message: "Error fetching document", error });
  }
};

export const updateDocument: RequestHandler = async (req, res) => {
  try {
    const user = req.user as { id: string; email: string };
    const { document_id } = req.params;
    const { sfdt, action = "edited" } = req.body;

    const modifiedBy = user.id;

    if (!sfdt) {
      return res.status(400).json({ message: "Missing sfdt in request body." });
    }

    const document = await DocumentModel.findById(document_id);
    if (!document) {
      return res
        .status(404)
        .json({ message: "Document to update is not found." });
    }

    const isUserEditor =
      document.createdBy.equals(user.id) ||
      document.editors.some((editorId) => editorId.equals(user.id));

    if (!isUserEditor) {
      res
        .status(403)
        .json({ message: "User is not authorized to edit document." });
      return;
    }

    if (document.status === "locked") {
      res.status(423).json({
        message: "Document is locked. Cannot modify.",
      });
      return;
    }

    // Find latest version
    const latestVersion = document.versions.reduce((prev, curr) =>
      curr.version > prev.version ? curr : prev
    );

    // Compare with previous version
    let noChanges = false;
    try {
      const latestSfdtJSON = JSON.parse(latestVersion.sfdt);
      const newSfdtJSON = JSON.parse(sfdt);
      noChanges =
        JSON.stringify(latestSfdtJSON) === JSON.stringify(newSfdtJSON);
    } catch {
      noChanges = latestVersion.sfdt === sfdt;
    }

    if (noChanges) {
      return res.status(200).json({
        message: "No changes detected. Document not updated.",
        document,
      });
    }

    // Generate new hash
    const hash = hashSfdt(sfdt);

    // Send new hash to blockchain
    const blockchainTxHash = await storeHashOnPolygon(hash);

    // Create new version entry
    const newVersion = {
      version: latestVersion.version + 1,
      action,
      sfdt,
      hash,
      blockchainTxHash,
      createdAt: new Date(),
      modifiedBy: new mongoose.Types.ObjectId(modifiedBy),
      emailModifiedBy: user.email,
    };

    document.versions.push(newVersion);
    document.currentVersion = newVersion.version;

    if (action === "signed") {
      document.status = "signed";

      if (!document.signedBy.some((email) => email === user.email)) {
        document.signedBy.push(user.email);
      }
    } else if (action === "edited") {
      if (document.status === "signed") {
        document.signedBy = [];
      }
      document.status = "draft";
    }

    await document.save();

    res.status(200).json({
      message: "Document updated successfully.",
      document,
    });
  } catch (error) {
    console.error("Error updating document: ", error);
    res.status(500).json({ message: "Error updating document", error });
  }
};

export const addEditorByEmail: RequestHandler = async (req, res) => {
  try {
    const { document_id } = req.params;
    const { email } = req.body;
    const user = req.user as { id: string };

    if (!email) {
      res.status(400).json({ message: "Email is required." });
      return;
    }

    const document = await DocumentModel.findById(document_id);
    if (!document) {
      res.status(404).json({ message: "Document not found." });
      return;
    }

    // Check if the current user is the creator
    if (!document.createdBy.equals(user.id)) {
      res.status(401).json({
        message: "Only the document creator can add editors.",
      });
      return;
    }

    const editor = await User.findOne({ email: email.toLowerCase() });
    if (!editor) {
      res
        .status(404)
        .json({ message: "No user found with this email address." });
      return;
    }

    // Check if user is already an editor
    if (document.editors.includes(editor._id as Types.ObjectId)) {
      res
        .status(400)
        .json({ message: "User is already an editor of this document." });
      return;
    }

    // Check if user is the creator (can't add creator as editor)
    if (!document.createdBy.equals(new mongoose.Types.ObjectId(user.id))) {
      res
        .status(400)
        .json({ message: "Document creator cannot be added as an editor." });
      return;
    }

    // Add editor to document
    document.editors.push(editor._id as Types.ObjectId);
    editor.documents?.push(new mongoose.Types.ObjectId(document_id));

    await document.save();
    await editor.save();

    // Return the user data for frontend state update
    res.status(200).json({
      message: "Editor added successfully",
      user: {
        _id: editor._id,
        email: editor.email,
        fullName: editor.fullName,
      },
    });
  } catch (error) {
    console.error("Error adding editor by email: ", error);
    res.status(500).json({ message: "Error adding editor to document", error });
  }
};

export const modifyDocumentVisibility: RequestHandler = async (req, res) => {
  try {
    const user = req.user as { id: string };
    const { document_id } = req.params;
    const { visibility } = req.body;

    const document = await DocumentModel.findById(document_id);

    if (!document) {
      res.status(404).json({ message: "Document is not found." });
      return;
    }

    if (!document.createdBy.equals(user.id)) {
      res.status(401).json({
        message: "User is unauthorized to modify document's visibility.",
      });
      return;
    }

    document.visibility = visibility;
    await document.save();

    res.status(200).json({
      message: "Document visibility modified successfully",
      visibility,
    });
    return;
  } catch (error) {
    console.error("Error modifying document's visibility", error);
    res
      .status(500)
      .json({ message: "Error modifying document's visibility", error });
    return;
  }
};

export const archiveDocument: RequestHandler = async (req, res) => {
  try {
    const user = req.user as { id: string };
    const { document_id } = req.params;

    const document = await DocumentModel.findById(document_id);

    if (!document) {
      res.status(404).json({ message: "Document is not found." });
      return;
    }

    if (!document.createdBy.equals(user.id)) {
      res.status(401).json({
        message: "User is unauthorized to lock/archive document.",
      });
      return;
    }

    document.status = "locked";
    await document.save();

    res.status(200).json({
      message: "Document archived successfully",
    });
    return;
  } catch (error) {
    console.error("Error archiving document", error);
    res.status(500).json({ message: "Error archiving document", error });
    return;
  }
};

export const compareDocuments: RequestHandler = async (req, res) => {
  try {
    const authReq = req as IAuthenticatedRequest;
    if (!authReq.user || !authReq.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { document_id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ error: "Content is required in request body" });
    }

    // Find the document
    const document = await DocumentModel.findById(document_id);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Check if user has access to this document
    const isUserAuthorized =
      document.createdBy.equals(authReq.user.id) ||
      document.editors.some((editorId) => editorId.equals(authReq.user.id)) ||
      document.visibility === "public";

    if (!isUserAuthorized) {
      return res
        .status(403)
        .json({ error: "User is not authorized to compare this document" });
    }

    // Get the latest version of the document
    const latestVersion = document.versions.reduce((prev, curr) =>
      curr.version > prev.version ? curr : prev
    );

    // Extract text from the latest version's SFDT
    const existingText = extractTextFromSfdt(latestVersion.sfdt);

    if (!existingText) {
      return res
        .status(400)
        .json({ error: "Unable to extract text from existing document" });
    }

    // Use Groq AI to compare the documents
    const prompt = `
You are a legal document comparison expert. Compare these two contract versions and identify ALL SUBSTANTIVE changes with precision and accuracy. This is for legal contract analysis, so accuracy is critical.

EXISTING DOCUMENT:
${existingText}

NEW DOCUMENT:
${content}

You MUST respond with ONLY a valid JSON object in exactly this format (no additional text before or after):

{
  "hasChanges": 0,
  "summary": "No significant changes detected",
  "changeCount": 0,
  "criticalChanges": []
}

OR if changes are found:

{
  "hasChanges": 1,
  "summary": "A list of all of the changes from the previous value and the after value and where it can be found in string format.",
  "changeCount": 3,
  "criticalChanges": ["Monthly rent amount changed from ₱25,000.00 to ₱30,000.00", "Lease term changed from 6 months to 12 months"]
}

SUBSTANTIVE CHANGES TO DETECT:

FINANCIAL & MONETARY:
- Any change in amounts (rent, deposits, fees, penalties)
- Payment terms, due dates, or schedules
- Interest rates, late fees, or financial penalties

PERSONAL & ENTITY INFORMATION:
- Names of parties (lessor, lessee, witnesses)
- Addresses or contact information
- Legal status or capacity descriptions

TEMPORAL & DURATION:
- Start dates, end dates, or deadlines
- Lease terms or contract duration
- Notice periods or grace periods

PROPERTY & ASSETS:
- Property descriptions or addresses
- Square footage or measurements
- Property conditions or specifications

LEGAL TERMS & CONDITIONS:
- Rights and obligations of parties
- Termination clauses or conditions
- Default provisions and remedies
- Jurisdiction or governing law changes

OPERATIONAL TERMS:
- Use restrictions or permitted activities
- Maintenance responsibilities
- Utility arrangements
- Insurance requirements

ADDITIONS OR REMOVALS:
- New clauses or sections added
- Existing clauses or sections removed
- New requirements or restrictions

For the summary field: List each change with a number (eg. 1., 2., 3., etc,.) showing exactly what changed from what to what and in which section, with a backslash n symbol at the end of each item. Ensure that you are enclosing the text with double quotation marks so that it counts as a string.

For criticalChanges: Include only changes that significantly impact financial obligations, legal rights, or core contract terms.

IGNORE these minor differences:
- Whitespace, line breaks, or spacing
- Font formatting (bold, italic, underline)
- Minor punctuation that doesn't change meaning
- Capitalization that doesn't affect legal meaning
- Minor grammatical corrections
- Spelling corrections that don't change meaning

Return ONLY the JSON object, nothing else.
`;
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192", // You can change this to other available models
      temperature: 0.1, // Low temperature for consistent results
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      return res
        .status(500)
        .json({ error: "Failed to get AI comparison result" });
    }

    let comparisonResult;
    try {
      comparisonResult = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      return res
        .status(500)
        .json({ error: "Failed to parse AI comparison result" });
    }

    // Validate the response structure
    if (
      typeof comparisonResult.hasChanges !== "number" ||
      (comparisonResult.hasChanges !== 0 &&
        comparisonResult.hasChanges !== 1) ||
      typeof comparisonResult.summary !== "string"
    ) {
      return res
        .status(500)
        .json({ error: "Invalid AI comparison result format" });
    }

    // Return the comparison result
    res.status(200).json({
      documentId: document_id,
      currentVersion: latestVersion.version,
      hasChanges: comparisonResult.hasChanges,
      summary: comparisonResult.summary,
      comparedAt: new Date(),
    });
  } catch (error) {
    console.error("Error comparing documents:", error);

    // Handle specific Groq API errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return res
          .status(500)
          .json({ error: "AI service configuration error" });
      }
      if (error.message.includes("rate limit")) {
        return res.status(429).json({
          error: "AI service rate limit exceeded. Please try again later.",
        });
      }
    }

    res.status(500).json({ error: "Document comparison failed" });
  }
};
