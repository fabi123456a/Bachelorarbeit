import { Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Session, User } from "@prisma/client";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export function UserOnlineItem(props: {
  session: Session & {
    user: User;
  };
}) {
  return (
    <>
      <Stack direction={"row"}>
        <FiberManualRecordIcon sx={{ color: "#39e600" }} />
        <Typography>{props.session.user.loginID}</Typography>
      </Stack>
    </>
  );
}
