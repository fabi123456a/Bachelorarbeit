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
import { useEffect, useRef, useState } from "react";
import { Scene } from "@prisma/client";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { checkPropsForNull } from "../../../../utils/checkIfPropIsNull";

const MenuBar = (props: {
  setScene: (scene: Scene) => void;
  scene: Scene;
  isTestMode: boolean;
  sceneVersion: number;
  setSceneVersion: (version: number) => void;
}) => {
  // bedingtes rendern
  if (checkPropsForNull(props)) return null;

  return (
    <Stack className="menuBar" direction={"row"}>
      <Button
        sx={{ mr: "16px", ml: "7px", color: "black" }}
        onClick={() => {
          props.setScene(null);
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
      <Select
        size="small"
        sx={{ ml: "14px" }}
        onChange={(e) => {
          props.setSceneVersion(e.target.value as number);
        }}
        value={props.sceneVersion}
      >
        {Array.from({ length: props.scene.newestVersion }, (_, index) => (
          <MenuItem key={index} value={index + 1}>{`Version ${
            index + 1
          }`}</MenuItem>
        ))}
      </Select>

      <img src="./logo/Logo-Icon-final.png" className="logoMenubar"></img>
    </Stack>
  );
};

export default MenuBar;
