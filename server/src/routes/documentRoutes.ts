import express from "express";
import {
  createNewDocument,
  getDocuments,
} from "../controllers/documentControllers";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createNewDocument);
router.get("/", authenticate, getDocuments);

export default router;
