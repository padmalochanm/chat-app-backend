import express from "express";
import { getUsersForSideBar, createConversation, getConversations, getUserDetails } from "../controllers/userControllers.js"
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();
router.get("/", authenticateToken, getUsersForSideBar);
router.post('/conversations', authenticateToken, createConversation);
router.get('/conversations', authenticateToken, getConversations);
router.get('/me', authenticateToken, getUserDetails);
export default router;