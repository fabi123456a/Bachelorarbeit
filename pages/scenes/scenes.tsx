import { Button, Divider, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ModelUser } from "../api/DB_checkPassword";
import { ModelScene } from "../api/DB_insertScene";
import AddScene from "./addScne";
import newScene from "./newScene";

const Scenes = (props: {
  setSceneID: (id: string) => void;
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

  const getSceneData = async () => {
    const response = await fetch("/api/DB_getAllSceneNames");
    const result: ModelScene[] = await response.json();
    return result;
  };

  return (
    <>
      <Typography>Szene auswählen:</Typography>
      {scenes
        ? scenes.map((scene: ModelScene) => {
            return (
              <Button
                key={scene.id}
                onClick={async () => {
                  props.setSceneID(scene.id.toString());
                }}
              >
                {scene.name}
              </Button>
            );
          })
        : null}
      <Typography sx={{ margin: "20px" }}>Oder</Typography>
      <AddScene user={props.user}></AddScene>
    </>
  );
};

export default Scenes;
