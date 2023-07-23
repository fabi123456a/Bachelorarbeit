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
import SceneDetails from "../../components/sceneList/sceneListEntry/sceneDetails";
import { fetchData } from "../../utils/fetchData";
import { deleteOldSceneEdits } from "../../components/threejs/Scene/Scene";
import ReplayIcon from "@mui/icons-material/Replay";

const SceneList = (props: {
  setScene: (scene: Scene) => void;
  user: User;
  setActSceneMembership: (mebership: SceneMemberShip) => void;
  sessionID: string;
  currentWorkingScene: MutableRefObject<CurrentSceneEdit>;
}) => {
  const [scenes, setScenes] = useState<Scene[]>();
  const [reload, setReload] = useState<number>();
  const [cmboBox, setCmboBox] = useState<string>("-1"); // -1 wenn alle
  const [actScene, setActScene] = useState<Scene>(null);
  const [sceneMembership, setSceneMembership] = useState<SceneMemberShip>(null);
  const [memberships, setMemberships] = useState<
    SceneMemberShip &
      {
        scene: Scene;
      }[]
  >(null);

  const getMembershipFromSceneID = async (idUser: string, idScene: string) => {
    const requestedMembership = await fetchData(
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

    if (requestedMembership.error) return null;

    return requestedMembership;
  };

  const getAllSceneMemberships = async () => {
    const requestMemberships = await fetchData(
      props.user.id,
      props.sessionID,
      "SceneMemberShip",
      "select",
      { idUser: props.user.id },
      null,
      { scene: true }
    );

    if (!requestMemberships || requestMemberships.err) return;

    const extractedScenes = requestMemberships.map(
      (membership) => membership.scene
    );
    setScenes(extractedScenes);
  };

  useEffect(() => {
    deleteOldSceneEdits(props.user.id, props.sessionID).then(() => {
      getAllSceneMemberships();
    });
  }, [reload]);

  useEffect(() => {
    if (!actScene) return;
    getMembershipFromSceneID(props.user.id, actScene.id).then(
      (membership: SceneMemberShip) => {
        setSceneMembership(membership);
        props.setActSceneMembership(membership);
      }
    );
  }, [actScene]);

  return props.setScene && props.user ? (
    actScene ? (
      <SceneDetails
        sessionID={props.sessionID}
        scene={actScene}
        setSelectedScene={setActScene}
        setScene={props.setScene}
        loggedInUser={props.user}
        ownMembership={sceneMembership}
        currentWorkingScene={props.currentWorkingScene}
      ></SceneDetails>
    ) : (
      <Stack className="sceneList">
        <Stack
          direction={"row"}
          sx={{ justifyContent: "center", alignItems: "center" }}
        >
          <Select
            label="Sortierung"
            onChange={(e) => {
              setCmboBox(e.target.value as string);
            }}
            value={cmboBox}
            size="small"
            className="select"
          >
            <MenuItem value={props.user.id}>nur meine</MenuItem>
            <MenuItem value={"-1"}>alle</MenuItem>
          </Select>
          <IconButton
            onClick={() => {
              setReload(Math.random());
            }}
          >
            <ReplayIcon></ReplayIcon>
          </IconButton>
        </Stack>
        <Stack className="sceneListEntriesContainer">
          {scenes
            ? scenes.map((scene: Scene) => {
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
            : "keine Leitstellen-Konfiguration vorhanden"}
          {/* bei readonly user ausblenden */}
          {props.user.write || true ? (
            <AddScene
              sessionID={props.sessionID}
              user={props.user}
              setScene={props.setScene}
              setReload={setReload}
            ></AddScene>
          ) : null}
        </Stack>
      </Stack>
    )
  ) : null;
};

export default SceneList;
