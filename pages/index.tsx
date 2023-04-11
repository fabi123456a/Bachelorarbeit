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

const Home = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [actUser, setActUser] = useState<ModelUser>(null);

  // anfangs json datei zum init der scene
  //const [sceneID, setSceneID] = useState<string>(null);
  const [scene, setScene] = useState<ModelScene>(null);

  return (
    <Stack className="index">
      {loggedIn ? (
        scene ? (
          <Main scene={scene} setScene={setScene} user={actUser}></Main>
        ) : (
          <Stack sx={{ height: "100%", width: "100%", background: "" }}>
            <SceneList setScene={setScene} user={actUser}></SceneList>
          </Stack>
        )
      ) : (
        <Login setLoggedIn={setLoggedIn} setActUser={setActUser}></Login>
      )}
      {/* <AdminArea></AdminArea> */}
    </Stack>
  );
};

export default Home;
