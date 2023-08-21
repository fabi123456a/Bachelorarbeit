import DeleteForever from "@mui/icons-material/DeleteForever";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Model, Scene, SceneMemberShip, User } from "@prisma/client";
import { useEffect, useState } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Checkbox from "@mui/material/Checkbox";
import MembershipEntry from "./membershipEntry";
import AddMember from "../../sceneList/sceneListEntry/insertMember";
import { fetchData } from "../../../utils/fetchData";
import VisibilityIcon from "@mui/icons-material/Visibility";

const MemberListEntry = (props: {
  scene: Scene;
  setScene: (scene: Scene) => void;
  sessionID: string;
  idUser: string;
  setReload: (n: number) => void;
}) => {
  const [members, setMembers] = useState<
    (SceneMemberShip & {
      user: User;
    })[]
  >(null);
  const [reload, setReload] = useState(0);

  const deleteSceneFromDB = async (idScene: string) => {
    // sceneMembership laden um an die id zu kommen zum deleten
    const requestDelete13: SceneMemberShip[] = await fetchData(
      props.idUser,
      props.sessionID,
      "SceneMemberShip",
      "select",
      { idScene: props.scene.id },
      null,
      null
    );

    requestDelete13.forEach(async (memberShip: SceneMemberShip) => {
      // memberhips der scene löschen
      const requestDelete12 = await fetchData(
        props.idUser,
        props.sessionID,
        "SceneMemberShip",
        "delete",
        { id: memberShip.id },
        null,
        null
      );
    });

    // alle models der scene laden für die id des models zum deleten
    const requestedModelsFromScene: Model[] = await fetchData(
      props.idUser,
      props.sessionID,
      "model",
      "select",
      { idScene: props.scene.id },
      null,
      null
    );

    requestedModelsFromScene.forEach(async (model: Model) => {
      await fetchData(
        props.idUser,
        props.sessionID,
        "model",
        "delete",
        { id: model.id },
        null,
        null
      );
    });

    // scenedatensatz löschen
    const requestedDeleteScene = await fetchData(
      props.idUser,
      props.sessionID,
      "scene",
      "delete",
      { id: props.scene.id },
      null,
      null
    );
  };
  const getAllSceneMembershipsFromScene = async (idScene: string) => {
    // const requestMemberships = await fetch(
    //   "/api/database/Membership/DB_getAllMembersBySceneID",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({
    //       idScene: idScene,
    //       sessionID: props.sessionID,
    //       idUser: props.idUser,
    //     }),
    //   }
    // );
    // const memberships: (SceneMemberShip & {
    //   user: User;
    // })[] = await requestMemberships.json();

    const requestedMemberships = await fetchData(
      props.idUser,
      props.sessionID,
      "sceneMemberShip",
      "select",
      { idScene: idScene },
      null,
      { user: true }
    );

    if (requestedMemberships.err) return;

    return requestedMemberships;
  };

  useEffect(() => {
    getAllSceneMembershipsFromScene(props.scene.id).then(
      (
        members: (SceneMemberShip & {
          user: User;
        })[]
      ) => setMembers(members)
    );
  }, [reload]);

  return props.scene ? (
    <Stack className="">
      <Stack direction={"row"} sx={{ alignItems: "center" }}>
        <Typography fontWeight={"bold"}>{props.scene.name}</Typography>
        <IconButton
          onClick={() => {
            props.setScene(props.scene);
          }}
        >
          <VisibilityIcon />
        </IconButton>
      </Stack>
      <Typography fontSize={"small"} sx={{ mt: "-1vh", mb: "2vh" }}>
        {"Version: " + props.scene.newestVersion + ".0"}
      </Typography>
      {members ? (
        members.map(
          (
            member: SceneMemberShip & {
              user: User;
            }
          ) => (
            <MembershipEntry
              idUser={props.idUser}
              key={props.scene.id + member.id}
              sessionID={props.sessionID}
              membership={member}
              scene={props.scene}
              setReload={setReload}
            ></MembershipEntry>
          )
        )
      ) : (
        <Typography>lädt..</Typography>
      )}
      <AddMember
        idUser={props.idUser}
        sessionID={props.sessionID}
        members={members}
        scene={props.scene}
        setReload={setReload}
      ></AddMember>

      <Button
        size="small"
        color="error"
        onClick={async () => {
          const confirmed = window.confirm(
            "Willst du die Konfiguration " +
              props.scene.name +
              " wirklich löschen?"
          );

          if (!confirmed) return;

          await deleteSceneFromDB(props.scene.id);
          props.setReload(Math.random());
        }}
      >
        Konfiguration löschen
      </Button>
    </Stack>
  ) : (
    <Typography>lädt...</Typography>
  );
};

export default MemberListEntry;
