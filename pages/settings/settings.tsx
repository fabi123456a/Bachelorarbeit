import { Button, Stack, TextField, Typography } from "@mui/material";
import { User } from "@prisma/client";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { Check, ResetTvRounded } from "@mui/icons-material";
import { useState } from "react";
import { fetchData } from "../../utils/fetchData";
import { SHA256 } from "crypto-js";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const Settings = (props: { user: User; sessionID: string }) => {
  const [flag, setFlag] = useState<boolean>(false);
  const [txtPassword, setTxtPassword] = useState<string>("");
  const [flag1, setFlag1] = useState<boolean>(false);
  const [txtDisplayName, setTxtDisplayName] = useState<string>("");

  // speichert ein neues Passwort für einen Benutzer
  const safeNewPassword = async (): Promise<boolean> => {
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

  // ändert den displayName eines Benutzers
  const changeDisplayName = async (): Promise<boolean> => {
    const requestChangeDisplayName = await fetchData(
      props.user.id,
      props.sessionID,
      "user",
      "update",
      { id: props.user.id },
      { displayName: txtDisplayName },
      null
    );

    if (!requestChangeDisplayName) return false;
    return true;
  };

  return props.user ? (
    <Stack sx={{ padding: "12px" }}>
      <Stack direction={"row"}>
        <Stack sx={{ ml: "8px" }}>
          <Stack direction={"row"} sx={{ alignItems: "center" }}>
            <Typography sx={{ minWidth: "120px" }}>E-Mail: </Typography>
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
                  if (!txtPassword) {
                    alert("Geben Sie ein Passwort ein.");
                    return;
                  }
                  const erg = await safeNewPassword();
                  if (!erg) {
                    alert("Das neue Passwort konnte nicht gespeichert werden.");
                    return;
                  }
                  alert("Das neue Passwort wurde gespeichert.");
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
            <Stack>
              <Stack direction={"row"} sx={{ alignItems: "center" }}>
                <Typography sx={{ minWidth: "120px" }}>Passwort: </Typography>
                <Typography fontWeight={"bold"}>
                  {props.user.password}
                </Typography>
                <Button
                  size="small"
                  onClick={() => {
                    setFlag(true);
                  }}
                >
                  ändern
                </Button>
              </Stack>
              <Stack direction="row" sx={{ alignItems: "center" }}>
                <Typography sx={{ minWidth: "120px" }}></Typography>
                <ErrorOutlineIcon sx={{ color: "#9c27b0" }} />
                <Typography sx={{ fontSize: "10px" }} color="#9c27b0">
                  Das Passwort steht hier in verschlüsslter Form.
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack>
      <Stack>
        <Stack direction={"row"} sx={{ ml: "8px", alignItems: "center" }}>
          {flag1 ? (
            <>
              <Typography>Anzeige-Name ändern: </Typography>
              <TextField
                size="small"
                onChange={(e) => {
                  setTxtDisplayName(e.target.value);
                }}
                value={txtDisplayName}
              ></TextField>
              <Button
                onClick={async () => {
                  if (!txtDisplayName) {
                    alert("Geben Sie einen Anzeige-Namen an.");
                    return;
                  }
                  const flag = await changeDisplayName();
                  if (!flag) {
                    alert("Anzeige-Name ändern hat nicht funktioniert");
                    return;
                  }
                  alert("Der Anzeige-Name wurde geändert");
                  setFlag1(false);
                }}
              >
                Ändern
              </Button>
              <Button
                color="error"
                onClick={() => {
                  setFlag1(false);
                }}
              >
                Abbrechen
              </Button>
            </>
          ) : (
            <>
              <Typography sx={{ minWidth: "120px" }}>Anzeige-Name: </Typography>
              <Typography fontWeight={"bold"}>
                {props.user.displayName}
              </Typography>
              <Button
                onClick={() => {
                  setFlag1(true);
                }}
              >
                ändern
              </Button>
            </>
          )}
        </Stack>
      </Stack>

      <Stack direction={"row"} sx={{ ml: "8px" }}>
        <Stack>
          <Typography sx={{ minWidth: "120px", minHeight: "4vh" }}>
            lesen:{" "}
          </Typography>
          <Typography sx={{ minWidth: "120px", minHeight: "4vh" }}>
            schreiben:{" "}
          </Typography>
          <Typography sx={{ minWidth: "120px", minHeight: "4vh" }}>
            löschen:{" "}
          </Typography>
          <Typography sx={{ minWidth: "120px", minHeight: "4vh" }}>
            Admin:{" "}
          </Typography>
        </Stack>
        <Stack>
          {props.user.read ? (
            <CheckIcon color="success" sx={{ minHeight: "4vh" }} />
          ) : (
            <CloseIcon color="error" sx={{ minHeight: "4vh" }} />
          )}
          {props.user.write ? (
            <CheckIcon color="success" sx={{ minHeight: "4vh" }} />
          ) : (
            <CloseIcon color="error" sx={{ minHeight: "4vh" }} />
          )}
          {props.user.delete ? (
            <CheckIcon color="success" sx={{ minHeight: "4vh" }} />
          ) : (
            <CloseIcon color="error" sx={{ minHeight: "4vh" }} />
          )}
          {props.user.isAdmin ? (
            <CheckIcon color="success" sx={{ minHeight: "4vh" }} />
          ) : (
            <CloseIcon color="error" sx={{ minHeight: "4vh" }} />
          )}
        </Stack>
      </Stack>

      <Typography
        sx={{
          mt: "12px",
          border: "1px solid black",
          textAlign: "center",
          background: "white",
        }}
      >
        Änderungen werden nach dem Einloggen sichtbar
      </Typography>
    </Stack>
  ) : (
    <Typography>lädt...</Typography>
  );
};

export default Settings;
