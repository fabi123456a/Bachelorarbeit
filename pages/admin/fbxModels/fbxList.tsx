import { Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ModelPreview from "./modelPreview";
import { DeleteForeverOutlined } from "@mui/icons-material";
import UploadFbx from "../../fbxHandle/uploadFbx";

interface FileListResponse {
  files: string[];
}

const FbxList = (props: { setAdminArea: (flag: boolean) => void }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [reload, setReload] = useState<boolean>(false);

  const handleFbxDelete = async (fbxModel: string) => {
    await fetch("api/filesystem/FS_deleteFbxModel", {
      method: "POST",
      body: JSON.stringify({
        fbxModel: fbxModel,
      }),
    });
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("api/filesystem/FS_getFbxModels");
        const data: FileListResponse = await response.json();
        setFiles(data.files);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFiles();
  }, [reload]);

  return (
    <Stack>
      <Button
        onClick={() => {
          props.setAdminArea(false);
        }}
      >
        Zurück
      </Button>
      <Typography>Fbx-Models</Typography>
      <Stack>
        {files.map((file, index) => (
          <Stack key={index} direction={"row"} sx={{ alignItems: "center" }}>
            <ModelPreview fbxName={file}></ModelPreview>
            <Typography>{file}</Typography>
            <IconButton
              onClick={async () => {
                const confirmed = window.confirm(
                  "Willst du " + file + " wirklich löschen?"
                );

                if (confirmed) {
                  await handleFbxDelete(file);
                  setReload((prev) => !prev);
                  alert(file + " wurde erfolgreich gelöscht");
                }
              }}
            >
              <DeleteForeverOutlined />
            </IconButton>
          </Stack>
        ))}
        <UploadFbx
          setRefreshData={() => {
            setReload((prev) => !prev);
          }}
        ></UploadFbx>
      </Stack>
    </Stack>
  );
};

export default FbxList;
