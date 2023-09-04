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
import ErrorIcon from "@mui/icons-material/Error";

interface FileListResponse {
  files: string[];
}

const FbxList = (props: { loggedInUser: User; sessionID: string }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [reload, setReload] = useState<number>(0);
  const [isLoading, setIsloading] = useState<boolean>(true);

  useEffect(() => {
    if (!props.loggedInUser.read) {
      setIsloading(false);
      return;
    }
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
  ) : !props.loggedInUser.read ? (
    <Stack direction={"row"} sx={{ m: "10px" }}>
      <ErrorIcon color="error" sx={{ mr: "8px" }}></ErrorIcon>
      <Typography color={"#d32f2f"}>
        Sie haben keine Berechtigung um die 3D-Modelle zu öffnen
      </Typography>
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
