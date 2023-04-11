import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ModelScene, ModelUser } from "../api/_models";
import AddScene from "./addScne";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const SceneListEntry = (props: {
  scene: ModelScene;
  setScene: (scene: ModelScene) => void;
}) => {
  // user der die scene ertsellt hat
  const [userCreator, setUserCreator] = useState<ModelUser>();
  const [mouseOver, setMouseOver] = useState<boolean>(false);

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
    <>
      <Stack
        direction={"row"}
        sx={{ margin: "4px" }}
        className="scenListEntry"
        onClick={() => {
          props.setScene(props.scene);
        }}
        onMouseEnter={() => {
          setMouseOver(true);
        }}
        onMouseLeave={() => {
          setMouseOver(false);
        }}
      >
        <Stack>
          <Typography>{props.scene.name}</Typography>
          <Typography>
            {userCreator
              ? "Ersteller: " +
                userCreator.loginID +
                ", ertsellt am: " +
                new Date(props.scene.createDate).toLocaleDateString()
              : null}
          </Typography>
        </Stack>

        {mouseOver ? (
          <DeleteForeverIcon
            color="error"
            sx={{ alignSelf: "center", marginLeft: "auto" }}
            onClick={(e) => {
              alert("löschen " + props.scene.name);
              e.stopPropagation();
            }}
          ></DeleteForeverIcon>
        ) : null}
      </Stack>
      <Divider sx={{ mt: "4px", mb: "4px" }}></Divider>
    </>
  );
};

export default SceneListEntry;
