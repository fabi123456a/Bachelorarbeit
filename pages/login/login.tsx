import { Button, Divider, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ModelUser } from "../api/_models";

const Home = (props: {
  setLoggedIn: (flag: boolean) => void;
  setActUser: (user: ModelUser) => void;
}) => {
  const [txtAnmeldeID, setTxtAmeldeID] = useState<string>("Fabian Thomas");
  const [txtPassword, setTxtPassword] = useState<string>("pw");
  const loggedIn = useRef<boolean>(false);

  // checkt login & pw wenns stim kommt der user zurück
  const checkData = async () => {
    const response = await fetch(
      `/api/DB_checkPassword?user=${txtAnmeldeID}&pw=${txtPassword}`
    );
    const result = await response.json();

    return result;
  };

  // beim start alte sessions löschen
  useEffect(() => {
    const deletOldSessions = async () => {
      await fetch("/api/DB_deleteOldSessions");
    };
    deletOldSessions();
  }, []);

  return (
    <>
      <Typography>Anmelden</Typography>
      <Divider></Divider>
      <Typography>AnmeldeID</Typography>
      <TextField
        onChange={(event) => {
          setTxtAmeldeID(event.target.value);
        }}
        value={txtAnmeldeID}
      ></TextField>
      <Typography>Passwort</Typography>
      <TextField
        onChange={(event) => {
          setTxtPassword(event.target.value);
        }}
        value={txtPassword}
      ></TextField>
      <Button
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
    </>
  );
};

export default Home;
