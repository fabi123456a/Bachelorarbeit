import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ModelScene } from "../../../api/_models";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const MenuBar = (props: {
  setScene: (scene: ModelScene) => void;
  scene: ModelScene;
  isTestMode: boolean;
}) => {
  return (
    <Stack className="menuBar" direction={"row"}>
      <Button
        sx={{ mr: "8px" }}
        onClick={() => {
          props.setScene(null);
        }}
      >
        <ArrowBackIosIcon></ArrowBackIosIcon>
        Back
      </Button>
      <Typography>
        Scene: {props.scene.name}, testMode: {props.isTestMode ? "ja" : "nein"}
      </Typography>
    </Stack>
  );
};

export default MenuBar;
