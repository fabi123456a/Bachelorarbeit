import { Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ModelPreview from "./modelPreview";
import { DeleteForeverOutlined } from "@mui/icons-material";
import UploadFbx from "../../threejs/UI-Elements/ModelList/fbxHandle/uploadFbx";

const FbxListEntry = (props: {
  file: string;
  setReload: (n: number) => void;
}) => {
  const handleFbxDelete = async (fbxModel: string) => {
    await fetch("api/filesystem/FS_deleteFbxModel", {
      method: "POST",
      body: JSON.stringify({
        fbxModel: fbxModel,
      }),
    });
  };

  return (
    <Stack className="roundedShadow fbxListEntry">
      <ModelPreview fbxName={props.file}></ModelPreview>
      <Typography>{props.file}</Typography>
      <IconButton
        onClick={async () => {
          const confirmed = window.confirm(
            "Willst du " + props.file + " wirklich löschen?"
          );

          if (confirmed) {
            await handleFbxDelete(props.file);
            props.setReload(Math.random());
            alert(props.file + " wurde erfolgreich gelöscht");
          }
        }}
      >
        <DeleteForeverOutlined />
      </IconButton>
    </Stack>
  );
};

export default FbxListEntry;
