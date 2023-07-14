import {
  Button,
  Divider,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { User, Scene, SceneMemberShip } from "@prisma/client";
import AddScene from "./addScne";
import SceneListEntry from "./sceneListEntry";
import SceneDetails from "./sceneDetails/sceneDetail";
import fetchData from "../fetchData";

const SceneList = (props: {
  setScene: (scene: Scene) => void;
  user: User;
  setActSceneMembership: (mebership: SceneMemberShip) => void;
  sessionID: string;
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
    // const requestedMembership = await fetch(
    //   "/api/database/Membership/DB_getMembershipBySceneID",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({
    //       idUser: idUser,
    //       idScene: idScene,
    //       sessionID: props.sessionID,
    //     }),
    //   }
    // );

    // const mebership = await requestedMembership.json();

    const requestedMembership = await fetchData(
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
    // const requestMemberships = await fetch(
    //   "/api/database/Membership/DB_getAllMembershipsByUserID",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({
    //       idUser: props.user.id,
    //       sessionID: props.sessionID,
    //     }),
    //   }
    // );
    // const memberships: SceneMemberShip &
    //   {
    //     scene: Scene;
    //   }[] = await requestMemberships.json();

    const requestMemberships = await fetchData(
      props.sessionID,
      "SceneMemberShip",
      "select",
      { idUser: props.user.id },
      null,
      { scene: true }
    );

    if (requestMemberships.err) return;

    const extractedScenes = requestMemberships.map(
      (membership) => membership.scene
    );
    setScenes(extractedScenes);
  };

  useEffect(() => {
    getAllSceneMemberships();
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
      ></SceneDetails>
    ) : (
      <Stack className="sceneList">
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
        <Stack className="sceneListEntriesContainer">
          {scenes
            ? scenes.map((scene: Scene) => {
                return (
                  <SceneListEntry
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
          {props.user.readOnly ? null : (
            <AddScene
              sessionID={props.sessionID}
              user={props.user}
              setScene={props.setScene}
              setReload={setReload}
            ></AddScene>
          )}
        </Stack>
      </Stack>
    )
  ) : null;
};

export default SceneList;
