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
import { User, Scene } from "@prisma/client";
import CubeRotater from "./login/cubeRotater";
import Logout from "./login/logout";
import DatabaseTable from "./admin/data/databaseTable";

const Home = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [actUser, setActUser] = useState<User>(null);
  const [scene, setScene] = useState<Scene>(null);

  return (
    // <Stack className="index">
    //   {loggedIn ? (
    //     scene ? (
    //       <Main scene={scene} setScene={setScene} user={actUser}></Main>
    //     ) : (
    //       <Stack sx={{ height: "100%", width: "100%", background: "" }}>
    //         <SceneList setScene={setScene} user={actUser}></SceneList>
    //       </Stack>
    //     )
    //   ) : (
    //     <Login setLoggedIn={setLoggedIn} setActUser={setActUser}></Login>
    //   )}
    //   {/* <AdminArea></AdminArea> */}
    //   {scene ? null : <CubeRotater loggedIn={loggedIn}></CubeRotater>}
    //   {loggedIn ? (
    //     <Logout setActUser={setActUser} setLoggedIn={setLoggedIn}></Logout>
    //   ) : null}
    // </Stack>
    <Stack>
      {/* <AdminArea></AdminArea> */}
      <DatabaseTable tableName="User"></DatabaseTable>
    </Stack>
  );
};

export default Home;
