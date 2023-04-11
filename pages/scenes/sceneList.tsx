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

  useEffect(() => {
    const getAllSceneNames = async () => {
      const response = await fetch("/api/DB_getAllSceneNames");
      const result: ModelScene[] = await response.json();
      return result;
    };
    getAllSceneNames().then((scenes) => {
      setSenes(scenes);
    });
  }, []);

  return (
    <Stack className="sceneList">
      <Typography sx={{ mb: "24px", fontWeight: "bold" }}>
        Szene auswählen:
      </Typography>
      <Stack sx={{ overflowY: "auto", background: "", width: "70%" }}>
        {scenes
          ? scenes.map((scene: ModelScene) => {
              return (
                <SceneListEntry
                  key={scene.id}
                  scene={scene}
                  setScene={props.setScene}
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
