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
  const [names, setNames] = useState<string[]>();

  useEffect(() => {
    const getAllSceneNames = async () => {
      const response = await fetch("/api/FS_getAllSceneNames");
      const result = await response.json();

      return result["result"];
    };

    getAllSceneNames().then((files) => {
      alert("LENGTH: " + files);
      //xxx;
      //setNames(files); files müsste eigentlich string[] sein aber ist object
    });
  }, []);

  const getNameFromID = async (id1: string) => {
    const response = await fetch("/api/DB_getSceneNameByID", {
      method: "POST",
      body: JSON.stringify({
        id: id1,
      }),
    });

    const data = (await response.json()) as ModelScene;

    return data["result"];
  };

  return (
    <>
      <Typography>Szene auswählen:</Typography>
      {names
        ? names.map(async (name) => {
            return (
              <Button
                onClick={() => {
                  props.setSceneID(name.split(".")[0]);
                }}
              >
                {name}
                {/* {await getNameFromID(name.split(".")[0])} */}
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
