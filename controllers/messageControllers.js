import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { message, fileUrl } = req.body;
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

export const getMessages = async (req, res) => {
  try {
    const { id: conversationId } = req.params; // Use conversationId instead of receiverId
    const userId = req.user.userId;

    const conversation = await Conversation.findOne({
      _id: conversationId, participants: userId,
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    // Update read status for messages where the user is the receiver
    await Message.updateMany(
      { _id: { $in: conversation.messages }, receiverId: userId, read: false },
      { $set: { read: true } }
    );

    // Refetch the conversation to get updated messages
    const updatedConversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    }).populate("messages");

    res.status(200).json({
      success: true,
      messages: updatedConversation.messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching messages",
    });
  }
};
