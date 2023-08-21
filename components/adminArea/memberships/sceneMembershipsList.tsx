import { Stack, Typography } from "@mui/material";
import { Scene, SceneMemberShip, User } from "@prisma/client";
import MemberListEntry from "./membersList";

const MemberList = (props: {
  scenes: Scene[];
  setScene: (scene: Scene) => void;
  sessionID: string;
  idUser: string;
  setReload: (n: number) => void;
}) => {
  return props.scenes ? (
    <Stack className="adminMembersList">
      {props.scenes.map((scene: Scene) => {
        return (
          <Stack className="roundedShadow" key={scene.id + props.sessionID}>
            <MemberListEntry
              idUser={props.idUser}
              key={scene.id}
              sessionID={props.sessionID}
              scene={scene}
              setScene={props.setScene}
              setReload={props.setReload}
            ></MemberListEntry>
          </Stack>
        );
      })}
    </Stack>
  ) : (
    <Typography>lädt...</Typography>
  );
};

export default MemberList;
