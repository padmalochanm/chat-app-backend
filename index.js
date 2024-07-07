import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToMongo from "./db/connectToMongo.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import {app, server} from "./socket/socket.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  connectToMongo();
  console.log(`Server is running successfully on port ${PORT}`);
});
