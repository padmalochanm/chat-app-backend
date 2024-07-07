import User from "../models/userModel.js";
import Conversation from "../models/conversationModel.js";
export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;
    const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );

    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const loggedInUserId = req.user.userId;

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [loggedInUserId, userId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [loggedInUserId, userId],
      });
      await conversation.save();
    }

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;
    const conversations = await Conversation.find({
      participants: loggedInUserId,
    }).populate("participants", "username profilePic");

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserDetails = async (req, res) => {
  const userId = req.user.userId; // Assuming you have the user ID in req.user from authentication middleware

  try {
    const user = await User.findById(userId).select("-password"); // Exclude the password field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user found, send the user details (excluding password)
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
