import DeleteForever from "@mui/icons-material/DeleteForever";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Scene, SceneMemberShip, User } from "@prisma/client";
import { useEffect, useState } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Checkbox from "@mui/material/Checkbox";
import MembershipEntry from "./membershipEntry";
import AddMember from "../../scenes/sceneDetails/membersList/insertMember";

const MemberListEntry = (props: {
  scene: Scene;
  setScene: (scene: Scene) => void;
}) => {
  const [members, setMembers] = useState<
    (SceneMemberShip & {
      user: User;
    })[]
  >(null);
  const [reload, setReload] = useState(0);

  const getAllSceneMembershipsFromScene = async (idScene: string) => {
    const requestMemberships = await fetch(
      "/api/database/Membership/DB_getAllMembersBySceneID",
      {
        method: "POST",
        body: JSON.stringify({
          idScene: idScene,
        }),
      }
    );
    const memberships: (SceneMemberShip & {
      user: User;
    })[] = await requestMemberships.json();
    return memberships;
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
