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

const SceneList = (props: {
  setScene: (scene: Scene) => void;
  user: User;
  setActSceneMembership: (mebership: SceneMemberShip) => void;
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

  // const getAllScenes = async () => {
  //   if (cmboBox == "-1") {
  //     const response = await fetch("/api/database/Scene/DB_getAllSceneNames", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         id: null,
  //       }),
  //     });
  //     const result: Scene[] = await response.json();
  //     return result;
  //   } else {
  //     const response = await fetch("/api/database/Scene/DB_getAllSceneNames", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         id: cmboBox,
  //       }),
  //     });
  //     const result: Scene[] = await response.json();
  //     return result;
  //   }
  // };

  const getMembershipFromSceneID = async (idUser: string, idScene: string) => {
    const requestedMembership = await fetch(
      "/api/database/Membership/DB_getMembershipBySceneID",
      {
        method: "POST",
        body: JSON.stringify({
          idUser: idUser,
          idScene: idScene,
        }),
      }
    );

    const mebership = await requestedMembership.json();

    return mebership;
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

  useEffect(() => {
    // getAllScenes().then((scenes) => {
    //   setScenes(scenes);
    // });
  }, [reload, cmboBox]);

  const getAllSceneMemberships = async () => {
    const requestMemberships = await fetch(
      "/api/database/Membership/DB_getAllMembershipsByUserID",
      {
        method: "POST",
        body: JSON.stringify({
          idUser: props.user.id,
        }),
      }
    );
    const memberships: SceneMemberShip &
      {
        scene: Scene;
      }[] = await requestMemberships.json();
    //setMemberships(memberships);

    const extractedScenes = memberships.map((membership) => membership.scene);
    setScenes(extractedScenes);
  };

  return props.setScene && props.user ? (
    actScene ? (
      <SceneDetails
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
                    user={props.user}
                    key={scene.id}
                    scene={scene}
                    setScene={props.setScene}
                    setReload={setReload}
                    setSelectedScene={setActScene}
                  ></SceneListEntry>
                );
              })
            : "noch keine Leitstellen-Konfiguration vorhanden. Erstellen Sie die erste Konfiguration..."}
          {/* bei readonly user ausblenden */}
          {props.user.readOnly ? null : (
            <AddScene
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
