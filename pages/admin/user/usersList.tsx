import {
  Button,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import AddUser from "./addUser";

const UsersList = () => {
  const [users, setUsers] = useState<User[]>();
  const [reload, setReload] = useState<number>(0);

  const getAllUsers = async () => {
    const response = await fetch("/api/database/user/DB_getAllUser");
    const result = await response.json();

    setUsers(result["result"]);
  };

  // beim start users laden
  useEffect(() => {
    getAllUsers();
  }, []);

  // nach addUser userliste neu laden, damit der neue user drin ist
  useEffect(() => {
    getAllUsers();
  }, [reload]);

  return (
    <Stack>
      <Typography sx={{ alignSelf: "center", pb: "12px" }}>Userlist</Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Passwort</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users
            ? users.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.loginID}</TableCell>
                  <TableCell>{user.password}</TableCell>
                </TableRow>
              ))
            : null}

          {/* <TableRow key={"newUser"}>
            <TableCell>
              <TextField label={"loginID"} />
            </TableCell>
            <TableCell>
              <TextField label={"password"} />
            </TableCell>
          </TableRow>*/}
        </TableBody>
      </Table>
      <Stack sx={{ margin: "24px" }}></Stack>
      <AddUser setReload={setReload}></AddUser>
    </Stack>
  );
};

export default UsersList;
