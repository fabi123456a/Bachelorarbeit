import { Server } from "Socket.IO";
import { prismaClient } from "./_prismaClient";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("input-change", (msg) => {
        socket.broadcast.emit("update-input", msg);
      });

      socket.on("addChatEntry", async (msg) => {
        console.log(msg);
        const selectedUser = await prismaClient.chatEntry.create({ data: msg});

        const chatEntrys = await prismaClient.chatEntry.findMany({ orderBy: {
          datum: 'desc' // oder 'desc' für absteigende Sortierung
        }});

        socket.broadcast.emit("getChatEntry", chatEntrys);

      });
    });
  }
  res.end();
};

export default SocketHandler;
