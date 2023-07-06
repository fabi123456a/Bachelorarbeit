import {
  Button,
  Divider,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
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
        sx={{ mr: "8px", color: "black" }}
        onClick={() => {
          props.setScene(null);
        }}
      >
        <ArrowBackIosIcon></ArrowBackIosIcon>
        Back
      </Button>
      {props.scene ? (
        <Typography>
          Scene: {props.scene.name}, testMode:{" "}
          {props.isTestMode ? "ja" : "nein"}
        </Typography>
      ) : null}
      <Select
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
