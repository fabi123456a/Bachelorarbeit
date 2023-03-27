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
    <Stack>
      <Button
        onClick={() => {
          props.setScene(props.scene);
        }}
      >
        {props.scene.name}
      </Button>
      <Typography>
        {userCreator
          ? "Ersteller: " +
            userCreator.loginID +
            ", ertsellt am: " +
            props.scene.createDate
          : null}
      </Typography>
    </Stack>
  );
};

export default SceneListEntry;
