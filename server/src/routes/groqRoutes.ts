import express from "express";
import { generateDocument } from "../controllers/groqControllers";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticate, generateDocument);

export default router;
