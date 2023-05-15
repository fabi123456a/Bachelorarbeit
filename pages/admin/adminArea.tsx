import { Button, Stack } from "@mui/material";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import UsersList from "./user/usersList";
import DatabaseTable from "./data/databaseTable";

const AdminArea = () => {
  // const getData = async () => {
  //   const response = await fetch("/api/database/getAllFromTable", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       table: "users",
  //     }),
  //   });

  //   let result = await response.json();
  //   return result;
  // };

  // const [text, setText] = useState("");

  // useEffect(() => {
  //   const fetchText = async () => {
  //     const response = await fetch("/api/database/getAllFromTable");
  //     const data = await response.text();
  //     setText(data);
  //   };

  //   fetchText();
  // }, []);

  return (
    <Stack>
      {/* <UsersList></UsersList> */}
      <DatabaseTable tableName="xx"></DatabaseTable>
    </Stack>
  );
};

export default AdminArea;
