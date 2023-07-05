import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Scene, User } from "@prisma/client";
import AddScene from "./addScne";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const SceneListEntry = (props: {
  scene: Scene;
  setScene: (scene: Scene) => void;
  setReload: (i: number) => void;
  user: User;
}) => {
  // user der die scene ertsellt hat
  const [userCreator, setUserCreator] = useState<User>();
  const [mouseOver, setMouseOver] = useState<boolean>(false);

  const deleteSceneFromDB = async () => {
    const response = await fetch("/api/database/Scene/DB_deleteSceneByID", {
      method: "POST",
      body: JSON.stringify({
        idScene: props.scene.id,
      }),
    });

    return response;
  };

  const getUserFromScene = async () => {
    const response = await fetch("/api/database/User/DB_getUserByID", {
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

  return props.scene && props.setReload && props.setScene && props.user ? (
    <Stack
      direction={"row"}
      className="sceneListEntry"
      onClick={() => {
        props.setScene(props.scene);
        //alert(props.scene.id);
      }}
      onMouseEnter={() => {
        setMouseOver(true);
      }}
      onMouseLeave={() => {
        setMouseOver(false);
      }}
    >
      <Stack>
        <Typography sx={{ fontWeight: "bold" }}>{props.scene.name}</Typography>
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
        props.user.readOnly ? null : (
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
                // TODO: delte modles by sceneID

                props.setReload(Math.random());
              }
            }}
          ></DeleteForeverIcon>
        )
      ) : null}
    </Stack>
  ) : null;
};

export default SceneListEntry;
