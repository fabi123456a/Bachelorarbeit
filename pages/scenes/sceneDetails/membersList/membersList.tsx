import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Model, Scene, SceneMemberShip, User } from "@prisma/client";
import { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const MembersList = (props: { members: SceneMemberShip[] }) => {
  //const [scenes, setScenes] = useState<Scene[]>();
  //   const [user, setUser] = useState<User>();

  //   const getAllSceneMembers = async (idScene: string) => {
  //     const membersRequest = await fetch(
  //       "/api/database/Membership/DB_getAllMembersBySceneID",
  //       {
  //         method: "POST",
  //         body: JSON.stringify({
  //           idScene: props.scene.id,
  //         }),
  //       }
  //     );

  //     const members: SceneMemberShip[] = await membersRequest.json();
  //     setMembers(members);
  //   };

  //   useEffect(() => {
  //     getUserFromIdCreator(props.scene.idUserCreater).then((user: User) => {
  //       setUser(user);
  //     });
  //     getSceneModelsCount(props.scene.id);
  //     getAllSceneMembers(props.scene.id);
  //   }, []);

  return props.members ? (
    <Stack className="roundedShadow">
      {props.members.map((member: SceneMemberShip) => {
        return <Typography>{member.idUser}</Typography>;
      })}
    </Stack>
  ) : (
    <Stack>lädt..</Stack>
  );
};

export default MembersList;
