import { Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import io from "Socket.IO-client";

let socket;

export function Chat() {
  const [value, setValue] = useState<string>("");
  const [input, setInput] = useState<string[]>([]);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();

      socket.on("connect", () => {
        console.log("connected");
      });

      socket.on("update-input", (msg) => {
        setInput([...input, msg]);
      });
    };
    socketInitializer();
  }, []);

  const onChangeHandler = (e) => {
    setValue(e.target.value);
    //socket.emit("input-change", e.target.value);
  };

  const onClickHandler = () => {
    socket.emit("input-change", value);
  };

  return (
    <>
      <TextField onChange={onChangeHandler} value={value}></TextField>
      <Button variant="outlined" onClick={onClickHandler}>
        send
      </Button>
      <Stack>
        {input.map((txt) => (
          <Typography>{txt}</Typography>
        ))}
      </Stack>

      {/* <TextField></TextField>
      <Typography>{value}</Typography>
      <Button variant="outlined" onClick={onClickHandler}>
        send
      </Button> */}
    </>
  );
}
