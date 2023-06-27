import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { User } from "@prisma/client";

const Home = (props: {
  setLoggedIn: (flag: boolean) => void;
  setActUser: (user: User) => void;
  setRegister: (flag: boolean) => void;
}) => {
  const [txtLoginID, setTxtLoginID] = useState<string>("");
  const [txtPassword, setTxtPassword] = useState<string>("");
  const loggedIn = useRef<boolean>(false);

  const handleBtnRegisterClick = () => {
    props.setRegister(true);
  };

  // checkt login & pw wenns stim kommt der user zurück
  const checkData = async () => {
    // const response1 = await fetch(
    //   `/api/database/User/DB_checkPassword?user=${txtAnmeldeID}&pw=${txtPassword}` // TODO: in body packen
    // );

    const response = await fetch("/api/database/User/DB_checkPassword", {
      method: "POST",
      body: JSON.stringify({
        loginID: txtLoginID,
        pw: txtPassword,
      }),
    });
    const result = await response.json();

    return result;
  };

  // beim start alte sessions löschen
  useEffect(() => {
    const deletOldSessions = async () => {
      await fetch("/api/database/Session/DB_deleteOldSessions");
    };
    deletOldSessions();
  }, []);

  return (
    <Stack className="login">
      <Typography sx={{ fontWeight: "bold", fontSize: "22px" }}>
        AnmeldeID
      </Typography>
      <TextField
        variant="filled"
        onChange={(event) => {
          setTxtLoginID(event.target.value);
        }}
        value={txtLoginID}
      ></TextField>
      <Typography sx={{ fontWeight: "bold", fontSize: "22px", mt: "24px" }}>
        Passwort
      </Typography>
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
    </Stack>
  );
};

export default Home;
