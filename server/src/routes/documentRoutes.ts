import express, { Request, Response } from "express";
import { createNewDocument } from "../controllers/documentControllers";
import { authenticate } from "../middlewares/authMiddleware";
import Document from "../models/Document";

const router = express.Router();

router.post("/", authenticate, createNewDocument);
router.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    const user = req.user as { _id: String };

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const documents = await Document.find({ createdBy: user._id });

    res.status(200).json({ documents });
    return;
  } catch (error) {
    console.error("Error fetching documents: ", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

export default router;
