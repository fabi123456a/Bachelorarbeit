import { Stack, Typography } from "@mui/material";
import { User } from "@prisma/client";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { Check } from "@mui/icons-material";

const Settings = (props: { user: User }) => {
  return props.user ? (
    <Stack sx={{ padding: "12px" }}>
      <Stack direction={"row"}>
        <Stack>
          <Typography>LoginID: </Typography>
          <Typography>Passwort: </Typography>
        </Stack>
        <Stack sx={{ ml: "8px" }}>
          <Typography fontWeight={"bold"}>{props.user.loginID}</Typography>
          <Typography fontWeight={"bold"}>{props.user.password}</Typography>
        </Stack>
      </Stack>

      <Stack direction={"row"}>
        <Stack>
          <Typography>lesen: </Typography>
          <Typography>schreiben: </Typography>
          <Typography>löschen: </Typography>
        </Stack>
        <Stack sx={{ ml: "8px" }}>
          {props.user.read ? (
            <CheckIcon color="success" />
          ) : (
            <CloseIcon color="warning" />
          )}
          {props.user.write ? (
            <CheckIcon color="success" />
          ) : (
            <CloseIcon color="warning" />
          )}
          {props.user.delete ? (
            <CheckIcon color="success" />
          ) : (
            <CloseIcon color="warning" />
          )}
        </Stack>
      </Stack>
    </Stack>
  ) : (
    <Typography>lädt...</Typography>
  );
};

export default Settings;
