import { Stack, Typography } from "@mui/material";
import SceneList from "../scenes/sceneList";
import { Scene, SceneMemberShip, User } from "@prisma/client";
import NavigateBar from "./navigateBar";
import { useState } from "react";
import AdminArea from "../admin/adminArea";
import Settings from "../settings/settings";
import FbxList from "../admin/fbxModels/fbxList";
import Textures from "../admin/textures/textures";

const Home = (props: {
  setScene: (scene: Scene) => void;
  user: User;
  setActUser: (user: User) => void;
  setLoggedIn: (flag: boolean) => void;
  setActSceneMembership: (membership: SceneMemberShip) => void;
  sessionID: string;
}) => {
  const [adminArea, setAdminArea] = useState<boolean>(false);
  const [settings, setSettings] = useState<boolean>(false);
  const [scenes, setScenes] = useState<boolean>(true);
  const [fbxModels, setFbxModels] = useState<boolean>(false);
  const [textures, setTextures] = useState<boolean>(false);

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
        <Settings></Settings>
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
