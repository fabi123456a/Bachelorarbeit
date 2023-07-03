import { Button, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AddSceneToDB from "./scenes/addScne";
import GetFbx from "./threejs/UI-Elements/ModelList/fbxHandle/getFbx";
import UploadFile from "./threejs/UI-Elements/ModelList/fbxHandle/uploadFbx";
import Login from "./login/login";
import SceneList from "./scenes/sceneList";
import Main from "./threejs/Main";
import Stack from "@mui/material/Stack";
import { User, Scene } from "@prisma/client";
import CubeRotater from "./login/cubeRotater";
import Logout from "./login/logout";
import DatabaseTable from "./admin/databaseTable/databaseTable";
import UploadFbx from "./threejs/UI-Elements/ModelList/fbxHandle/uploadFbx";
import Register from "./login/register";
import FbxList from "./admin/fbxModels/fbxList";
import AdminArea from "./admin/adminArea";
import Feedback from "./feedback/feedback";
import Home from "./home/home";

const Index = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [register, setRegister] = useState<boolean>(false); // wenn true wird register page angezeigt
  const [actUser, setActUser] = useState<User>(null);
  const [scene, setScene] = useState<Scene>(null);

  return (
    <Stack className="index">
      {loggedIn ? (
        scene ? (
          <Main scene={scene} setScene={setScene} user={actUser}></Main>
        ) : (
          <Home
            setScene={setScene}
            user={actUser}
            setActUser={setActUser}
            setLoggedIn={setLoggedIn}
          ></Home>
        )
      ) : register ? null : (
        <Login
          setLoggedIn={setLoggedIn}
          setActUser={setActUser}
          setRegister={setRegister}
        ></Login>
      )}
      {/* <AdminArea></AdminArea> */}
      {loggedIn ? null : <CubeRotater loggedIn={loggedIn}></CubeRotater>}
      {register ? <Register setRegister={setRegister}></Register> : null}
      <Feedback></Feedback>
    </Stack>
  );
};

export default Index;
