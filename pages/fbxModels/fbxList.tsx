import {
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ModelPreview from "../../components/fbxModels/modelPreview";
import { DeleteForeverOutlined } from "@mui/icons-material";
import UploadFbx from "../../components/threejs/UI-Elements/ModelList/fbxHandle/uploadFbx";
import FbxListEntry from "../../components/fbxModels/fbxListEntry";
import { User } from "@prisma/client";

interface FileListResponse {
  files: string[];
}

const FbxList = (props: { loggedInUser: User; sessionID: string }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [reload, setReload] = useState<number>(0);
  const [isLoading, setIsloading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("api/filesystem/FS_getFbxModels", {
          method: "POST",
          body: JSON.stringify({
            sessionID: props.sessionID,
            idUser: props.loggedInUser.id,
          }),
        });
        const data: FileListResponse = await response.json();
        setFiles(data.files);
        setIsloading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFiles();
  }, [reload]);

  return isLoading ? (
    <Stack className="fullHeightWidth centerH centerV">
      <CircularProgress className="loading"></CircularProgress>
    </Stack>
  ) : (
    <Stack>
      <Stack className="fbxList">
        {files.map((file, index) => (
          <FbxListEntry
            key={file + index}
            sessionID={props.sessionID}
            file={file}
            setReload={setReload}
            loggedInUser={props.loggedInUser}
          ></FbxListEntry>
        ))}
        {props.loggedInUser.write ? (
          <UploadFbx
            setRefreshData={() => {
              setReload(Math.random());
            }}
          ></UploadFbx>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default FbxList;