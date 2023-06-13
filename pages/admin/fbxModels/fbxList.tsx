import { Divider, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ModelPreview from "./modelPreview";
import { DeleteForeverOutlined } from "@mui/icons-material";

interface FileListResponse {
  files: string[];
}

const FbxList: React.FC = () => {
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
      <Typography>Fbx-Models</Typography>
      <Stack>
        {files.map((file, index) => (
          <Stack key={index} direction={"row"} sx={{ alignItems: "center" }}>
            <ModelPreview fbxName={file}></ModelPreview>
            <Typography>{file}</Typography>
            <IconButton
              onClick={async () => {
                await handleFbxDelete(file);
                setReload((prev) => !prev);
                alert(file + " wurde erfolgreich gelöscht");
              }}
            >
              <DeleteForeverOutlined />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default FbxList;
