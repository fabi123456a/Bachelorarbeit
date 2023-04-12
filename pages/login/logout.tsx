import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ModelUser } from "../api/_models";
import LogoutIcon from "@mui/icons-material/Logout";

const Logout = (props: {
  setLoggedIn: (flag: boolean) => void;
  setActUser: (user: ModelUser) => void;
}) => {
  return (
    <Stack className="logout">
      <LogoutIcon
        onClick={() => {
          props.setActUser(null);
          props.setLoggedIn(null);
        }}
      ></LogoutIcon>
    </Stack>
  );
};

export default Logout;
