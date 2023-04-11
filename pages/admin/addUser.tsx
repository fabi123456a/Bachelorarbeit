import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import UsersList from "./usersList";

const AddUser = (props: { setReload: (i: number) => void }) => {
  const [anmeldeID, setAmeldeID] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const addUser = async () => {
    const response = await fetch(
      `/api/DB_insertUser?user=${anmeldeID}&pw=${password}` // password in body weil sonst kann man das lesen
    );
    const result = await response.json();

    return result;
  };
  return (
    <Stack alignItems={"center"}>
      <Typography>Neuen User hinzufügen</Typography>{" "}
      <Stack direction={"row"}>
        <TextField
          sx={{ margin: "8px" }}
          label={"LoginID"}
          onChange={(event) => {
            setAmeldeID(event.target.value);
          }}
        ></TextField>
        <TextField
          sx={{ margin: "8px" }}
          label={"Password"}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        ></TextField>
        <Button
          onClick={async () => {
            if (anmeldeID != "" && password != "") {
              await addUser();
              props.setReload(Math.random());
            } else {
              alert("AnmeldeID oder Passwort ist leer.");
            }
          }}
        >
          Hinzufügen
        </Button>
      </Stack>
    </Stack>
  );
};

export default AddUser;

{
  /* <UploadFile></UploadFile>
      <GetFbx></GetFbx>
      <img src="testBild.png"></img> 
      <Main></Main>*/
}
