import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { User } from "@prisma/client";
import { SHA256 } from "crypto-js";
import { isEmailValid } from "./register";

const ResetPassword = (props: {
  setLoggedIn: (flag: boolean) => void;
  setRegister: (flag: boolean) => void;
  setResetPw: (flag: boolean) => void;
  // sessionID: string;
}) => {
  const [email, setEmail] = useState<string>("");

  const sendNewPassword = async () => {
    const response = await fetch("/api/mail/sendNewPassword", {
      method: "POST",
      body: JSON.stringify({
        email: email.toLowerCase(),
      }),
    });
    const result = await response.json();

    return result;
  };

  useEffect(() => {}, []);

  return (
    <Stack className="resetPassword">
      <Typography sx={{ mb: "24px" }} fontWeight={"bold"}>
        Passwort zurücksetzen
      </Typography>
      <TextField
        value={email}
        label="E-Mail"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      ></TextField>
      <Button
        color="success"
        onClick={async () => {
          // angegebene E-Mail prüfen
          if (!isEmailValid(email) || !email) {
            alert("Geben Sie eine Gültige E-Mail-Adresse an.");
            return;
          }

          const flag = await sendNewPassword();
          if (!flag) {
            alert("Kein Benutzer mit der E-Mail " + email + " gefunden.");
            return;
          }
          alert(
            "Eine neues Passwort wird an " + email.toLowerCase() + " gesendet."
          );
          setEmail("");
        }}
      >
        neues Passwort anfordern
      </Button>
      <Button
        onClick={() => {
          props.setResetPw(false);
          props.setRegister(false);
          props.setLoggedIn(false);
        }}
      >
        Schliessen
      </Button>
    </Stack>
  );
};

export default ResetPassword;
