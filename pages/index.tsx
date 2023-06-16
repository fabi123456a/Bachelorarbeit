import { Button, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AddSceneToDB from "./scenes/addScne";
import GetFbx from "./fbxHandle/getFbx";
import UploadFile from "./fbxHandle/uploadFbx";
import Login from "./login/login";
import SceneList from "./scenes/sceneList";
import Main from "./threejs/Main";
import Stack from "@mui/material/Stack";
import { User, Scene } from "@prisma/client";
import CubeRotater from "./login/cubeRotater";
import Logout from "./login/logout";
import DatabaseTable from "./admin/databaseTable/databaseTable";
import UploadFbx from "./fbxHandle/uploadFbx";
import Register from "./login/register/register";
import FbxList from "./admin/fbxModels/fbxList";
import AdminArea from "./admin/adminArea";
import Feedback from "./feedback/feedback";

const Home = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [adminArea, setAdminArea] = useState<boolean>(false);
  const [register, setRegister] = useState<boolean>(false); // wenn true wird register page angezeigt
  const [actUser, setActUser] = useState<User>(null);
  const [scene, setScene] = useState<Scene>(null);

  return (
    <Stack className="index">
      {loggedIn ? (
        scene ? (
          <Main scene={scene} setScene={setScene} user={actUser}></Main>
        ) : adminArea ? (
          <AdminArea setAdminArea={setAdminArea}></AdminArea>
        ) : (
          <SceneList
            setScene={setScene}
            user={actUser}
            setAdminArea={setAdminArea}
          ></SceneList>
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
      {loggedIn ? (
        <Logout setActUser={setActUser} setLoggedIn={setLoggedIn}></Logout>
      ) : null}
      {register ? <Register setRegister={setRegister}></Register> : null}
      <Feedback></Feedback>
    </Stack>
    //
    //
    // <Stack>
    //   {/* <AdminArea></AdminArea> */}
    //   <DatabaseTable tableName="User"></DatabaseTable>
    // </Stack>
  );
};

export default Home;
