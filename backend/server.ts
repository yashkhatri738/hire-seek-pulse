import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

import { initSocket } from "./socket";
import messageRoutes from "./routes/messages";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/messages", messageRoutes);

const server = http.createServer(app);

// Socket setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initSocket(io);

server.listen(process.env.PORT || 5000, () => {
  console.log("Server running...");
});