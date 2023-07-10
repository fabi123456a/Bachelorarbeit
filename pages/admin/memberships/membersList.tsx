import { Stack, Typography } from "@mui/material";
import { Scene, SceneMemberShip, User } from "@prisma/client";
import MemberListEntry from "./membersListEntry";

const MemberList = (props: {
  scenes: Scene[];
  setScene: (scene: Scene) => void;
}) => {
  return props.scenes ? (
    <Stack className="roundedShadow adminMembersList">
      <Typography
        sx={{ alignSelf: "center", pb: "12px" }}
        fontWeight={"bold"}
        fontSize={"20px"}
      >
        Alle Scenes + Mitglieder
      </Typography>
      {props.scenes.map((scene: Scene) => {
        return (
          <Stack>
            <MemberListEntry scene={scene} setScene={props.setScene}></MemberListEntry>
          </Stack>
        );
      })}
    </Stack>
  ) : (
    <Typography>lädt...</Typography>
  );
};

export default MemberList;
