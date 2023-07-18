import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { User } from "@prisma/client";
import { fetchData } from "../../utils/fetchData";
import { v4 as uuidv4 } from "uuid";

const Register = (props: { setRegister: (flag: boolean) => void }) => {
  const [txtLoginID, setTxtLoginID] = useState<string>("");
  const [txtPw, setTxtPw] = useState<string>("");

  const handleBtnRegisterClick = async (loginID: string, pw: string) => {
    // const response = await fetch("/api/database/User/DB_insertUser", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     loginID: loginID,
    //     pw: pw,
    //     sessionID: props.sessionID, // TODO:
    //   }),
    // });

    // const result = await response.json();

    const dataUser: User = {
      id: uuidv4(),
      loginID: loginID,
      password: pw,
      delete: false,
      read: false,
      write: false,
      isAdmin: false,
    };

    const requestInsert = await fetchData(
      null,
      null,
      "user",
      "create",
      {},
      dataUser,
      null
    );

    if (requestInsert.err) return;

    return requestInsert;
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
          let erg = handleBtnRegisterClick(txtLoginID, txtPw);

          if (erg == null) alert("Registrierung fehlgeschlagen");
          else {
            alert(
              "Sie haben sich erfolgreich mit der LoginID '" +
                txtLoginID +
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
