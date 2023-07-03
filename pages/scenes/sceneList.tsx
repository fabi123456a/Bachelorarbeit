import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { User, Scene } from "@prisma/client";
import AddScene from "./addScne";
import SceneListEntry from "./sceneListEntry";

const SceneList = (props: { setScene: (scene: Scene) => void; user: User }) => {
  const [scenes, setScenes] = useState<Scene[]>();
  const [reload, setReload] = useState<number>();

  const getAllSceneNames = async () => {
    const response = await fetch("/api/database/Scene/DB_getAllSceneNames");
    const result: Scene[] = await response.json();
    return result;
  };

  useEffect(() => {
    getAllSceneNames().then((scenes) => {
      setScenes(scenes);
    });
  }, []);

  useEffect(() => {
    getAllSceneNames().then((scenes) => {
      setScenes(scenes);
    });
  }, [reload]);

  return props.setScene && props.user ? (
    <Stack className="sceneList">
      <Stack className="sceneListEntriesContainer">
        {scenes
          ? scenes.map((scene: Scene) => {
              return (
                <SceneListEntry
                  user={props.user}
                  key={scene.id}
                  scene={scene}
                  setScene={props.setScene}
                  setReload={setReload}
                ></SceneListEntry>
              );
            })
          : "noch keine Leitstellen-Konfiguration vorhanden. Erstellen Sie die erste Konfiguration..."}
        {/* bei readonly user ausblenden */}
        {props.user.readOnly ? null : (
          <AddScene user={props.user} setScene={props.setScene}></AddScene>
        )}
      </Stack>
    </Stack>
  ) : null;
};

export default SceneList;
