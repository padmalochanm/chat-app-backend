import express from "express";
import path from "path";
import multer from "multer";    
import { authenticateToken } from "../middleware/authenticateToken.js";
import { sendMessageWithFiles } from "../controllers/fileControllers.js";

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Folder to save uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Save file with timestamp
    },
  });
  
const upload = multer({ storage });
router.post("/send/:id", authenticateToken, upload.single("file"), sendMessageWithFiles);
//router.get("/:id", authenticateToken, getMessages);

export default router;