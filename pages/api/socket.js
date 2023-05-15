import { Server } from "Socket.IO";
import { prismaClient } from "./prismaclient/_prismaClient";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    io.on("connection", (socket) => {
      // chat
      socket.on("addChatEntry", async (chatEntry) => {
        console.log("========" + chatEntry["message"]);
        const selectedUser = await prismaClient.chatEntry.create({
          data: chatEntry,
        });
        const chatEntrys = await prismaClient.chatEntry.findMany({
          orderBy: {
            datum: "desc", // oder 'desc' für absteigende Sortierung
          },
        });
        //socket.broadcast.emit("getChatEntry", chatEntrys);
        io.emit("getChatEntry", chatEntrys);
      });
      // scene
      socket.on("sceneRefresh", async (msg) => {
        io.emit("getSceneRefresh", msg);
      });
    });
  }
  res.end();
};

export default SocketHandler;
