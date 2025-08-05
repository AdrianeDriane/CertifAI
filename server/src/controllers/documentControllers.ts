import { RequestHandler, Response } from 'express';
import DocumentModel from '../models/Document';
import { IAuthenticatedRequest } from '../types/IAuthenticatedRequest';

export const createNewDocument: RequestHandler = async (req, res) => {
  try {
    const authReq = req as IAuthenticatedRequest;
    const { title, sfdt } = authReq.body;
    const userId = authReq.user.id;

    const initialVersion = {
      version: 1,
      action: 'uploaded',
      sfdt,
      hash: 'test', // generate hash in next steps
      blockchainTxHash: 'test', //dummy
      createdAt: new Date(),
      modifiedBy: userId,
    };

    // Create the document
    const newDoc = new DocumentModel({
      title,
      createdBy: userId,
      currentVersion: 1,
      status: 'draft',
      visibility: 'private',
      versions: [initialVersion],
    });

    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Document upload failed' });
  }
};
