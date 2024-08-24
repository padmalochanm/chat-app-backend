import fs from "fs";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { promisify } from "util";
import cloudinary from "../config/cloudinaryConfig.js";

const unlinkAsync = promisify(fs.unlink);

export const sendMessageWithFiles = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { message } = req.body;
    const file = req.file;
    const senderId = req.user.userId;
    let conv = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conv) {
      conv = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    let fileUrl = null;

    if (file) {
      // Get the file path from multer
      // Determine the resource type and folder based on the file type
      const uploadOptions = {
        folder: file.mimetype.startsWith("image/")
          ? "messages/images"
          : file.mimetype.startsWith("video/")
          ? "messages/videos"
          : "messages/other",
        resource_type: file.mimetype.startsWith("image/")
          ? "image"
          : file.mimetype.startsWith("video/")
          ? "video"
          : "raw",
        quality: "auto",
        fetch_format: "auto",
      };
      const result = await cloudinary.uploader.upload(file.path, uploadOptions);
      fileUrl = result.secure_url; // Get the URL of the uploaded file
      console.log(fileUrl);
      // Delete the file from local storage after upload
      await unlinkAsync(file.path);
    }
    const newMessage = new Message({
        senderId,
        receiverId,
        message: message || null,
        fileUrl: fileUrl || null,
      });
      if (newMessage) {
        await newMessage.save();
        conv.messages.push(newMessage._id);
      }
      console.log(newMessage);
      await conv.save();
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
      res.status(201).json({
        success: true,
        newMessage,
      });
  } catch (error) {
    console.log(error);
  }
};
