import express from "express";
import {
  createNewDocument,
  getDocumentById,
  getDocuments,
} from "../controllers/documentControllers";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createNewDocument);
router.get("/", authenticate, getDocuments);
router.get("/:document_id", authenticate, getDocumentById);

export default router;
