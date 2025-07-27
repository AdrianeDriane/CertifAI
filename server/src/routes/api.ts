import express from "express";
import { testGetAllUsers, createUser } from "../controllers/dataControllers";

const router = express.Router();

router.get("/users", testGetAllUsers);
router.post("/addUser", createUser);

export default router;