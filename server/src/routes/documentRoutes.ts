import express from 'express';
import { createNewDocument } from '../controllers/documentControllers';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticate, createNewDocument);

export default router;
