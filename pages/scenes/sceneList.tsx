import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { User, Scene } from "@prisma/client";
import AddScene from "./addScne";
import SceneListEntry from "./sceneListEntry";

const SceneList = (props: { setScene: (scene: Scene) => void; user: User }) => {
  const [scenes, setSenes] = useState<Scene[]>();
  const [reload, setReload] = useState<number>();

  const getAllSceneNames = async () => {
    const response = await fetch("/api/database/scenes/DB_getAllSceneNames");
    const result: Scene[] = await response.json();
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
          ? scenes.map((scene: Scene) => {
              return (
                <SceneListEntry
                  key={scene.id}
                  scene={scene}
                  setScene={props.setScene}
                  setReload={setReload}
                ></SceneListEntry>
              );
            })
          : "llefr"}
      </Stack>
      <AddScene user={props.user} setScene={props.setScene}></AddScene>
    </Stack>
  );
};

export default SceneList;
