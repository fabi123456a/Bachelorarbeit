import { Button, Stack, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import UsersList from "../admin/usersList";
import { ModelUser } from "../api/DB_checkPassword";

// einmal in DB und json file to FS
const AddScene = (props: { user: ModelUser }) => {
  const [name, setName] = useState<string>();
  const idFromInsertetS = useRef<string>(null);

  const addSceneToDB = async () => {
    alert(props.user.id);
    const response = await fetch("/api/DB_insertScene", {
      method: "POST",
      body: JSON.stringify({
        idUserCreator: props.user.id,
        name: name,
      }),
    });
    const result = await response.json();

    idFromInsertetS.current = result["result"];

    return result["result"];
  };

  const AddSceneToFS = async () => {
    const response = await fetch("/api/FS_uploadScene", {
      method: "POST",
      body: JSON.stringify({
        jsonData:
          '{"roomDimensions":{"height":7,"width":50,"depth":50},"models":[],"fbx_models":[]}',
        sceneID: idFromInsertetS.current,
      }),
    });
    const result = await response.json();

    alert(result["result"]);
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

          // insert into database
          addSceneToDB().then(() => {
            AddSceneToFS();
          });
        }}
      >
        Szene Erstellen
      </Button>
    </Stack>
  );
};

export default AddScene;
