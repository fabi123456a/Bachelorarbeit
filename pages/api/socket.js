import { Server } from "socket.io";
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
        const selectedUser = await prismaClient.chatEntry.create({
          data: chatEntry,
        });
        const chatEntrys = await prismaClient.chatEntry.findMany({
          orderBy: {
            datum: "desc", // oder 'desc' für absteigende Sortierung
          },
          include: {
            user: true, // Hier wird die Beziehung zum User eingeschlossen
          },
        });
        //socket.broadcast.emit("getChatEntry", chatEntrys);
        io.emit("getChatEntry", chatEntrys);
      });
      // scene
      socket.on("setSyncScene", async (data) => {
        io.emit("syncScene", data);
      });
      // userCam
      socket.on("setUserCamData", async (data) => {
        io.emit("getUsersCamData", data);
        //console.log(JSON.stringify(data));
      });
      // refresh workers
      socket.on("refreshWorkers", async () => {
        io.emit("getRefreshWorkers");
      });
    });
  }
  res.end();
};

export default SocketHandler;
