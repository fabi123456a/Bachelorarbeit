import { Typography, Stack, Button } from "@mui/material";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Test = () => {
  const [data, setData] = useState<object>({});

  const fetchData = async (
    tableName: string,
    action: "select" | "create" | "update",
    where: object,
    data1: object
  ) => {
    try {
      const response = await fetch("/api/database/DB_executeSQL", {
        method: "POST",
        body: JSON.stringify({
          tableName: tableName,
          action: action,
          where: where,
          data: data1,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {}, []);

  return (
    <Stack>
      <Typography>{JSON.stringify(data)}</Typography>
      <Button
        onClick={async () => {
          const data2: User = {
            id: uuidv4(),
            loginID: "EWGVFEWVWE",
            isAdmin: false,
            readOnly: false,
            password: "",
          };
        //   await fetchData("session", "select", {idUser: }, null).then((data) => {
        //     setData(data);
        //   });
        }}
      >
        Click ME
      </Button>
    </Stack>
  );
};

export default Test;
