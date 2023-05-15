import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Scene, User } from "@prisma/client";
import AddScene from "./addScne";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const SceneListEntry = (props: {
  scene: Scene;
  setScene: (scene: Scene) => void;
  setReload: (i: number) => void;
}) => {
  // user der die scene ertsellt hat
  const [userCreator, setUserCreator] = useState<User>();
  const [mouseOver, setMouseOver] = useState<boolean>(false);

  const deleteSceneFromDB = async () => {
    const response = await fetch("/api/database/scenes/DB_deleteSceneByID", {
      method: "POST",
      body: JSON.stringify({
        idScene: props.scene.id,
      }),
    });

    return response;
  };

  const deleteSceneFromFS = async () => {
    const response = await fetch("/api/filesystem/FS_deleteSceneByID", {
      method: "POST",
      body: JSON.stringify({
        idScene: props.scene.id,
      }),
    });

    return response;
  };

  const getUserFromScene = async () => {
    const response = await fetch("/api/database/user/DB_getUserByID", {
      method: "POST",
      body: JSON.stringify({
        idUser: props.scene.idUserCreater,
      }),
    });

    const user = (await response.json()) as User;

    setUserCreator(user);
    //console.log("-------:: " + ((await response.json()) as ModelUser).loginID);
  };

  useEffect(() => {
    getUserFromScene();
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
          <Typography sx={{ fontWeight: "bold" }}>
            {props.scene.name}
          </Typography>
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
