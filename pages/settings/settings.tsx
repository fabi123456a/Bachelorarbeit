import { Button, Stack, TextField, Typography } from "@mui/material";
import { User } from "@prisma/client";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { Check } from "@mui/icons-material";
import { useState } from "react";
import { fetchData } from "../../utils/fetchData";
import { SHA256 } from "crypto-js";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const Settings = (props: { user: User; sessionID: string }) => {
  const [flag, setFlag] = useState<boolean>(false);
  const [txtPassword, setTxtPassword] = useState<string>("");

  const safeNewPassword = async (): Promise<boolean> => {
    alert(txtPassword);
    const safePW = await fetchData(
      props.user.id,
      props.sessionID,
      "user",
      "update",
      { id: props.user.id },
      { password: SHA256(txtPassword).toString() },
      null
    );

    if (!safePW) return false;
    return true;
  };

  return props.user ? (
    <Stack sx={{ padding: "12px" }}>
      <Stack direction={"row"}>
        <Stack sx={{ ml: "8px" }}>
          <Stack direction={"row"} sx={{ alignItems: "center" }}>
            <Typography sx={{ minWidth: "80px" }}>E-Mail: </Typography>
            <Typography fontWeight={"bold"}>{props.user.email}</Typography>
          </Stack>
          {flag ? (
            <Stack direction={"row"} sx={{ alignItems: "center" }}>
              <Typography sx={{ minWidth: "80px" }}>
                neues Passwort eingeben:
              </Typography>
              <TextField
                label="neues Passwort"
                size="small"
                sx={{ ml: "8px" }}
                onChange={(e) => {
                  setTxtPassword(e.target.value);
                }}
              ></TextField>
              <Button
                size="small"
                onClick={async () => {
                  const erg = await safeNewPassword();
                  if (!erg) {
                    alert("Das neue Passwort konnte nicht gespeichert werden.");
                    return;
                  }
                  alert("Das neue Passwort wurde geändert.");
                  setFlag(false);
                }}
              >
                speichern
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => {
                  setFlag(false);
                }}
              >
                abbrechen
              </Button>
            </Stack>
          ) : (
            <Stack direction={"row"} sx={{ alignItems: "center" }}>
              <Typography sx={{ minWidth: "80px" }}>Passwort: </Typography>
              <Typography fontWeight={"bold"}>{props.user.password}</Typography>
              <Button
                size="small"
                onClick={() => {
                  setFlag(true);
                }}
              >
                ändern
              </Button>
            </Stack>
          )}
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <ErrorOutlineIcon sx={{ color: "#9c27b0" }} />
            <Typography sx={{ fontSize: "10px" }} color="#9c27b0">
              Das Passwort steht hier in verschlüsslter Form.
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Stack direction={"row"} sx={{ ml: "8px" }}>
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
