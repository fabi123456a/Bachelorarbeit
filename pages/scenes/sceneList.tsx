import {
  Button,
  Divider,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { User, Scene } from "@prisma/client";
import AddScene from "./addScne";
import SceneListEntry from "./sceneListEntry";

const SceneList = (props: { setScene: (scene: Scene) => void; user: User }) => {
  const [scenes, setScenes] = useState<Scene[]>();
  const [reload, setReload] = useState<number>();
  const [cmboBox, setCmboBox] = useState<string>("-1"); // -1 wenn alle

  const getAllSceneNames = async () => {
    if (cmboBox == "-1") {
      const response = await fetch("/api/database/Scene/DB_getAllSceneNames", {
        method: "POST",
        body: JSON.stringify({
          id: null,
        }),
      });
      const result: Scene[] = await response.json();
      return result;
    } else {
      const response = await fetch("/api/database/Scene/DB_getAllSceneNames", {
        method: "POST",
        body: JSON.stringify({
          id: cmboBox,
        }),
      });
      const result: Scene[] = await response.json();
      return result;
    }
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
  }, [reload, cmboBox]);

  return props.setScene && props.user ? (
    <Stack className="sceneList">
      <Select
        label="Sortierung"
        onChange={(e) => {
          setCmboBox(e.target.value as string);
        }}
        value={cmboBox}
        size="small"
        className="select"
      >
        <MenuItem value={props.user.id}>nur meine anzeigen</MenuItem>
        <MenuItem value={"-1"}>alle anzeigen</MenuItem>
      </Select>
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
