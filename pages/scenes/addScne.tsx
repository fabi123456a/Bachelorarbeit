import { Button, Stack, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import UsersList from "../admin/user/usersList";
import { Scene, User } from "@prisma/client";

// einmal in DB und json file to FS
const AddScene = (props: { user: User; setScene: (scene: Scene) => void }) => {
  const [name, setName] = useState<string>();
  const [sceneModel, setSceneModel] = useState<Scene>();

  const addSceneToDB = async () => {
    const response = await fetch("/api/database/Scene/DB_insertScene", {
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
    const response = await fetch("/api/filesystem/FS_uploadScene", {
      method: "POST",
      body: JSON.stringify({
        jsonData:
          '{"roomDimensions":{"height":7,"width":50,"depth":50},"models":[{"id":"fewrtgregvdg","position":{"x":0,"y":0,"z":0},"scale":{"x":50,"y":0.001,"z":50},"rotation":{"x":0,"y":0,"z":0},"showXTransform":false,"showYTransform":false,"showZTransform":false,"modelPath":null,"info":"floor","color":"#eee"},{"id":"efewdgvew434","position":{"x":25,"y":5,"z":0},"scale":{"x":0.001,"y":10,"z":50},"rotation":{"x":0,"y":0,"z":0},"showXTransform":false,"showYTransform":false,"showZTransform":false,"modelPath":null,"info":"rightWall"},{"id":"efewdgv5555ew434lllll","position":{"x":-25,"y":5,"z":0},"scale":{"x":0.001,"y":10,"z":50},"rotation":{"x":0,"y":0,"z":0},"showXTransform":false,"showYTransform":false,"showZTransform":false,"modelPath":null,"info":"leftWall"},{"id":"rfwefedsfdsdddd","position":{"x":0,"y":5,"z":-25},"scale":{"x":50,"y":10,"z":0.001},"rotation":{"x":0,"y":0,"z":0},"showXTransform":false,"showYTransform":false,"showZTransform":false,"modelPath":null,"info":"behindWall"}],"fbx_models":[]}', // leere scene daten
        sceneID: idScene,
      }),
    });
    const result = await response.json();

    alert("FS: " + result["result"]);
    return result["result"];
  };

  return (
    <Stack className="newScene">
      <Typography sx={{ alignSelf: "center", fontWeight: "bold" }}>
        Neue Szene erstellen:
      </Typography>
      <Stack
        direction={"row"}
        sx={{ justifyContent: "center", flexGrow: 1, background: "" }}
      >
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
            addSceneToDB().then((scene: Scene) => {
              addSceneToFS(scene.id).then(() => {
                props.setScene(scene);
              });
            });
          }}
        >
          Szene Erstellen
        </Button>
      </Stack>
    </Stack>
  );
};

export default AddScene;
