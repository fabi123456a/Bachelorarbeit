import {
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { User } from "@prisma/client";
import LogoutIcon from "@mui/icons-material/Logout";

const Logout = (props: {
  setLoggedIn: (flag: boolean) => void;
  setActUser: (user: User) => void;
}) => {
  return (
    <IconButton className="iconButton">
      <LogoutIcon
        onClick={() => {
          props.setActUser(null);
          props.setLoggedIn(null);
        }}
      ></LogoutIcon>
    </IconButton>
  );
};

export default Logout;
