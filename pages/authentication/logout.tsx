import {
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Scene, SceneMemberShip, User } from "@prisma/client";
import LogoutIcon from "@mui/icons-material/Logout";

const Logout = (props: {
  setLoggedIn: (flag: boolean) => void;
  setActUser: (user: User) => void;
  setScene: (scene: Scene) => void;
  setActSceneMembership: (memberships: SceneMemberShip) => void;
}) => {
  return (
    <IconButton
      className="iconButton"
      sx={{ color: "black" }}
      onClick={() => {
        const confirmed = window.confirm("Wollen Sie sich wirklich ausloggen?");

        if (confirmed) {
          props.setActUser(null);
          props.setLoggedIn(null);
          props.setScene(null);
          props.setActSceneMembership(null);
        }
      }}
    >
      <LogoutIcon></LogoutIcon>
    </IconButton>
  );
};

export default Logout;
