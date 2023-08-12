import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { User } from "@prisma/client";
import { SHA256 } from "crypto-js";

const Home = (props: {
  setLoggedIn: (flag: boolean) => void;
  setActUser: (user: User) => void;
  setRegister: (flag: boolean) => void;
  setResetPw: (flag: boolean) => void;
  // sessionID: string;
}) => {
  const [txtLoginID, setTxtLoginID] = useState<string>("admin");
  const [txtPassword, setTxtPassword] = useState<string>("ADMIN");
  const loggedIn = useRef<boolean>(false);

  const handleBtnRegisterClick = () => {
    props.setRegister(true);
  };

  // checkt login & pw wenns stim kommt der user zurück
  const checkData = async () => {
    const response = await fetch("/api/database/User/DB_checkPassword", {
      method: "POST",
      body: JSON.stringify({
        loginID: txtLoginID,
        pw: SHA256(txtPassword).toString(),
      }),
    });
    const result = await response.json();

    return result;

    // const requestCheckLogin = await fetchData(
    //   "scene",
    //   "create",
    //   {},
    //   sceneData,
    //   null
    // );

    // if (requestInsertScene.error) return null;
  };

  // beim start alte sessions löschen
  useEffect(() => {
    const deletOldSessions = async () => {
      await fetch("/api/database/Session/DB_deleteOldSessions", {
        method: "POST",
        body: JSON.stringify({
          // sessionID: props.sessionID, // TODO:
        }),
      });
    };
    deletOldSessions();
  }, []);

  return (
    <Stack className="loginContainer">
      <Stack className="login">
        <Typography className="txtStyle1">E-Mail</Typography>
        <TextField
          variant="filled"
          onChange={(event) => {
            setTxtLoginID(event.target.value);
          }}
          value={txtLoginID}
        ></TextField>
        <Typography className="txtStyle1">Passwort</Typography>
        <TextField
          variant="filled"
          onChange={(event) => {
            setTxtPassword(event.target.value);
          }}
          value={txtPassword}
        ></TextField>
        <Button
          sx={{ mt: "24px" }}
          size="large"
          variant="contained"
          onClick={async () => {
            const user = await checkData();

            loggedIn.current = user != null ? true : false;
            if (loggedIn.current == true) {
              props.setLoggedIn(true);
              props.setActUser(user);
            } else {
              alert("anmeldeID oder Passwortr ist nicht korrekt.");
            }
          }}
        >
          Login
        </Button>
        <Button onClick={handleBtnRegisterClick}>Register</Button>
        <Button
          sx={{ fontSize: "10px" }}
          onClick={() => {
            props.setLoggedIn(false);
            props.setRegister(false);
            props.setResetPw(true);
          }}
        >
          Passwort vergessen
        </Button>
      </Stack>
    </Stack>
  );
};

export default Home;
