import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Model, Scene, SceneMemberShip, User } from "@prisma/client";
import { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MembersListEntry from "./membersListEntry";
import AddMember from "./insertMember";

const MembersList = (props: {
  members: (SceneMemberShip & {
    user: User;
  })[];
  scene: Scene;
  setReload: (n: number) => void;
  loggedInUser: User;
  sessionID: string;
}) => {
  return props.members ? (
    <Stack className="roundedShadow membersList">
      <Typography fontWeight={"bold"} sx={{ mb: "2vh" }}>
        Member
      </Typography>
      {props.members.map(
        (
          membership: SceneMemberShip & {
            user: User;
          }
        ) => {
          return (
            <MembersListEntry
              key={membership.id + membership.user.id}
              sessionID={props.sessionID}
              membership={membership}
              setReload={props.setReload}
              scene={props.scene}
              loggedInUser={props.loggedInUser}
            ></MembersListEntry>
          );
        }
      )}
      {props.loggedInUser.id == props.scene.idUserCreater ? (
        <AddMember
          sessionID={props.sessionID}
          scene={props.scene}
          members={props.members}
          setReload={props.setReload}
        ></AddMember>
      ) : null}
    </Stack>
  ) : (
    <Stack>lädt..</Stack>
  );
};

export default MembersList;
