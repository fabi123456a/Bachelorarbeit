import { Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import io from "Socket.IO-client";
import { ModelChatEntry, ModelScene, ModelUser } from "../api/_models";
import { randomUUID } from "crypto";

let socket;

export function Chat(props:{scene: ModelScene, user: ModelUser}) {
  const [value, setValue] = useState<string>("");
  const [input, setInput] = useState<string[]>([]);
  const [msgs, setMsgs] = useState<ModelChatEntry[]>([]);

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

  useEffect(()=>{
    const getAllChatEntry = async () => {
      const response = await fetch("/api/DB_getAllChatEntrys");
      const result: ModelChatEntry[] = await response.json();
      return result;
    };
    getAllChatEntry().then((chatEntrys) => {
      setMsgs(chatEntrys);
    });
  }, []);




  const onChangeHandler = (e) => {
    setValue(e.target.value);
    //socket.emit("input-change", e.target.value);
  };

  const onClickHandler = () => {
    socket.emit("input-change", value);

    const chatEntry: ModelChatEntry = {
      id: "" + Math.random() * 1000,
      idScene: props.scene.id,
      idUser: props.user.id,
      message: value,
      datum: new Date(),
    };

    socket.emit("addChatEntry", chatEntry);
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

  return (
    <>
    <Stack sx={{overflowY: "scroll", maxHeight: "400px"}}><TextField onChange={onChangeHandler} value={value}></TextField>
      <Button variant="outlined" onClick={onClickHandler}>
        send
      </Button>
      <Stack>
        {msgs.map((msg: ModelChatEntry) => (
          <Typography>{new Date(msg.datum).toLocaleTimeString() + ": " +  msg.message + " (" +  msg.idUser + ")"}</Typography>
        ))}

      </Stack></Stack>
      

      {/* <TextField></TextField>
      <Typography>{value}</Typography>
      <Button variant="outlined" onClick={onClickHandler}>
        send
      </Button> */}
    </>
  );
}
