import { Button, Stack, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import UsersList from "../admin/usersList";
import { ModelScene, ModelUser } from "../api/_models";

// einmal in DB und json file to FS
const AddScene = (props: {
  user: ModelUser;
  setScene: (scene: ModelScene) => void;
}) => {
  const [name, setName] = useState<string>();
  const [sceneModel, setSceneModel] = useState<ModelScene>();

  const addSceneToDB = async () => {
    const response = await fetch("/api/DB_insertScene", {
      method: "POST",
      body: JSON.stringify({
        idUserCreator: props.user.id,
        name: name,
      }),
    });

    const result = await response.json();

    return result;
  };

  const addSceneToFS = async (idScene: string) => {
    const response = await fetch("/api/FS_uploadScene", {
      method: "POST",
      body: JSON.stringify({
        jsonData:
          '{"roomDimensions":{"height":7,"width":50,"depth":50},"models":[],"fbx_models":[]}', // leere scene daten
        sceneID: idScene,
      }),
    });
    const result = await response.json();

    alert("FS: " + result["result"]);
    return result["result"];
  };

  return (
    <Stack>
      <Typography>Neue Szene erstellen:</Typography>
      <TextField
        label={"Scene name"}
        onChange={(event) => {
          setName(event.target.value);
        }}
      ></TextField>
      <Button
        onClick={async () => {
          if (name == null) {
            alert("Scenename eingeben");
            return;
          }

          // insert into DB then to FS
          addSceneToDB().then((scene: ModelScene) => {
            addSceneToFS(scene.id).then(() => {
              props.setScene(scene);
            });
          });
        }}
      >
        Szene Erstellen
      </Button>
    </Stack>
  );
};

export default AddScene;
