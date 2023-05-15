import { Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Session } from "@prisma/client";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export function UserOnlineItem(props: { session: Session }) {
  return (
    <>
      <Stack direction={"row"}>
        <FiberManualRecordIcon sx={{ color: "#39e600" }} />
        <Typography>{props.session.idUser}</Typography>
      </Stack>
    </>
  );
}
