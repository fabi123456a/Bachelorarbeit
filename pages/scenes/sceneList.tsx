import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { User, Scene } from "@prisma/client";
import AddScene from "./addScne";
import SceneListEntry from "./sceneListEntry";

const SceneList = (props: {
  setScene: (scene: Scene) => void;
  user: User;
  setAdminArea: (flag: boolean) => void;
}) => {
  const [scenes, setSenes] = useState<Scene[]>();
  const [reload, setReload] = useState<number>();

  const getAllSceneNames = async () => {
    const response = await fetch("/api/database/Scene/DB_getAllSceneNames");
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

  return props.setAdminArea && props.setScene && props.user ? (
    <Stack className="">
      <Typography sx={{ mb: "24px", fontWeight: "bold" }}>
        Leitstelle auswählen:
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
                  user={props.user}
                  key={scene.id}
                  scene={scene}
                  setScene={props.setScene}
                  setReload={setReload}
                ></SceneListEntry>
              );
            })
          : "noch keine Leitstellen-Konfiguration vorhanden. Erstellen Sie die erste Konfiguration..."}
      </Stack>
      {props.user.readOnly ? null : (
        <AddScene user={props.user} setScene={props.setScene}></AddScene>
      )}
      {props.user.loginID === "rr" ? (
        <Button
          onClick={() => {
            props.setAdminArea(true);
          }}
        >
          AdminArea
        </Button>
      ) : null}
    </Stack>
  ) : null;
};

export default SceneList;
