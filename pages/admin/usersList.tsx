import { Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AddUser from "./addUser";

const UsersList = () => {
  const [users, setUsers] = useState();

  useEffect(() => {
    const getAllUsers = async () => {
      const response = await fetch("/api/getAllUser");
      const result = await response.json();

      //alert(result["result"].length);

      setUsers(result["result"]);
    };

    getAllUsers();
  }, []);

  return (
    <Stack>
      {users
        ? (users as []).map((user) => {
            return (
              <Typography>
                {user["id"] + ": " + user["loginID"] + ", " + user["password"]}
              </Typography>
            );
          })
        : null}
      {/* TODO: seite neu laden wenn ein user hinzugefügt wurde */}
      <AddUser></AddUser>
    </Stack>
  );
};

export default UsersList;

{
  /* <UploadFile></UploadFile>
      <GetFbx></GetFbx>
      <img src="testBild.png"></img> 
      <Main></Main>*/
}
