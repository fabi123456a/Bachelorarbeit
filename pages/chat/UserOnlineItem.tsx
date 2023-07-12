import { Stack, Typography } from "@mui/material";
import { Session, User } from "@prisma/client";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export default function UserOnlineItem(props: {
  session: Session & {
    user: User;
  };
  fontSize: string;
}) {
  return (
    <>
      <Stack direction={"row"}>
        <FiberManualRecordIcon sx={{ color: "#39e600" }} />
        <Typography sx={{ fontSize: props.fontSize }}>
          {props.session ? props.session.id : null}
        </Typography>
      </Stack>
    </>
  );
}
