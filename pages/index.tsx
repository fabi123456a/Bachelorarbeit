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
          <>
            {/* TODO: auslagern in eigene Admin komponente*/}
            <DatabaseTable
              tableName="user"
              setAdminArea={setAdminArea}
            ></DatabaseTable>
            {/* <DatabaseTable
              tableName="scene"
              setAdminArea={setAdminArea}
            ></DatabaseTable> */}
          </>
        ) : (
          <Stack sx={{ height: "100%", width: "100%", background: "" }}>
            <SceneList
              setScene={setScene}
              user={actUser}
              setAdminArea={setAdminArea}
            ></SceneList>
          </Stack>
        )
      ) : register ? null : (
        <Login
          setLoggedIn={setLoggedIn}
          setActUser={setActUser}
          setRegister={setRegister}
        ></Login>
      )}
      {/* <AdminArea></AdminArea> */}
      {scene ? null : <CubeRotater loggedIn={loggedIn}></CubeRotater>}
      {loggedIn ? (
        <Logout setActUser={setActUser} setLoggedIn={setLoggedIn}></Logout>
      ) : null}
      {register ? <Register setRegister={setRegister}></Register> : null}
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
