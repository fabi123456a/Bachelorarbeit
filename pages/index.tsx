import { Button, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AddSceneToDB from "../components/sceneList/addScne";
import GetFbx from "../components/threejs/UI-Elements/ModelList/fbxHandle/getFbx";
import UploadFile from "../components/threejs/UI-Elements/ModelList/fbxHandle/uploadFbx";
import Login from "./authentication/login";
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
import Logout from "./authentication/logout";
import DatabaseTable from "../components/adminArea/databaseTable/databaseTable";
import UploadFbx from "../components/threejs/UI-Elements/ModelList/fbxHandle/uploadFbx";
import Register from "./authentication/register";
import FbxList from "./fbxModels/fbxList";
import AdminArea from "./admin/adminArea";
import Home from "./home/home";
import SceneDetails from "../components/sceneList/sceneListEntry/sceneDetails";
import Chat from "../components/chat/Chat";
import Test from "./text";
import { fetchData } from "../utils/fetchData";
import { deleteOldSceneEdits } from "../components/threejs/Scene/Scene";
import ResetPassword from "./authentication/resetPassword";

const Index = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [resetPw, setResetPw] = useState<boolean>(false);
  const [register, setRegister] = useState<boolean>(false); // wenn true wird register page angezeigt
  const [actUser, setActUser] = useState<User>(null);
  const [scene, setScene] = useState<Scene>(null); // beinhaltet die Szene für Main
  const [sceneMembership, setSceneMembership] = useState<SceneMemberShip>(); // speichert den aktuellen MemberShip-Datensatz der ausgewählten Szene
  const [session, setSession] = useState<Session>(null);
  const refCurrentWorkingScene = useRef<CurrentSceneEdit>(null); // beinhaltet den aktuellen CurrentSceneEdit-Datensatz, ist ausgefüllt wenn ein Benutzer eine Szene bearbeitete 

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

    if (!session) return null;

    return session;
  };

  useEffect(() => {
    if (!actUser) return;

    getSession().then((session: Session) => {
      setSession(session);
    });
  }, [actUser]);

  useEffect(() => {
    if (!actUser || !session) return;
    deleteOldSceneEdits(actUser.id, session.id);
  }, [actUser, session]);

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
          setResetPw={setResetPw}
        ></Login>
      )}

      {register ? <Register setRegister={setRegister}></Register> : null}
      {resetPw ? (
        <ResetPassword
          setLoggedIn={setLoggedIn}
          setRegister={setRegister}
          setResetPw={setResetPw}
        ></ResetPassword>
      ) : null}
    </Stack>
  );
};

export default Index;
