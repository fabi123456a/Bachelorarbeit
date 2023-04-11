import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ModelScene, ModelUser } from "../api/_models";
import AddScene from "./addScne";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const SceneListEntry = (props: {
  scene: ModelScene;
  setScene: (scene: ModelScene) => void;
  setReload: (i: number) => void;
}) => {
  // user der die scene ertsellt hat
  const [userCreator, setUserCreator] = useState<ModelUser>();
  const [mouseOver, setMouseOver] = useState<boolean>(false);

  const deleteSceneFromDB = async () => {
    const response = await fetch("/api/DB_deleteSceneByID", {
      method: "POST",
      body: JSON.stringify({
        idScene: props.scene.id,
      }),
    });

    return response;
  };

  const deleteSceneFromFS = async () => {
    const response = await fetch("/api/FS_deleteSceneByID", {
      method: "POST",
      body: JSON.stringify({
        idScene: props.scene.id,
      }),
    });

    return response;
  };

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
            onClick={async (e) => {
              e.stopPropagation();

              let result = confirm(
                "Wollen Sie wirklich die Scene " +
                  props.scene.name +
                  " löschen?"
              );
              if (result) {
                await deleteSceneFromDB();
                await deleteSceneFromFS();

                props.setReload(Math.random());
              }
            }}
          ></DeleteForeverIcon>
        ) : null}
      </Stack>
      <Divider sx={{ mt: "4px", mb: "4px" }}></Divider>
    </>
  );
};

export default SceneListEntry;
