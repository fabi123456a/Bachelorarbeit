import { Button, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AddSceneToDB from "./scenes/addScne";
import GetFbx from "./threejs/UI-Elements/ModelList/fbxHandle/getFbx";
import UploadFile from "./threejs/UI-Elements/ModelList/fbxHandle/uploadFbx";
import Login from "./login/login";
import SceneList from "./scenes/sceneList";
import Main from "./threejs/Main";
import Stack from "@mui/material/Stack";
import { User, Scene, SceneMemberShip, Session } from "@prisma/client";
import CubeRotater from "./login/cubeRotater";
import Logout from "./login/logout";
import DatabaseTable from "./admin/databaseTable/databaseTable";
import UploadFbx from "./threejs/UI-Elements/ModelList/fbxHandle/uploadFbx";
import Register from "./login/register";
import FbxList from "./admin/fbxModels/fbxList";
import AdminArea from "./admin/adminArea";
import Feedback from "./feedback/feedback";
import Home from "./home/home";
import SceneDetails from "./scenes/sceneDetails/sceneDetail";
import Chat from "./chat/Chat";
import Test from "./text";
import fetchData from "./fetchData";

const Index = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [register, setRegister] = useState<boolean>(false); // wenn true wird register page angezeigt
  const [actUser, setActUser] = useState<User>(null);
  const [scene, setScene] = useState<Scene>(null);
  const [sceneMembership, setSceneMembership] = useState<SceneMemberShip>();
  const [session, setSession] = useState<Session>(null);

  // neu fetchData
  const getSession = async (): Promise<Session> => {
    // const requestedSession = await fetch(
    //   "api/database/Session/DB_getSessionByUserID",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({
    //       idUser: idUser,
    //     }),
    //   }
    // );

    const requestedSession = await fetchData(
      "session",
      "select",
      { idUser: actUser.id },
      null,
      null
    );

    if (requestedSession.error) return null;

    return requestedSession;
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
              scene={scene}
              setScene={setScene}
              user={actUser}
              membership={sceneMembership}
              sessionID={session.id}
            ></Main>
          ) : null
        ) : session ? (
          <Home
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

      {register ? (
        <Register setRegister={setRegister} sessionID={session.id}></Register>
      ) : null}

      {loggedIn && session ? (
        <Chat user={actUser} scene={scene} sessionID={session.id}></Chat>
      ) : null}
    </Stack>
  );
};

export default Index;
