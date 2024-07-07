import Conversation from "../models/conversationModel.js"
import Message from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const { message } = req.body;
        const senderId = req.user.userId;
        let conv = await Conversation.findOne(
            { participants: { $all: [senderId, receiverId] } },
        );

        if(!conv){
            conv = await Conversation.create({
                participants: [senderId, receiverId],
                messages: []
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });
        if(newMessage){
            await newMessage.save();
            conv.messages.push(newMessage._id);
        }
        await conv.save();
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json({
            success: true,
            newMessage,
        }); 

    } catch (error) {
        console.log(error);
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: conversationId } = req.params;  // Use conversationId instead of receiverId
        const senderId = req.user.userId;

        const conv = await Conversation.findOne(
            { _id: conversationId, participants: senderId }  // Find conversation by id and ensure sender is a participant
        ).populate("messages");

        if (!conv) {
            return res.status(200).json({
              success: true,
              messages: [],
            });
        }
        res.status(200).json({
            success: true,
            messages: conv.messages,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error fetching messages",
        });
    }
}
