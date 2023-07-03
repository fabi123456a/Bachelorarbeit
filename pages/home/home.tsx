import { Stack } from "@mui/material";
import SceneList from "../scenes/sceneList";
import { Scene, User } from "@prisma/client";
import NavigateBar from "./navigateBar";
import { useState } from "react";
import AdminArea from "../admin/adminArea";
import Settings from "../settings/settings";
import FbxList from "../admin/fbxModels/fbxList";

const Home = (props: {
  setScene: (scene: Scene) => void;
  user: User;
  setActUser: (user: User) => void;
  setLoggedIn: (flag: boolean) => void;
}) => {
  const [adminArea, setAdminArea] = useState<boolean>(false);
  const [settings, setSettings] = useState<boolean>(false);
  const [scenes, setScenes] = useState<boolean>(true);
  const [fbxModels, setFbxModels] = useState<boolean>(false);

  return (
    <Stack className="home">
      <NavigateBar
        setAdminArea={setAdminArea}
        setSecens={setScenes}
        setSettings={setSettings}
        setActUser={props.setActUser}
        setLoggedIn={props.setLoggedIn}
        setFbxModels={setFbxModels}
      ></NavigateBar>
      {scenes ? (
        <SceneList user={props.user} setScene={props.setScene}></SceneList>
      ) : adminArea ? (
        <AdminArea setAdminArea={setAdminArea} user={props.user}></AdminArea>
      ) : settings ? (
        <Settings></Settings>
      ) : fbxModels ? (
        <FbxList></FbxList>
      ) : null}
    </Stack>
  );
};

export default Home;
