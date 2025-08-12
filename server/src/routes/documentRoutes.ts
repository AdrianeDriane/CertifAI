import express from "express";
import {
  createNewDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../controllers/documentControllers";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createNewDocument);
router.get("/", authenticate, getDocuments);
router.get("/:document_id", authenticate, getDocumentById);
router.put("/:document_id", authenticate, updateDocument);

export default router;
