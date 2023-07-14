import DeleteForever from "@mui/icons-material/DeleteForever";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Scene, SceneMemberShip, User } from "@prisma/client";
import { useEffect, useState } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Checkbox from "@mui/material/Checkbox";
import MembershipEntry from "./membershipEntry";
import AddMember from "../../scenes/sceneDetails/membersList/insertMember";
import fetchData from "../../fetchData";

const MemberListEntry = (props: {
  scene: Scene;
  setScene: (scene: Scene) => void;
  sessionID: string;
  idUser: string;
}) => {
  const [members, setMembers] = useState<
    (SceneMemberShip & {
      user: User;
    })[]
  >(null);
  const [reload, setReload] = useState(0);

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
        <Button
          onClick={() => {
            props.setScene(props.scene);
          }}
        >
          ansehen
        </Button>
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
    </Stack>
  ) : (
    <Typography>lädt...</Typography>
  );
};

export default MemberListEntry;
