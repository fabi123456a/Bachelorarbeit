import { Button, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AdminArea from "./admin/adminArea";
import AddSceneToDB from "./scenes/addScne";
import GetFbx from "./fbxHandle/getFbx";
import UploadFile from "./fbxHandle/uploadFbx";
import Login from "./login/login";
import SceneList from "./scenes/sceneList";
import Main from "./threejs/Main";
import Stack from "@mui/material/Stack";
import { ModelScene, ModelUser } from "./api/_models";
//import xx from "../styles/globals.css";
import { Chat } from "./chat/Chat";

const Home = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [actUser, setActUser] = useState<ModelUser>(null);

  // anfangs json datei zum init der scene
  //const [sceneID, setSceneID] = useState<string>(null);
  const [scene, setScene] = useState<ModelScene>(null);

  return (
    <Stack>
      <Chat></Chat>
      {loggedIn ? (
        scene ? (
          <Main scene={scene} setScene={setScene}></Main>
        ) : (
          <Stack>
            <SceneList setScene={setScene} user={actUser}></SceneList>
          </Stack>
        )
      ) : (
        <Login setLoggedIn={setLoggedIn} setActUser={setActUser}></Login>
      )}
    </Stack>
  );
};

export default Home;
