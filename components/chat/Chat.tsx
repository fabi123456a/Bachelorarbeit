import { Button, Stack, TextField, Typography } from "@mui/material";
import { MutableRefObject, useEffect, useState } from "react";
import io from "socket.io-client";

import {
  ChatEntry,
  CurrentSceneEdit,
  Scene,
  Session,
  User,
} from "@prisma/client";
import { randomUUID } from "crypto";
import { prismaClient } from "../../pages/api/prismaclient/_prismaClient";
import UserOnlineItem from "./UserOnlineItem";
import Draggable from "react-draggable";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";
import { v4 as uuidv4 } from "uuid";
import { fetchData } from "../../utils/fetchData";

let socket;

export default function Chat(props: {
  scene: Scene;
  user: User;
  sessionID: string;
}) {
  const [reload, setReload] = useState<number>(null);
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
  const [visible, setVisible] = useState<boolean>(false);
  const [fontSize1, setFontSize] = useState<string>("12px");
  let counter = 0;

  // socket IO
  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();

      socket.on("getChatEntry", (data: { idScene: string }) => {
        setReload(Math.random());
      });
    };
    socketInitializer();
  }, []);

  const getAllChatEntry = async () => {
    let requestedChatEntries;

    // TODO: orderBy: { datum: "desc", }
    props.scene
      ? (requestedChatEntries = await fetchData(
          props.user.id,
          props.sessionID,
          "ChatEntry",
          "select",
          { idScene: props.scene.id },
          null,
          {
            user: true,
          }
        ))
      : null;

    if (requestedChatEntries.err) return;

    return requestedChatEntries;
  };

  // alle chat einträge laden
  useEffect(() => {
    getAllChatEntry().then((chatEntrys) => {
      setMsgs(chatEntrys);
    });
  }, [props.scene, reload]);

  // laden wer alles online ist
  useEffect(() => {
    const getAllSessions = async () => {
      const request = await fetchData(
        props.user.id,
        props.sessionID,
        "session",
        "select",
        {},
        null,
        null
      );

      if (request.err) return;
      return request;
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
    // model für chat eintrag erstellen
    const chatEntry: ChatEntry = {
      id: uuidv4(),
      idScene: props.scene ? props.scene.id : "",
      idUser: props.user.id,
      message: text,
      datum: new Date(),
    };

    // chatentry verteilen
    socket.emit("emitChatEntry", chatEntry);

    // session keep alive
    await fetch("api/database/Session/DB_sessionKeepAlive", {
      method: "POST",
      body: JSON.stringify({
        sessionID: props.sessionID,
        idUser: props.user.id,
      }),
    });

    // textfeld leeren
    setText("");
  };

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
        {props.scene ? (
          <>
            <Typography>
              {props.scene ? "Chat: " + props.scene.name : "alle chats"}
            </Typography>
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
          </>
        ) : (
          <Typography>Betreten Sie erste eine scene</Typography>
        )}
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
