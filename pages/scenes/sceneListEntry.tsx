import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Model, Scene, SceneMemberShip, User } from "@prisma/client";
import AddScene from "./addScne";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import fetchData from "../fetchData";

const SceneListEntry = (props: {
  scene: Scene;
  setScene: (scene: Scene) => void;
  setReload: (i: number) => void;
  user: User;
  setSelectedScene: (scene: Scene) => void;
  sessionID: string;
}) => {
  // user der die scene ertsellt hat
  const [userCreator, setUserCreator] = useState<User>();
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  const [modelsCount, setModelsCount] = useState<number>(null);

  const deleteSceneFromDB = async () => {
    // const response = await fetch("/api/database/Scene/DB_deleteSceneByID", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     idScene: props.scene.id,
    //     sessionID: props.sessionID,
    //     idUser: props.user.id,
    //   }),
    // });

    // return response;

    // sceneMembership laden um an die id zu kommen zum deleten
    const requestDelete13 = await fetchData(
      props.user.id,
      props.sessionID,
      "SceneMemberShip",
      "select",
      { idScene: props.scene.id, idUser: props.user.id },
      null,
      null
    );

    // memberhips der scene löschen
    const requestDelete12 = await fetchData(
      props.user.id,
      props.sessionID,
      "SceneMemberShip",
      "delete",
      { id: requestDelete13[0].id },
      null,
      null
    );

    // alle models der scene laden für die id des models zum deleten
    const requestedModelsFromScene: Model[] = await fetchData(
      props.user.id,
      props.sessionID,
      "model",
      "select",
      { idScene: props.scene.id },
      null,
      null
    );

    requestedModelsFromScene.map(async (model: Model) => {
      // models der scene löschen
      const requestDelete1 = await fetchData(
        props.user.id,
        props.sessionID,
        "model",
        "delete",
        { id: model.id },
        null,
        null
      );
    });

    const requestDelete = await fetchData(
      props.user.id,
      props.sessionID,
      "scene",
      "delete",
      { id: props.scene.id },
      null,
      null
    );

    if (requestDelete.error) return null;
  };

  // neu fecthData
  const getUserFromScene = async () => {
    // const response = await fetch("/api/database/User/DB_getUserByID", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     idUser: props.scene.idUserCreater,
    //     sessionID: props.sessionID,
    //   }),
    // });

    // const user = (await response.json()) as User;

    // TODO:
    const requestedCreator = await fetchData(
      props.user.id,
      props.sessionID,
      "user",
      "select",
      { id: props.scene.idUserCreater },
      null,
      null
    );

    //alert(JSON.stringify(requestedCreator));
    if (requestedCreator.err) return;

    //alert(JSON.stringify(requestedCreator));

    setUserCreator(requestedCreator[0]);
  };

  const getSceneModelsCount = async (idScene: string) => {
    // const modelsRequest = await fetch(
    //   "/api/database/Model/DB_getAllModelsByID",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({
    //       idScene: props.scene.id,
    //       version: props.scene.newestVersion,
    //       sessionID: props.sessionID,
    //       idUser: props.user.id,
    //     }),
    //   }
    // );

    // const models: Model[] = await modelsRequest.json();

    const requestedModels = await fetchData(
      props.user.id,
      props.sessionID,
      "model",
      "select",
      {
        idScene: props.scene.id,
        version: props.scene.newestVersion,
      },
      null,
      null
    );

    if (requestedModels.err) return;

    setModelsCount(requestedModels.length);
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

        {userCreator ? (
          mouseOver ? (
            <Stack>
              <Typography sx={{ fontSize: "12px" }}>
                <b>Creator:</b> {userCreator ? userCreator.loginID : "lädt..."}
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
      </Stack>

      {mouseOver ? (
        props.user.write ? (
          props.user.id == props.scene.idUserCreater ? (
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
          ) : null
        ) : null
      ) : null}
    </Stack>
  ) : null;
};

export default SceneListEntry;
