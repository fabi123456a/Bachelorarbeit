import { Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import io from "Socket.IO-client";

import { ChatEntry, Scene, Session, User } from "@prisma/client";
import { randomUUID } from "crypto";
import { UserOnlineItem } from "./UserOnlineItem";

let socket;

export function Chat(props: { scene: Scene; user: User }) {
  const [text, setText] = useState<string>("");
  const [msgs, setMsgs] = useState<ChatEntry[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();

      socket.on("connect", () => {
        console.log("connected");
      });

      socket.on("getChatEntry", (chatEntrys) => {
        setMsgs(chatEntrys);
      });
    };
    socketInitializer();
  }, []);

  useEffect(() => {
    const getAllChatEntry = async () => {
      const response = await fetch(
        "/api/database/ChatEntry/DB_getAllChatEntrys"
      );
      const result: ChatEntry[] = await response.json();
      return result;
    };
    getAllChatEntry().then((chatEntrys) => {
      setMsgs(chatEntrys);
    });
  }, []);

  useEffect(() => {
    const getAllSessions = async () => {
      const response = await fetch("/api/database/Session/DB_getAllSessions");
      const result: Session[] = await response.json();
      return result;
    };
    getAllSessions().then((sessions: Session[]) => {
      setSessions(sessions);
    });
  }, []);

  const onChangeHandler = (e) => {
    setText(e.target.value);
  };

  const onClickHandler = async () => {
    // textfeld leeren
    setText("");

    // model für chat eintrag erstellen
    const chatEntry: ChatEntry = {
      id: "" + Math.random() * 1000,
      idScene: props.scene.id,
      idUser: props.user.id,
      message: text,
      datum: new Date(),
    };

    //  model verteilen
    socket.emit("addChatEntry", chatEntry);

    // test sessio keep alive
    await fetch("api/database/Session/DB_sessionKeepAlive");
  };

  const getUserByID = async (idUser: string) => {
    const response = await fetch("/api/database/User/DB_getUserByID", {
      method: "POST",
      body: JSON.stringify({
        idUser: props.scene.idUserCreater,
      }),
    });

    const user = await response.json();

    return user;
  };

  let counter = 0;

  return (
    <>
      <Stack sx={{ background: "red", maxHeight: "500px", minHeight: "500px" }}>
        <Stack direction={"row"}>
          <TextField onChange={onChangeHandler} value={text}></TextField>
          <Button variant="outlined" onClick={onClickHandler}>
            send
          </Button>
        </Stack>

        <Stack
          sx={{ overflowY: "scroll", maxHeight: "300px", minHeight: "300px" }}
        >
          {msgs.map((msg: ChatEntry) => {
            const color = counter % 2 === 0 ? "#abdbe3" : "#eab676";
            counter++;

            return (
              <Typography style={{ background: color }} key={msg.id}>
                {new Date(msg.datum).toLocaleTimeString() +
                  ": " +
                  msg.message +
                  " (" +
                  msg.idUser +
                  ")"}
              </Typography>
            );
          })}
        </Stack>
        <Stack sx={{ overflowY: "scroll" }}>
          <Typography>Online: </Typography>
          {sessions.map((session) => {
            return (
              <UserOnlineItem
                session={session}
                key={session.id}
              ></UserOnlineItem>
            );
          })}
        </Stack>
      </Stack>

      {/* <TextField></TextField>
      <Typography>{value}</Typography>
      <Button variant="outlined" onClick={onClickHandler}>
        send
      </Button> */}
    </>
  );
}
