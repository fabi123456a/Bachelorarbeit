import {
  FormControl,
  FormLabel,
  IconButton,
  NativeSelect,
  Stack,
} from "@mui/material";
import React, { useRef, useState } from "react";
import HtmlIcon from "@mui/icons-material/Html";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";

export default function ShowHtml(props: {
  setHtmlSettings: (flag: boolean) => void;
  htmlSettings: boolean;
}) {
  return (
    <Stack>
      <IconButton
        title="Show objetcs in other perspective"
        onClick={() => {
          props.setHtmlSettings(!props.htmlSettings);
        }}
      >
        <DisplaySettingsIcon></DisplaySettingsIcon>
      </IconButton>
    </Stack>
  );
}
