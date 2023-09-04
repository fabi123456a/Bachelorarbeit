import { Stack, Typography } from "@mui/material";
import SceneList from "../scenes/sceneList";
import { CurrentSceneEdit, Scene, SceneMemberShip, User } from "@prisma/client";
import NavigateBar from "../../components/home/navigateBar";
import { MutableRefObject, useEffect, useState } from "react";
import AdminArea from "../admin/adminArea";
import Settings from "../settings/settings";
import FbxList from "../fbxModels/fbxList";
import Textures from "../textures/textures";

const Home = (props: {
  setScene: (scene: Scene) => void;
  user: User;
  setActUser: (user: User) => void;
  setLoggedIn: (flag: boolean) => void;
  setActSceneMembership: (membership: SceneMemberShip) => void;
  sessionID: string;
  currentWorkingScene: MutableRefObject<CurrentSceneEdit>;
}) => {
  const [adminArea, setAdminArea] = useState<boolean>(false);
  const [settings, setSettings] = useState<boolean>(false);
  const [scenes, setScenes] = useState<boolean>(true);
  const [fbxModels, setFbxModels] = useState<boolean>(false);
  const [textures, setTextures] = useState<boolean>(false);

  useEffect(() => {
    if (!props.sessionID) return;

    fetch("api/database/Session/DB_sessionKeepAlive", {
      method: "POST",
      body: JSON.stringify({
        sessionID: props.sessionID,
      }),
    });
  }, [adminArea, settings, scenes, fbxModels, textures]);

  return props.user ? (
    <Stack className="home">
      <NavigateBar
        setActSceneMembership={props.setActSceneMembership}
        setAdminArea={setAdminArea}
        setSecens={setScenes}
        setSettings={setSettings}
        setActUser={props.setActUser}
        setLoggedIn={props.setLoggedIn}
        setFbxModels={setFbxModels}
        setScene={props.setScene}
        user={props.user}
        setTextures={setTextures}
      ></NavigateBar>
      {scenes ? (
        <SceneList
          currentWorkingScene={props.currentWorkingScene}
          sessionID={props.sessionID}
          user={props.user}
          setScene={props.setScene}
          setActSceneMembership={props.setActSceneMembership}
        ></SceneList>
      ) : adminArea ? (
        <AdminArea
          sessionID={props.sessionID}
          setAdminArea={setAdminArea}
          user={props.user}
          setScene={props.setScene}
        ></AdminArea>
      ) : settings ? (
        <Settings user={props.user} sessionID={props.sessionID}></Settings>
      ) : fbxModels ? (
        <FbxList
          loggedInUser={props.user}
          sessionID={props.sessionID}
        ></FbxList>
      ) : textures ? (
        <Textures
          loggedInUser={props.user}
          sessionID={props.sessionID}
        ></Textures>
      ) : null}
    </Stack>
  ) : (
    <Typography>Einloggen erforderlich</Typography>
  );
};

export default Home;
