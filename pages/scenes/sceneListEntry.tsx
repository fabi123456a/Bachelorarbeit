import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ModelScene, ModelUser } from "../api/_models";
import AddScene from "./addScne";

const SceneListEntry = (props: {
  scene: ModelScene;
  setScene: (scene: ModelScene) => void;
}) => {
  // user der die scene ertsellt hat
  const [userCreator, setUserCreator] = useState<ModelUser>();

  const getUserByID = async (idUser: string) => {
    const response = await fetch("/api/DB_getUserByID", {
      method: "POST",
      body: JSON.stringify({
        idUser: props.scene.idUserCreater,
      }),
    });

    const user = await response.json();

    return user;
  };

  useEffect(() => {
    getUserByID(props.scene.idUserCreater).then((user: ModelUser) => {
      setUserCreator(user);
    });
  }, []);

  return (
    <Stack
      sx={{ margin: "4px" }}
      className="scenListEntry"
      onClick={() => {
        props.setScene(props.scene);
      }}
    >
      <Typography>{props.scene.name}</Typography>
      <Typography>
        {userCreator
          ? "Ersteller: " +
            userCreator.loginID +
            ", ertsellt am: " +
            new Date(props.scene.createDate).toLocaleDateString()
          : null}
      </Typography>
      <Divider></Divider>
    </Stack>
  );
};

export default SceneListEntry;
