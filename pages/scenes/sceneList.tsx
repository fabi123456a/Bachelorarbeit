import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ModelScene, ModelUser } from "../api/_models";
import AddScene from "./addScne";
import SceneListEntry from "./sceneListEntry";

const SceneList = (props: {
  setScene: (scene: ModelScene) => void;
  user: ModelUser;
}) => {
  const [scenes, setSenes] = useState<ModelScene[]>();
  const [reload, setReload] = useState<number>();

  const getAllSceneNames = async () => {
    const response = await fetch("/api/DB_getAllSceneNames");
    const result: ModelScene[] = await response.json();
    return result;
  };

  useEffect(() => {
    getAllSceneNames().then((scenes) => {
      setSenes(scenes);
    });
  }, []);

  useEffect(() => {
    getAllSceneNames().then((scenes) => {
      setSenes(scenes);
    });
  }, [reload]);

  return (
    <Stack className="sceneList">
      <Typography sx={{ mb: "24px", fontWeight: "bold" }}>
        Szene auswählen:
      </Typography>
      <Stack
        sx={{
          overflowY: "auto",
          width: "70%",
          flexGrow: 1,
        }}
      >
        {scenes
          ? scenes.map((scene: ModelScene) => {
              return (
                <SceneListEntry
                  key={scene.id}
                  scene={scene}
                  setScene={props.setScene}
                  setReload={setReload}
                ></SceneListEntry>
              );
            })
          : null}
      </Stack>
      <AddScene user={props.user} setScene={props.setScene}></AddScene>
    </Stack>
  );
};

export default SceneList;
