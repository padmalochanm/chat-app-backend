import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    fileUrl: {
      type: String,
      required: false, // URL or path to the uploaded file
    },
    fileType: {
      type: String,
      required: false, // Type of the uploaded file (e.g., image, video, file)
    },
    fileName: {
      type: String,
      required: false, // Name of the uploaded file
    },
    read: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

const Message = mongoose.model("Message", messageSchema);

export default Message;