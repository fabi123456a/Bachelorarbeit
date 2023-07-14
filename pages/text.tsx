import { Typography, Stack, Button } from "@mui/material";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import fetchData from "./fetchData";

const Test = () => {
  const [data, setData] = useState<object>({});

  useEffect(() => {}, []);

  return (
    <Stack>
      <Typography>{JSON.stringify(data)}</Typography>
      <Button
        onClick={async () => {
          // const requestedSession = await fetchData(
          //   "SceneMemberShip",
          //   "delete",
          //   { idScene: "a1835266-8c1c-4e95-a147-0328feea2a0e" },
          //   null,
          //   null
          // );
          // if (requestedSession.error) return null;
        }}
      >
        Click ME
      </Button>
    </Stack>
  );
};

export default Test;
