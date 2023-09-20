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
  setSelectedScene: (scene: Scene) => void; // setzt die ausgewählte Szene für die SceneList
  setScene: (scene: Scene) => void; // setzt die Szene für main, wird aufgerufen wenn man eine Szene Betritt
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

  // lädt den Ersteller
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

  // lädt die anzahl der Objekte in der Szene
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

  // lädt alle Member einer Szene
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

  // speichert beim betreten einer Szene, das der Benutzer gerade in dieser Szene arbeitet
  const insertCurrentSceneEdit = async (): Promise<CurrentSceneEdit> => {
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
      return null;
    }
    return requestedInsert as CurrentSceneEdit;
  };

  // lädt den Ersteller, anzahl Objekte und alle Members der Szene
  useEffect(() => {
    if (!props.scene) return;
    getUserFromIdCreator(props.scene.idUserCreater).then((user: User) => {
      setCreator(user);
    });
    getSceneModelsCount(props.scene.id);
    getAllSceneMembers(props.scene.id);
  }, [reload]);

  // socket io initialisieren
  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();
    };
    socketInitializer();
  }, []);

  return props.scene ? (
    <Stack sx={{ padding: "12px", overflow: "auto", width: "100%" }}>
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

      <Stack
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          sx={{ p: "12px", maxWidth: "80vh" }}
          onClick={async () => {
            // löscht vor dem betreten einer Szene die CurrentSceneEdit-Datensätze eines Benutzers
            await deleteScenEditByUserID(
              props.loggedInUser.id,
              props.sessionID
            );

            // legt während dem betreten einen CurrenSceneEdit-Datensatz an
            const currentWorkingScene: CurrentSceneEdit =
              await insertCurrentSceneEdit();

            // sichert den angelegten CurrenSceneEdit-Datensatz, wird für socket io benötigt (Szenen-synchronisation)
            if (currentWorkingScene) {
              props.currentWorkingScene.current = currentWorkingScene;

              socket.emit("sceneOnEnter", currentWorkingScene);
            }

            // Szene setzen damit es in Main angezeigt wird
            props.setScene(props.scene);
          }}
          variant="contained"
        >
          Konfiguration betreten
        </Button>
      </Stack>

      <Stack
        className="roundedShadow"
        direction={"column"}
        sx={{ background: "white" }}
      >
        <Stack direction={"row"}></Stack>
        <Typography fontWeight={"bold"} sx={{ mb: "2vh" }}>
          Infos:
        </Typography>

        <Stack direction={"row"}>
          <Typography sx={{ minWidth: "15vh" }}>erstellt am:</Typography>
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
    </Stack>
  ) : (
    <Typography>Scene lädt...</Typography>
  );
};

export default SceneDetails;

// löscht veraltete CurrentSceneEdit Datensätze eines Benutzers
export const deleteScenEditByUserID = async (
  userID: string,
  sessionID: string
) => {
  const requestedEdits: CurrentSceneEdit[] = await fetchData(
    userID,
    sessionID,
    "CurrentSceneEdit",
    "select",
    { idUser: userID },
    null,
    null
  );

  if (!requestedEdits) {
    return;
  }

  // requestedEdits.forEach(async (edit: CurrentSceneEdit) => {
  //   await fetchData(
  //     userID,
  //     sessionID,
  //     "CurrentSceneEdit",
  //     "delete",
  //     { id: edit.id },
  //     null,
  //     null
  //   );
  // });

  for (const edit of requestedEdits) {
    await fetchData(
      userID,
      sessionID,
      "CurrentSceneEdit",
      "delete",
      { id: edit.id },
      null,
      null
    );
  }
};
