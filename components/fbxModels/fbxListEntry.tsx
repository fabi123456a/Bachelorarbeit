import { Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ModelPreview from "./modelPreview";
import { DeleteForeverOutlined } from "@mui/icons-material";
import UploadFbx from "../UI-Elements/ModelList/fbxHandle/uploadFbx";
import { User } from "@prisma/client";

const FbxListEntry = (props: {
  file: string;
  setReload: (n: number) => void;
  loggedInUser: User;
  sessionID: string;
}) => {
  const handleFbxDelete = async (fbxModel: string): Promise<boolean> => {
    const request = await fetch("api/filesystem/FS_deleteFbxModel", {
      method: "POST",
      body: JSON.stringify({
        fbxModel: fbxModel,
        sessionID: props.sessionID,
        idUser: props.loggedInUser.id,
      }),
    });

    const erg = await request.json();

    return erg;
  };

  return props.file ? (
    <Stack className="roundedShadow fbxListEntry">
      <ModelPreview fbxName={props.file}></ModelPreview>
      <Typography>{props.file.toLowerCase().replace(".fbx", "")}</Typography>

      {/* nur admin darf löschen TODO: */}
      {props.loggedInUser.isAdmin ? (
        <IconButton
          onClick={async () => {
            const confirmed = window.confirm(
              "Willst du " + props.file + " wirklich löschen?"
            );

            if (confirmed) {
              const flag = await handleFbxDelete(props.file);
              props.setReload(Math.random());
              if (flag && !(typeof flag === "object"))
                alert(props.file + " wurde erfolgreich gelöscht");
              else alert("löschen fehlgeschlagen");
            }
          }}
        >
          <DeleteForeverOutlined />
        </IconButton>
      ) : null}
    </Stack>
  ) : (
    <Typography>lädt..,</Typography>
  );
};

export default FbxListEntry;
