import { Button, Stack, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import UsersList from "../admin/user_OLD/usersList";
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
        // editMode nicht angegeeben??
        jsonData:
          "{" +
          '"models":[{"id":"Boden","position":{"x":0,"y":0,"z":0},"scale":{"x":50,"y":0.001,"z":50},"rotation":{"x":0,"y":0,"z":0}, "visibleInOtherPerspective": true,"showXTransform":false,"showYTransform":false,"showZTransform":false,"modelPath":null,"info":"", "name": "Boden", "color":"#eee"}' +
          ',{"id":"rechte Wand","position":{"x":25,"y":5,"z":0},"scale":{"x":0.001,"y":10,"z":50},"rotation":{"x":0,"y":0,"z":0},"visibleInOtherPerspective": true,"showXTransform":false,"showYTransform":false,"showZTransform":false,"modelPath":null,"info":"", "name": "rechte Wand", "color":"#065623"}' +
          ',{"id":"linke Wand","position":{"x":-25,"y":5,"z":0},"scale":{"x":0.001,"y":10,"z":50},"rotation":{"x":0,"y":0,"z":0},"visibleInOtherPerspective": true,"showXTransform":false,"showYTransform":false,"showZTransform":false,"modelPath":null,"info":"", "name": "linke Wand", "color":"#065623"}' +
          ',{"id":"Wand","position":{"x":0,"y":5,"z":-25},"scale":{"x":50,"y":10,"z":0.001},"rotation":{"x":0,"y":0,"z":0},"visibleInOtherPerspective": true,"showXTransform":false,"showYTransform":false,"showZTransform":false,"modelPath":null,"info":"", "name": "hinten Wand", "color":"#065623"}],"fbx_models":[]}', // leere scene daten
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
        Neu
      </Typography>
      <Stack
        direction={"row"}
        sx={{ justifyContent: "center", flexGrow: 1, background: "" }}
      >
        <TextField
          label={"Name der Leitstelle"}
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
          Erstellen
        </Button>
      </Stack>
    </Stack>
  );
};

export default AddScene;
