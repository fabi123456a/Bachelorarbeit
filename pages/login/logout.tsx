import {
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Scene, User } from "@prisma/client";
import LogoutIcon from "@mui/icons-material/Logout";

const Logout = (props: {
  setLoggedIn: (flag: boolean) => void;
  setActUser: (user: User) => void;
  setScene: (scene: Scene) => void;
}) => {
  return (
    <IconButton className="iconButton">
      <LogoutIcon
        onClick={() => {
          const confirmed = window.confirm(
            "Wollen Sie sich wirklich ausloggen?"
          );

          if (confirmed) {
            props.setActUser(null);
            props.setLoggedIn(null);
            props.setScene(null);
          }
        }}
      ></LogoutIcon>
    </IconButton>
  );
};

export default Logout;
