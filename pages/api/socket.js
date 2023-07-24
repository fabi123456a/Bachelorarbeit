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

        //socket.broadcast.emit("getChatEntry", chatEntrys);

        console.log("---CHAT---" + chatEntry.idScene);
        io.emit("getChatEntry", { idScene: chatEntry.idScene });
      });
      // scene
      socket.on("setSyncScene", async (data) => {
        // console.log("----------------" + JSON.stringify(data));
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
      // sync currentObjectProps
      socket.on("newObjectData", async (data) => {
        io.emit("getNewObjectData", data);
      });
      // wenn ein fbx zur scene hinzugefügt wird
      socket.on("addFbx", async (data) => {
        console.log(data);
        io.emit("getAddFbx", data);
      });
      // wenn eine Wall, cube, floor zur scene hinzugefügt wird
      socket.on("addWall", async (data) => {
        console.log(data);
        io.emit("getAddWall", data);
      });
    });
  }
  res.end();
};

export default SocketHandler;
