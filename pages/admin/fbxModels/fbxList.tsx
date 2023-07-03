import { Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ModelPreview from "./modelPreview";
import { DeleteForeverOutlined } from "@mui/icons-material";
import UploadFbx from "../../threejs/UI-Elements/ModelList/fbxHandle/uploadFbx";
import FbxListEntry from "./fbxListEntry";

interface FileListResponse {
  files: string[];
}

const FbxList = (props: {}) => {
  const [files, setFiles] = useState<string[]>([]);
  const [reload, setReload] = useState<number>(0);

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
      <Stack className="fbxList">
        {files.map((file, index) => (
          <FbxListEntry file={file} setReload={setReload}></FbxListEntry>
        ))}
        <UploadFbx
          setRefreshData={() => {
            setReload(Math.random());
          }}
        ></UploadFbx>
      </Stack>
    </Stack>
  );
};

export default FbxList;
