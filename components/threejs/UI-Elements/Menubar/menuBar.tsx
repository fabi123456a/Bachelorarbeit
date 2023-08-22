import {
  Button,
  Divider,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { CurrentSceneEdit, Scene } from "@prisma/client";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { checkPropsForNull } from "../../../../utils/checkIfPropIsNull";
import { fetchData } from "../../../../utils/fetchData";
import io from "socket.io-client";

let socket;

const MenuBar = (props: {
  setScene: (scene: Scene) => void;
  scene: Scene;
  isTestMode: boolean;
  currentWorkingScene: MutableRefObject<CurrentSceneEdit>;
  idUser: string;
  sessionID: string;
  setSceneVersion: (v: number) => void;
  sceneVersion: number;
}) => {
  // bedingtes rendern
  if (checkPropsForNull(props)) return null;

  const deleteCurrentWorkingScene = async () => {
    if (!props.currentWorkingScene.current) return;
    const requestedMembership = await fetchData(
      props.idUser,
      props.sessionID,
      "CurrentSceneEdit",
      "delete",
      {
        id: props.currentWorkingScene.current.id,
      },
      null,
      null
    );

    if (requestedMembership.error) return null;

    return requestedMembership;
  };

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();
    };
    socketInitializer();
  }, []);

  return (
    <Stack className="menuBar" direction={"row"}>
      <Button
        sx={{ mr: "16px", ml: "7px", color: "black" }}
        onClick={async () => {
          props.setScene(null);

          // alert(props.currentWorkingScene.current.id);
          await deleteCurrentWorkingScene();
          socket.emit("sceneOnLeave", props.currentWorkingScene.current);
          props.currentWorkingScene.current = null;
        }}
        className="iconButton"
      >
        <ArrowBackIosIcon></ArrowBackIosIcon>
        Back
      </Button>
      {props.scene ? (
        <Typography>
          <b>{props.scene.name}</b>
        </Typography>
      ) : null}
      {props.scene.newestVersion >= 1 ? (
        <Select
          size="small"
          sx={{ ml: "14px", fontSize: "12px" }}
          onChange={(e) => {
            props.setSceneVersion(e.target.value as number);
          }}
          value={props.sceneVersion}
        >
          {Array.from({ length: props.scene.newestVersion }, (_, index) => (
            <MenuItem
              key={index}
              value={index + 1}
              sx={{ fontSize: "12px" }}
            >{`Version ${index + 1}`}</MenuItem>
          ))}
        </Select>
      ) : null}

      {/* <img src="./logo/Logo-Icon-final.png" className="logoMenubar"></img> */}
    </Stack>
  );
};

export default MenuBar;
