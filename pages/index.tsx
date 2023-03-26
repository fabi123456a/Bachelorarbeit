import { Button } from "@mui/material";
import { useRef, useState } from "react";
import AdminArea from "./admin/adminArea";
import { ModelUser } from "./api/DB_checkPassword";
import AddSceneToDB from "./scenes/addScne";
import GetFbx from "./fbxHandle/getFbx";
import UploadFile from "./fbxHandle/uploadFbx";
import Login from "./login/login";
import Scenes from "./scenes/scenes";
import Main from "./threejs/Main";
import Stack from "@mui/material/Stack";

const Home = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [actUser, setActUser] = useState<ModelUser>(null);

  // anfangs json datei zum init der scene
  const [sceneID, setSceneID] = useState<string>(null);

  return (
    <Stack>
      {loggedIn ? (
        sceneID ? (
          <Main sceneID={sceneID} setSceneID={setSceneID}></Main>
        ) : (
          <Scenes setSceneID={setSceneID} user={actUser}></Scenes>
        )
      ) : (
        <Login setLoggedIn={setLoggedIn} setActUser={setActUser}></Login>
      )}
    </Stack>
  );
};

export default Home;

{
  /* <UploadFile></UploadFile>
      <GetFbx></GetFbx>
      <img src="testBild.png"></img> 
      <Main></Main>*/
}
