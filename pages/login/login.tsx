import { Button, Divider, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { ModelUser } from "../api/DB_checkPassword";

const Home = (props: {
  setLoggedIn: (flag: boolean) => void;
  setActUser: (user: ModelUser) => void;
}) => {
  const [anmeldeID, setAmeldeID] = useState<string>();
  const [password, setPassword] = useState<string>();
  const loggedIn = useRef<boolean>(false);

  // checkt login & pw wenns stim kommt der user zurück
  const checkData = async () => {
    const response = await fetch(
      `/api/DB_checkPassword?user=${anmeldeID}&pw=${password}`
    );
    const result = await response.json();

    return result["result"] as ModelUser;
  };

  return (
    <>
      <Typography>Anmelden</Typography>
      <Divider></Divider>
      <Typography>AnmeldeID</Typography>
      <TextField
        onChange={(event) => {
          setAmeldeID(event.target.value);
        }}
      ></TextField>
      <Typography>Passwort</Typography>
      <TextField
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      ></TextField>
      <Button
        onClick={async () => {
          const actUser = await checkData();

          alert(actUser.id);

          loggedIn.current = actUser != null ? true : false;
          if (loggedIn.current == true) {
            props.setLoggedIn(true);
            props.setActUser(actUser);
          }
        }}
      >
        Login
      </Button>
    </>
  );
};

export default Home;
