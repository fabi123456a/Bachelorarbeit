import { Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import io from "socket.io-client";

import { ChatEntry, Scene, Session, User } from "@prisma/client";
import { randomUUID } from "crypto";
import { prismaClient } from "../api/prismaclient/_prismaClient";
import UserOnlineItem from "./UserOnlineItem";
import Draggable from "react-draggable";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";
import { v4 as uuidv4 } from "uuid";

let socket;

export default function Chat(props: { scene: Scene; user: User }) {
  const [text, setText] = useState<string>("");
  const [msgs, setMsgs] = useState<
    (ChatEntry & {
      user: User;
    })[]
  >([]);
  const [sessions, setSessions] = useState<
    (Session & {
      user: User;
    })[]
  >([]);
  const [users, setUsers] = useState<User[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [fontSize1, setFontSize] = useState<string>("12px");

  // socket IO
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

  // alle chat einträge laden
  useEffect(() => {
    const getAllChatEntry = async () => {
      const response = await fetch(
        "/api/database/ChatEntry/DB_getAllChatEntrys"
      );
      const result = await response.json();
      return result;
    };

    getAllChatEntry().then((chatEntrys) => {
      setMsgs(chatEntrys);
    });
  }, []);

  // alle user laden um von id zu user zu mappen
  useEffect(() => {
    const getAllUser = async () => {
      const response = await fetch("/api/database/DB_getAll", {
        method: "POST",
        body: JSON.stringify({
          tableName: "user",
        }),
      });
      const result: User[] = await response.json();
      return result;
    };

    getAllUser().then((users: User[]) => {
      setUsers(users);
    });
  }, []);

  // laden wer alles online ist
  useEffect(() => {
    const getAllSessions = async () => {
      const response = await fetch("/api/database/Session/DB_getAllSessions");
      const result: Session[] = await response.json();
      return result;
    };
    getAllSessions().then(
      (
        sessions: (Session & {
          user: User;
        })[]
      ) => {
        setSessions(sessions);
      }
    );
  }, []);

  const onChangeHandler = (e) => {
    setText(e.target.value);
  };

  // socket IO chatEntry 'verteilen'
  const onClickHandler = async () => {
    // textfeld leeren
    setText("");

    // model für chat eintrag erstellen
    const chatEntry: ChatEntry = {
      id: uuidv4(),
      idScene: props.scene ? props.scene.id : "",
      idUser: props.user.id,
      message: text,
      datum: new Date(),
    };

    //  model verteilen
    socket.emit("addChatEntry", chatEntry);

    // test sessio keep alive
    await fetch("api/database/Session/DB_sessionKeepAlive");
  };

  let counter = 0;

  return visible ? (
    <Draggable>
      <Stack
        className="chat roundedShadow"
        sx={{
          maxHeight: "300px",
          minHeight: "300px",
          maxWidth: "200px",
          minWidth: "200px",
        }}
      >
        <CloseIcon
          className="iconButton"
          onClick={() => {
            setVisible(false);
          }}
        ></CloseIcon>
        <Stack direction={"row"}>
          <TextField
            onChange={onChangeHandler}
            value={text}
            size="small"
            sx={{ fontSize: fontSize1 }}
          ></TextField>
          <Button variant="outlined" onClick={onClickHandler}>
            send
          </Button>
        </Stack>

        <Stack
          sx={{
            overflowY: "scroll",
          }}
        >
          {msgs.map(
            (
              msg: ChatEntry & {
                user: User;
              }
            ) => {
              const color = counter % 2 === 0 ? "#abdbe3" : "#eab676";
              counter++;

              return (
                <Typography
                  style={{ background: color, fontSize: fontSize1 }}
                  key={msg.id}
                >
                  {new Date(msg.datum).toLocaleTimeString() +
                    ": " +
                    msg.message +
                    " (" +
                    msg.user.loginID +
                    ")"}
                </Typography>
              );
            }
          )}
        </Stack>
        <Stack sx={{ overflowY: "scroll" }}>
          <Typography fontSize={{ fontSize: fontSize1 }}>Online: </Typography>
          {sessions.map((session) => {
            return (
              <UserOnlineItem
                session={session}
                key={session.id}
                fontSize={fontSize1}
              ></UserOnlineItem>
            );
          })}
        </Stack>
      </Stack>
    </Draggable>
  ) : (
    <Stack
      className="showChatBtn roundedShadow minOpenBtn"
      onClick={() => {
        setVisible(true);
      }}
    >
      <ChatIcon></ChatIcon>
    </Stack>
  );
}
