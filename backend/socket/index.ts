import { Server } from "socket.io";
import { handleSocketEvents } from "./socketEvents";

export const initSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    handleSocketEvents(io, socket);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};