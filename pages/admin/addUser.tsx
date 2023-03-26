import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import UsersList from "./usersList";

const AddUser = () => {
  const [anmeldeID, setAmeldeID] = useState<string>();
  const [password, setPassword] = useState<string>();

  const addUser = async () => {
    const response = await fetch(
      `/api/insertUser?user=${anmeldeID}&pw=${password}`
    );
    const result = await response.json();

    alert(result["result"]);
    return result["result"];
  };
  return (
    <Stack>
      <TextField
        label={"LoginID"}
        onChange={(event) => {
          setAmeldeID(event.target.value);
        }}
      ></TextField>
      <TextField
        label={"Password"}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      ></TextField>
      <Button
        onClick={async () => {
          await addUser();
        }}
      >
        Hinzufügen
      </Button>
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
