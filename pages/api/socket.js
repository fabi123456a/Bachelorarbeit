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
      socket.on("emitChatEntry", async (chatEntry) => {
        await prismaClient.chatEntry.create({
          data: chatEntry,
        });

        io.emit("getChatEntry", chatEntry.idScene);
      });
      // wenn szene gespeichert wird
      socket.on("safeScene", async (data) => {
        io.emit("getSafeScene", data);
      });
      // userCam
      socket.on("setUserCamData", async (data) => {
        io.emit("getUsersCamData", data);
        //console.log(JSON.stringify(data));
      });
      // refresh workers
      socket.on("sceneOnEnter", async (currentSceneEdit) => {
        io.emit("getSceneOnEnter", currentSceneEdit);
      });
      socket.on("sceneOnLeave", async (currentSceneEdit) => {
        io.emit("getSceneOnLeave", currentSceneEdit);
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

      // wenn ein Object aus der Szene gelöscht wird
      socket.on("deleteObject", async (data) => {
        console.log(data);
        io.emit("getDeleteObject", data);
      });
    });
  }
  res.end();
};

export default SocketHandler;
