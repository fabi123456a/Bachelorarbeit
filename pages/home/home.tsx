import { Stack } from "@mui/material";
import SceneList from "../scenes/sceneList";
import { Scene, User } from "@prisma/client";
import NavigateBar from "./navigateBar";
import { useState } from "react";
import AdminArea from "../admin/adminArea";
import Settings from "../settings/settings";

const Home = (props: {
  setScene: (scene: Scene) => void;
  user: User;
  setActUser: (user: User) => void;
  setLoggedIn: (flag: boolean) => void;
}) => {
  const [adminArea, setAdminArea] = useState<boolean>(false);
  const [settings, setSettings] = useState<boolean>(true);
  const [scenes, setScenes] = useState<boolean>(true);

  return (
    <Stack className="home">
      <NavigateBar
        setAdminArea={setAdminArea}
        setSecens={setScenes}
        setSettings={setSettings}
        setActUser={props.setActUser}
        setLoggedIn={props.setLoggedIn}
      ></NavigateBar>
      {scenes ? (
        <SceneList user={props.user} setScene={props.setScene}></SceneList>
      ) : adminArea ? (
        <AdminArea setAdminArea={setAdminArea} user={props.user}></AdminArea>
      ) : settings ? (
        <Settings></Settings>
      ) : null}
    </Stack>
  );
};

export default Home;
