import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Model, Scene, User } from "@prisma/client";
import AddScene from "./addScne";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const SceneListEntry = (props: {
  scene: Scene;
  setScene: (scene: Scene) => void;
  setReload: (i: number) => void;
  user: User;
  setSelectedScene: (scene: Scene) => void;
}) => {
  // user der die scene ertsellt hat
  const [userCreator, setUserCreator] = useState<User>();
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  const [modelsCount, setModelsCount] = useState<number>(null);

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

  const getSceneModelsCount = async (idScene: string) => {
    const modelsRequest = await fetch(
      "/api/database/Model/DB_getAllModelsByID",
      {
        method: "POST",
        body: JSON.stringify({
          idScene: props.scene.id,
          version: props.scene.newestVersion,
        }),
      }
    );

    const models: Model[] = await modelsRequest.json();
    setModelsCount(models.length);
  };

  useEffect(() => {
    getUserFromScene();
    getSceneModelsCount(props.scene.id);
  }, []);

  return props.scene && props.setReload && props.setScene && props.user ? (
    <Stack
      direction={"row"}
      className="sceneListEntry"
      onClick={() => {
        //props.setScene(props.scene);
        props.setSelectedScene(props.scene);
      }}
      onMouseEnter={() => {
        setMouseOver(true);
      }}
      onMouseLeave={() => {
        setMouseOver(false);
      }}
    >
      <Stack>
        <Typography sx={{ fontWeight: "bold", fontSize: "16px", mb: "6px" }}>
          {props.scene.name}
        </Typography>
        <Typography>
          {userCreator ? (
            mouseOver ? (
              <Stack>
                <Typography sx={{ fontSize: "12px" }}>
                  <b>Creator:</b> {" " + userCreator?.loginID}
                </Typography>
                <Typography sx={{ fontSize: "12px" }}>
                  <b>ertsellt am:</b>{" "}
                  {" " + new Date(props.scene.createDate).toLocaleDateString()}
                </Typography>
                <Typography sx={{ fontSize: "12px" }}>
                  <b>Version:</b> {props.scene.newestVersion}
                </Typography>
                <Typography sx={{ fontSize: "12px" }}>
                  <b>Objekte:</b> {modelsCount}
                </Typography>
              </Stack>
            ) : (
              <Stack>
                <Typography sx={{ fontSize: "12px" }}>
                  {userCreator?.loginID}
                </Typography>
                <Typography sx={{ fontSize: "12px" }}>
                  {new Date(props.scene.createDate).toLocaleDateString()}
                </Typography>
              </Stack>
            )
          ) : null}
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
