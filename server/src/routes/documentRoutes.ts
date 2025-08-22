import express from "express";
import {
  createNewDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
  modifyDocumentVisibility,
  addEditorByEmail,
  archiveDocument,
  compareDocuments,
} from "../controllers/documentControllers";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createNewDocument);
router.get("/", authenticate, getDocuments);
router.put(
  "/modify-visibility/:document_id",
  authenticate,
  modifyDocumentVisibility
);
router.put("/archive-document/:document_id", authenticate, archiveDocument);
router.post("/compare/:document_id", authenticate, compareDocuments);
router.get("/:document_id", authenticate, getDocumentById);
router.put("/:document_id", authenticate, updateDocument);
router.post(
  "/:document_id/add-editor-by-email",
  authenticate,
  addEditorByEmail
);

export default router;
