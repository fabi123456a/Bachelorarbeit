import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  CurrentSceneEdit,
  Model,
  Scene,
  SceneMemberShip,
  User,
} from "@prisma/client";
import AddScene from "./addScne";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { fetchData } from "../../utils/fetchData";
import CurrentWorkingList from "./sceneListEntry/currentWorkingList";

const SceneListEntry = (props: {
  scene: Scene;
  setScene: (scene: Scene) => void;
  setReload: (i: number) => void;
  user: User;
  setSelectedScene: (scene: Scene) => void;
  sessionID: string;
  reload: number;
}) => {
  // user der die scene ertsellt hat
  const [userCreator, setUserCreator] = useState<User>();
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  const [modelsCount, setModelsCount] = useState<number>(null);
  const [currentEdits, setCurrentEdits] = useState<CurrentSceneEdit[]>(null);

  const deleteSceneFromDB = async () => {
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

    for (const model of requestedModelsFromScene) {
      await fetchData(
        props.user.id,
        props.sessionID,
        "model",
        "delete",
        { id: model.id },
        null,
        null
      );
    }

    const requestDelete = await fetchData(
      props.user.id,
      props.sessionID,
      "scene",
      "delete",
      { id: props.scene.id },
      null,
      null
    );

    if (!requestDelete) return null;
  };

  // neu fecthData
  const getUserFromScene = async () => {
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
    if (!requestedCreator) return;

    //alert(JSON.stringify(requestedCreator));

    setUserCreator(requestedCreator[0]);
  };

  const getSceneModelsCount = async () => {
    const requestedModels = await fetchData(
      props.user.id,
      props.sessionID,
      "model",
      "select",
      {
        idScene: props.scene.id,
      },
      null,
      null
    );

    if (!requestedModels) return;

    setModelsCount(requestedModels.length);
  };

  const getCurrentEdits = async () => {
    const requestedCurrentEdit = await fetchData(
      props.user.id,
      props.sessionID,
      "CurrentSceneEdit",
      "select",
      { idScene: props.scene.id },
      null,
      null
    );

    if (!requestedCurrentEdit) return;

    //alert(requestedCurrentEdit[0]);

    setCurrentEdits(requestedCurrentEdit);
  };

  const removeMembership = async (): Promise<boolean> => {
    const requestRemoveMembership: SceneMemberShip[] = await fetchData(
      props.user.id,
      props.sessionID,
      "SceneMemberShip",
      "select",
      { idScene: props.scene.id, idUser: props.user.id },
      null,
      null
    );

    for (const membership of requestRemoveMembership) {
      await fetchData(
        props.user.id,
        props.sessionID,
        "SceneMemberShip",
        "delete",
        { id: membership.id },
        null,
        null
      );
    }

    if (!requestRemoveMembership) return false;
    return true;
  };

  useEffect(() => {
    getUserFromScene();
    getSceneModelsCount();
    getCurrentEdits();
  }, [props.reload]);

  return props.scene && props.setReload && props.setScene && props.user ? (
    <Stack
      direction={"column"}
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
      <Stack sx={{ flexGrow: 1 }}>
        <Typography sx={{ fontWeight: "bold", fontSize: "16px", mb: "6px" }}>
          {props.scene.name}
        </Typography>

        {userCreator ? (
          mouseOver && false ? (
            <Stack>
              <Typography sx={{ fontSize: "12px" }}>
                <b>Creator:</b> {userCreator ? userCreator.email : "lädt..."}
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
                {userCreator?.email.split("@")[0]}
              </Typography>
              <Typography sx={{ fontSize: "12px" }}>
                {new Date(props.scene.createDate).toLocaleDateString()}
              </Typography>
            </Stack>
          )
        ) : null}
      </Stack>

      {mouseOver ? ( // mouseover
        props.user.write ? (
          props.user.id == props.scene.idUserCreater ? (
            <Button
              size="small"
              color="error"
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
            >
              Löschen
            </Button>
          ) : (
            <Button
              color="error"
              onClick={async (e) => {
                e.stopPropagation();

                let result = confirm(
                  "Wollen Sie wirklich die Scene " +
                    props.scene.name +
                    " entfernen?"
                );

                if (!result) return;

                const flag = await removeMembership();

                if (!flag) {
                  alert(
                    "Das entfernen aus der Konfiguration ist fehlgeschlagen."
                  );
                  return;
                }
                alert("Sie haben die Konfiguration entfernt.");
                props.setReload(Math.random());
              }}
            >
              entfernen
            </Button>
          )
        ) : null
      ) : null}
    </Stack>
  ) : null;
};

export default SceneListEntry;
