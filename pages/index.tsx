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

const Index = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [register, setRegister] = useState<boolean>(false); // wenn true wird register page angezeigt
  const [actUser, setActUser] = useState<User>(null);
  const [scene, setScene] = useState<Scene>(null);
  const [sceneMembership, setSceneMembership] = useState<SceneMemberShip>();
  const [session, setSession] = useState<Session>(null);

  const getSession = async (idUser: string) => {
    const requestedSession = await fetch(
      "api/database/Session/DB_getSessionByUserID",
      {
        method: "POST",
        body: JSON.stringify({
          idUser: idUser,
        }),
      }
    );

    const session: Session = await requestedSession.json();
    return session;
  };

  useEffect(() => {
    if (!actUser) return;

    getSession(actUser.id).then((session: Session) => {
      // alert("load session:" + actUser.id);
      setSession(session);
      // alert("load session:" + session.id);
    });
  }, [actUser]);

  return (
    <Stack className="index">
      <Typography>{session ? session.id : null}</Typography>
      {loggedIn ? (
        scene ? (
          <Main
            scene={scene}
            setScene={setScene}
            user={actUser}
            membership={sceneMembership}
          ></Main>
        ) : (
          <Home
            setActSceneMembership={setSceneMembership}
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

      {register ? <Register setRegister={setRegister}></Register> : null}

      {loggedIn ? <Chat user={actUser} scene={scene}></Chat> : null}
    </Stack>
  );
};

export default Index;
