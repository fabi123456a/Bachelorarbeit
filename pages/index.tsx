import { Button, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AddSceneToDB from "./scenes/addScne";
import GetFbx from "./threejs/UI-Elements/ModelList/fbxHandle/getFbx";
import UploadFile from "./threejs/UI-Elements/ModelList/fbxHandle/uploadFbx";
import Login from "./login/login";
import SceneList from "./scenes/sceneList";
import Main from "./threejs/Main";
import Stack from "@mui/material/Stack";
import {
  User,
  Scene,
  SceneMemberShip,
  Session,
  CurrentSceneEdit,
} from "@prisma/client";
import CubeRotater from "./login/cubeRotater";
import Logout from "./login/logout";
import DatabaseTable from "./admin/databaseTable/databaseTable";
import UploadFbx from "./threejs/UI-Elements/ModelList/fbxHandle/uploadFbx";
import Register from "./login/register";
import FbxList from "./admin/fbxModels/fbxList";
import AdminArea from "./admin/adminArea";
import Home from "./home/home";
import SceneDetails from "./scenes/sceneDetails/sceneDetail";
import Chat from "./chat/Chat";
import Test from "./text";
import { fetchData } from "../utils/fetchData";

const Index = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [register, setRegister] = useState<boolean>(false); // wenn true wird register page angezeigt
  const [actUser, setActUser] = useState<User>(null);
  const [scene, setScene] = useState<Scene>(null);
  const [sceneMembership, setSceneMembership] = useState<SceneMemberShip>();
  const [session, setSession] = useState<Session>(null);
  const refCurrentWorkingScene = useRef<CurrentSceneEdit>();

  // neu fetchData
  const getSession = async (): Promise<Session> => {
    const requestedSession = await fetch(
      "api/database/Session/DB_getSessionByUserID",
      {
        method: "POST",
        body: JSON.stringify({
          idUser: actUser.id,
        }),
      }
    );

    // const requestedSession = await fetchData(
    //   null,
    //   "session",
    //   "select",
    //   { idUser: actUser.id },
    //   null,
    //   null
    // );

    const session = await requestedSession.json();

    if (session.error) return null;

    return session;
  };

  useEffect(() => {
    if (!actUser) return;

    getSession().then((session: Session) => {
      setSession(session);
    });
  }, [actUser]);

  return false ? (
    <Test></Test>
  ) : (
    <Stack className="index">
      {/* <Typography>{session ? session.id : null}</Typography> */}
      {loggedIn ? (
        scene ? (
          session ? (
            <Main
              currentWorkingScene={refCurrentWorkingScene}
              scene={scene}
              setScene={setScene}
              user={actUser}
              membership={sceneMembership}
              sessionID={session.id}
            ></Main>
          ) : null
        ) : session ? (
          <Home
            currentWorkingScene={refCurrentWorkingScene}
            sessionID={session.id}
            setActSceneMembership={setSceneMembership}
            setScene={setScene}
            user={actUser}
            setActUser={setActUser}
            setLoggedIn={setLoggedIn}
          ></Home>
        ) : null
      ) : register ? null : (
        <Login
          // sessionID={session.id}
          setLoggedIn={setLoggedIn}
          setActUser={setActUser}
          setRegister={setRegister}
        ></Login>
      )}

      {register ? <Register setRegister={setRegister}></Register> : null}

      {loggedIn && session ? (
        <Chat user={actUser} scene={scene} sessionID={session.id}></Chat>
      ) : null}
    </Stack>
  );
};

export default Index;
