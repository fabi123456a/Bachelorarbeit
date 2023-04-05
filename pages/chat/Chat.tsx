import { Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import io from "Socket.IO-client";
import {
  ModelChatEntry,
  ModelScene,
  ModelSession,
  ModelUser,
} from "../api/_models";
import { randomUUID } from "crypto";
import { UserOnlineItem } from "./UserOnlineItem";

let socket;

export function Chat(props: { scene: ModelScene; user: ModelUser }) {
  const [value, setValue] = useState<string>("");
  const [input, setInput] = useState<string[]>([]);
  const [msgs, setMsgs] = useState<ModelChatEntry[]>([]);
  const [sessions, setSessions] = useState<ModelSession[]>([]);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();

      socket.on("connect", () => {
        console.log("connected");
      });

      socket.on("update-input", (msg) => {
        //setInput([...input, msg]);
      });

      socket.on("getChatEntry", (chatEntrys) => {
        setMsgs(chatEntrys);
      });
    };
    socketInitializer();
  }, []);

  useEffect(() => {
    const getAllChatEntry = async () => {
      const response = await fetch("/api/DB_getAllChatEntrys");
      const result: ModelChatEntry[] = await response.json();
      return result;
    };
    getAllChatEntry().then((chatEntrys) => {
      setMsgs(chatEntrys);
    });
  }, []);

  useEffect(() => {
    const getAllSessions = async () => {
      const response = await fetch("/api/DB_getAllSessions");
      const result: ModelSession[] = await response.json();
      return result;
    };
    getAllSessions().then((sessions: ModelSession[]) => {
      setSessions(sessions);
    });
  }, []);

  const onChangeHandler = (e) => {
    setValue(e.target.value);
    //socket.emit("input-change", e.target.value);
  };

  const onClickHandler = async () => {
    socket.emit("input-change", value);

    const chatEntry: ModelChatEntry = {
      id: "" + Math.random() * 1000,
      idScene: props.scene.id,
      idUser: props.user.id,
      message: value,
      datum: new Date(),
    };

    socket.emit("addChatEntry", chatEntry);

    // test sessio keep alive

    await fetch("api/DB_sessionKeepAlive");
  };

  const getUserByID = async (idUser: string) => {
    const response = await fetch("/api/DB_getUserByID", {
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
          <TextField onChange={onChangeHandler} value={value}></TextField>
          <Button variant="outlined" onClick={onClickHandler}>
            send
          </Button>
        </Stack>

        <Stack
          sx={{ overflowY: "scroll", maxHeight: "300px", minHeight: "300px" }}
        >
          {msgs.map((msg: ModelChatEntry) => {
            const color = counter % 2 === 0 ? "#abdbe3" : "#eab676";
            counter++;

            return (
              <Typography style={{ background: color }}>
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
            return <UserOnlineItem session={session}></UserOnlineItem>;
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
