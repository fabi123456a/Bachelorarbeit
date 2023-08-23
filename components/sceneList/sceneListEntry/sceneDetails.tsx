import { Button, IconButton, Stack, Typography } from "@mui/material";
import {
  CurrentSceneEdit,
  Model,
  Scene,
  SceneMemberShip,
  User,
} from "@prisma/client";
import { MutableRefObject, useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MembersList from "./membersList";
import { fetchData } from "../../../utils/fetchData";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";
import CurrentWorkingList from "./currentWorkingList";

let socket;

const SceneDetails = (props: {
  scene: Scene;
  setSelectedScene: (scene: Scene) => void;
  setScene: (scene: Scene) => void;
  loggedInUser: User;
  sessionID: string;
  currentWorkingScene: MutableRefObject<CurrentSceneEdit>;
}) => {
  const [creator, setCreator] = useState<User>();
  const [modelsCount, setModelsCount] = useState<number>();
  const [members, setMembers] = useState<
    (SceneMemberShip & {
      user: User;
    })[]
  >();
  const [reload, setReload] = useState<number>(0);

  const getUserFromIdCreator = async (idCreator: string): Promise<User> => {
    if (!props.scene) return;

    const requestedUser = await fetchData(
      props.loggedInUser.id,
      props.sessionID,
      "user",
      "select",
      { id: props.scene.idUserCreater },
      null,
      null
    );

    if (!requestedUser) return;

    return requestedUser[0];
  };

  const getSceneModelsCount = async (idScene: string) => {
    const requestedModels = await fetchData(
      props.loggedInUser.id,
      props.sessionID,
      "Model",
      "select",
      { idScene: props.scene.id, version: props.scene.newestVersion },
      null,
      null
    );

    if (!requestedModels) return;
    setModelsCount(requestedModels.length);
  };

  const getAllSceneMembers = async (idScene: string) => {
    const requestedMembers = await fetchData(
      props.loggedInUser.id,
      props.sessionID,
      "SceneMemberShip",
      "select",
      { idScene: idScene },
      null,
      { user: true }
    );

    if (!requestedMembers) return;

    setMembers(requestedMembers);
  };

  // speichert beim betreten einer Szene, das der Benutzer gerade in dieser Szene arbietet
  const insertCurrentSceneEdit = async () => {
    const currentSceneEditData: CurrentSceneEdit = {
      id: uuidv4(),
      entryDate: new Date(),
      idScene: props.scene.id,
      idUser: props.loggedInUser.id,
    };

    const requestedInsert = await fetchData(
      props.loggedInUser.id,
      props.sessionID,
      "CurrentSceneEdit",
      "create",
      {},
      currentSceneEditData,
      null
    );

    if (!requestedInsert) {
      return;
    }
    return requestedInsert;
  };

  // löscht veralteten CurrentSceneEdit DatenSatze
  const deleteScenEditByUserID = async () => {
    const requestedEdits: CurrentSceneEdit[] = await fetchData(
      props.loggedInUser.id,
      props.sessionID,
      "CurrentSceneEdit",
      "select",
      { idUser: props.loggedInUser.id },
      null,
      null
    );

    if (!requestedEdits) {
      return;
    }

    requestedEdits.forEach(async (edit: CurrentSceneEdit) => {
      await fetchData(
        props.loggedInUser.id,
        props.sessionID,
        "CurrentSceneEdit",
        "delete",
        { id: edit.id },
        null,
        null
      );
    });
  };

  useEffect(() => {
    if (!props.scene) return;
    getUserFromIdCreator(props.scene.idUserCreater).then((user: User) => {
      setCreator(user);
    });
    getSceneModelsCount(props.scene.id);
    getAllSceneMembers(props.scene.id);
  }, [reload]);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();
    };
    socketInitializer();
  }, []);

  return props.scene ? (
    <Stack sx={{ padding: "12px" }}>
      <Stack direction={"row"} sx={{ alignItems: "center" }}>
        <IconButton
          className="iconButton"
          onClick={() => {
            props.setSelectedScene(null);
          }}
        >
          <ArrowBackIosIcon></ArrowBackIosIcon>
        </IconButton>
        <Typography variant="h5">
          <b>{props.scene.name}</b>
        </Typography>
      </Stack>

      <Stack className="roundedShadow" direction={"column"}>
        <Stack direction={"row"}></Stack>
        <Typography fontWeight={"bold"} sx={{ mb: "2vh" }}>
          Infos:
        </Typography>

        <Stack direction={"row"}>
          <Typography sx={{ minWidth: "15vh" }}>ertsellt am:</Typography>
          <Typography>
            {new Date(props.scene.createDate).toLocaleDateString()}
          </Typography>
        </Stack>

        <Stack direction={"row"}>
          <Typography sx={{ minWidth: "15vh" }}>Creator:</Typography>
          <Typography>{creator?.email}</Typography>
        </Stack>

        <Stack direction={"row"}>
          <Typography sx={{ minWidth: "15vh" }}>Version:</Typography>
          <Typography>{props.scene.newestVersion}</Typography>
        </Stack>

        <Stack direction={"row"}>
          <Typography sx={{ minWidth: "15vh" }}>Objekte:</Typography>
          <Typography>{modelsCount ? modelsCount : "lädt.."}</Typography>
        </Stack>
      </Stack>

      <MembersList
        sessionID={props.sessionID}
        members={members}
        scene={props.scene}
        setReload={setReload}
        loggedInUser={props.loggedInUser}
      ></MembersList>

      <CurrentWorkingList
        idScene={props.scene.id}
        loggedInUser={props.loggedInUser}
        sessionID={props.sessionID}
      ></CurrentWorkingList>

      <Button
        onClick={async () => {
          props.setScene(props.scene);

          // prüfen ob es schon einen scenedit gibt und dann löschen
          await deleteScenEditByUserID();

          const currentWorkingScene: CurrentSceneEdit =
            await insertCurrentSceneEdit();

          if (currentWorkingScene) {
            props.currentWorkingScene.current = currentWorkingScene;

            socket.emit("sceneOnEnter", currentWorkingScene);
          }
        }}
        variant="contained"
      >
        Konfiguration betreten
      </Button>
    </Stack>
  ) : (
    <Typography>Scene lädt...</Typography>
  );
};

export default SceneDetails;
