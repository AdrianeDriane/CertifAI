import express from "express";
import { generateDocument } from "../controllers/groqControllers";

const router = express.Router();

router.post("/", generateDocument);

export default router;
