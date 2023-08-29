import {
  Button,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { User, Scene, SceneMemberShip, CurrentSceneEdit } from "@prisma/client";
import AddScene from "../../components/sceneList/addScne";
import SceneListEntry from "../../components/sceneList/sceneListEntry";
import SceneDetails, {
  deleteScenEditByUserID,
} from "../../components/sceneList/sceneListEntry/sceneDetails";
import { fetchData } from "../../utils/fetchData";
import { deleteOldSceneEdits } from "../../components/threejs/Scene/Scene";
import ReplayIcon from "@mui/icons-material/Replay";
import ErrorIcon from "@mui/icons-material/Error";

const SceneList = (props: {
  setScene: (scene: Scene) => void;
  user: User;
  setActSceneMembership: (mebership: SceneMemberShip) => void;
  sessionID: string;
  currentWorkingScene: MutableRefObject<CurrentSceneEdit>;
}) => {
  const [scenes, setScenes] = useState<Scene[]>();
  const [reload, setReload] = useState<number>();
  const [actScene, setActScene] = useState<Scene>(null);

  const fetchMembershipFromSceneID = async (
    idUser: string,
    idScene: string
  ): Promise<SceneMemberShip> => {
    const requestedMembership: SceneMemberShip[] = await fetchData(
      props.user.id,
      props.sessionID,
      "SceneMemberShip",
      "select",
      {
        idScene: idScene,
        idUser: idUser,
      },
      null,
      null
    );

    if (!requestedMembership) {
      console.log("error while load memberships by scene id");
      return null;
    }

    return requestedMembership[0];
  };

  const fetchSceneMemberShips = async () => {
    const requestMemberships = await fetchData(
      props.user.id,
      props.sessionID,
      "SceneMemberShip",
      "select",
      { idUser: props.user.id },
      null,
      { scene: true }
    );

    if (!requestMemberships) return;

    const extractedScenes = requestMemberships.map(
      (membership) => membership.scene
    );
    // setScenes(extractedScenes);
    return extractedScenes;
  };

  useEffect(() => {
    if (!props.user.read) return;
    deleteOldSceneEdits(props.user.id, props.sessionID).then(() => {
      deleteScenEditByUserID(props.user.id, props.sessionID);
    });
    fetchSceneMemberShips().then((scenes: Scene[]) => setScenes(scenes));
  }, [reload]);

  useEffect(() => {
    if (!props.user.read) return;
    if (!actScene) return;
    fetchMembershipFromSceneID(props.user.id, actScene.id).then(
      (membership: SceneMemberShip) => {
        props.setActSceneMembership(membership);
      }
    );
  }, [actScene]);

  useEffect(() => {
    deleteOldSceneEdits(props.user.id, props.sessionID).then(() => {
      deleteScenEditByUserID(props.user.id, props.sessionID);
    });
  }, []);

  return props.setScene && props.user ? (
    actScene ? (
      <SceneDetails
        sessionID={props.sessionID}
        scene={actScene}
        setSelectedScene={setActScene}
        setScene={props.setScene}
        loggedInUser={props.user}
        currentWorkingScene={props.currentWorkingScene}
      ></SceneDetails>
    ) : (
      <Stack className="sceneList">
        <Stack
          direction={"row"}
          sx={{ justifyContent: "center", alignItems: "center" }}
        >
          <IconButton
            onClick={() => {
              setReload(Math.random());
            }}
          >
            <ReplayIcon></ReplayIcon>
          </IconButton>
        </Stack>
        <Stack className="sceneListEntriesContainer">
          {scenes ? (
            scenes.map((scene: Scene) => {
              return (
                <SceneListEntry
                  reload={reload}
                  sessionID={props.sessionID}
                  user={props.user}
                  key={scene.id}
                  scene={scene}
                  setScene={props.setScene}
                  setReload={setReload}
                  setSelectedScene={setActScene}
                ></SceneListEntry>
              );
            })
          ) : !props.user.read ? (
            <Stack direction={"row"} sx={{ m: "10px" }}>
              <ErrorIcon color="error" sx={{ mr: "8px" }}></ErrorIcon>
              <Typography color={"#d32f2f"}>
                Sie haben keine Berechtigung um die Konfigurationen zu öffnen
              </Typography>
            </Stack>
          ) : (
            <Typography>keine Leitstellen-Konfiguration vorhanden</Typography>
          )}
          {props.user.write ? (
            <AddScene
              sessionID={props.sessionID}
              user={props.user}
              setScene={props.setScene}
              setReload={setReload}
            ></AddScene>
          ) : null}
          <Typography></Typography>
        </Stack>
      </Stack>
    )
  ) : null;
};

export default SceneList;
