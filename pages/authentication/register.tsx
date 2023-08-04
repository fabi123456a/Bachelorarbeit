import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { SHA256 } from "crypto-js";
import { User } from "@prisma/client";

const Register = (props: { setRegister: (flag: boolean) => void }) => {
  const [txtLoginID, setTxtLoginID] = useState<string>("");
  const [txtPw, setTxtPw] = useState<string>("");

  const handleBtnRegisterClick = async (
    loginID: string,
    pw: string
  ): Promise<User> => {
    const hashedPw = SHA256(pw).toString();

    const response = await fetch("/api/database/User/register", {
      method: "POST",
      body: JSON.stringify({
        loginID: loginID,
        password: hashedPw,
      }),
    });

    const result = await response.json();
    return result;
  };

  return (
    <Stack className="register">
      <Typography variant="h1">Registrieren</Typography>
      <TextField
        label={"LoginID"}
        variant="filled"
        onChange={(event) => {
          setTxtLoginID(event.target.value);
        }}
        value={txtLoginID}
      ></TextField>
      <TextField
        label={"Passwort"}
        variant="filled"
        onChange={(event) => {
          setTxtPw(event.target.value);
        }}
        value={txtPw}
      ></TextField>
      <Button
        sx={{ mt: "24px" }}
        size="large"
        variant="contained"
        onClick={async () => {
          if (txtLoginID === "" || txtPw == "") {
            alert("LoginID oder PW ist leer, bitte geben sie beides an.");
            return;
          }
          const registeredUser: User = await handleBtnRegisterClick(
            txtLoginID,
            txtPw
          );

          if (!registeredUser) {
            alert("Registrierung fehlgeschlagen");
            return;
          } else {
            alert(
              "Sie haben sich erfolgreich als '" +
                registeredUser.loginID +
                "' registriert"
            );
            props.setRegister(false);
          }
        }}
      >
        Registrieren
      </Button>
      <Button
        onClick={() => {
          props.setRegister(false);
        }}
      >
        Zurück
      </Button>
    </Stack>
  );
};

export default Register;
