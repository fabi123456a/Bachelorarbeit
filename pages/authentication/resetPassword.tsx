import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { User } from "@prisma/client";
import { SHA256 } from "crypto-js";

const ResetPassword = (props: {
  setLoggedIn: (flag: boolean) => void;
  setRegister: (flag: boolean) => void;
  setResetPw: (flag: boolean) => void;
  // sessionID: string;
}) => {
  const [email, setEmail] = useState<string>("admin");

  const sendNewPassword = async () => {
    const response = await fetch("/api/mail/testMail", {
      method: "POST",
      body: JSON.stringify({
        email: email,
      }),
    });
    const result = await response.json();

    return result;
  };

  useEffect(() => {}, []);

  return (
    <Stack className="resetPassword">
      <Typography>Neues Passwort anfordern</Typography>
      <TextField
        label="E-Mail"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      ></TextField>
      <Button
        color="success"
        onClick={() => {
          alert(
            "Eine neues Passwort wird an " +
              email +
              " gesendet."
          );
          sendNewPassword();
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
        Zurück
      </Button>
    </Stack>
  );
};

export default ResetPassword;
