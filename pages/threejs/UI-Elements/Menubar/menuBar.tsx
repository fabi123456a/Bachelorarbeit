import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Scene } from "@prisma/client";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { checkPropsForNull } from "../../../../utils/checkIfPropIsNull";

const MenuBar = (props: {
  setScene: (scene: Scene) => void;
  scene: Scene;
  isTestMode: boolean;
}) => {
  // bedingtes rendern
  if (checkPropsForNull(props)) return null;

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
      {props.scene ? (
        <Typography>
          Scene: {props.scene.name}, testMode:{" "}
          {props.isTestMode ? "ja" : "nein"}
        </Typography>
      ) : null}
    </Stack>
  );
};

export default MenuBar;
