import express from "express";
import { sendMessage, getMessages } from "../controllers/messageControllers.js"
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/send/:id", authenticateToken, sendMessage);
router.get("/:id", authenticateToken, getMessages);

export default router