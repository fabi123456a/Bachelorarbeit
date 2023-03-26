import { Button, Stack } from "@mui/material";
import { useState } from "react";
import AddUser from "./addUser";
import UsersList from "./usersList";

const AdminArea = () => {
  return (
    <Stack>
      <UsersList></UsersList>
    </Stack>
  );
};

export default AdminArea;

{
  /* <UploadFile></UploadFile>
      <GetFbx></GetFbx>
      <img src="testBild.png"></img> 
      <Main></Main>*/
}
