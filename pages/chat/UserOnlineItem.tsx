import { Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ModelSession } from "../api/_models";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export function UserOnlineItem(props: { session: ModelSession }) {
  return (
    <>
      <Stack direction={"row"}>
        <FiberManualRecordIcon sx={{ color: "#39e600" }} />
        <Typography>{props.session.idUser}</Typography>
      </Stack>
    </>
  );
}
