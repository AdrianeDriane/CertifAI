import { RequestHandler } from "express";
import DocumentModel from "../models/Document";
import { IAuthenticatedRequest } from "../types/IAuthenticatedRequest";
import User from "../models/User";
import mongoose from "mongoose";
import { hashSfdt } from "../utils/hash";
import { readTxDataAsString, storeHashOnPolygon } from "../utils/blockchain";

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
    const { document_id } = req.params;

    const document = await DocumentModel.findById(document_id);

    if (!document) {
      res.status(404).json({ message: "Document not found." });
      return;
    }

    res.status(200).json(document);
  } catch (error) {
    console.error("Error fetching document: ", error);
    res.status(500).json({ message: "Error fetching document", error });
  }
};

export const updateDocument: RequestHandler = async (req, res) => {
  try {
    const user = req.user as { id: string };
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
    };

    document.versions.push(newVersion);
    document.currentVersion = newVersion.version;
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

// TODO: Use this with the newly added featrue Document Verification in MVP
export const verifyDocumentVersion: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params as { id: string }; // safe cast
    const { version } = req.query as { version?: string };

    const doc = await DocumentModel.findById(id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    const verNum = Number(version ?? doc.currentVersion);
    const versionEntry = doc.versions.find((v) => v.version === verNum);
    if (!versionEntry)
      return res.status(404).json({ error: "Version not found" });

    const localHash = hashSfdt(versionEntry.sfdt);
    const onChainDataStr = await readTxDataAsString(
      versionEntry.blockchainTxHash
    );

    res.json({
      documentId: id,
      version: verNum,
      localHash,
      onChainHashInTxData: onChainDataStr,
      matches: localHash === onChainDataStr,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Verification failed" });
  }
};
