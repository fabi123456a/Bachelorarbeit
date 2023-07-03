import { Divider, IconButton, Stack } from "@mui/material";
import SceneList from "../scenes/sceneList";
import { Scene, User } from "@prisma/client";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BuildIcon from "@mui/icons-material/Build";
import AppsIcon from "@mui/icons-material/Apps";
import Logout from "../login/logout";
import { useState } from "react";

const NavigateBar = (props: {
  setAdminArea: (flag: boolean) => void;
  setSecens: (flag: boolean) => void;
  setSettings: (flag: boolean) => void;
  setActUser: (user: User) => void;
  setLoggedIn: (flag: boolean) => void;
}) => {
  const [activeButton, setActiveButton] = useState("scenes");

  return (
    <Stack className="navigateBar">
      <Stack className="accountImgComtainer">
        <AccountCircleIcon className="iconButton"></AccountCircleIcon>
      </Stack>

      {/* sceneList */}
      <IconButton
        className="iconButton"
        color={activeButton == "scenes" ? "primary" : "default"}
        onClick={() => {
          props.setAdminArea(false);
          props.setSettings(false);
          props.setSecens(true);

          setActiveButton("scenes");
        }}
        title="Scenes"
      >
        <AppsIcon></AppsIcon>
      </IconButton>

      {/* adminarea */}
      <IconButton
        className="iconButton"
        color={activeButton == "adminArea" ? "primary" : "default"}
        onClick={() => {
          props.setSecens(false);
          props.setSettings(false);
          props.setAdminArea(true);

          setActiveButton("adminArea");
        }}
        title="AdminArea"
      >
        <AdminPanelSettingsIcon></AdminPanelSettingsIcon>
      </IconButton>

      {/* settings */}
      <IconButton
        className="iconButton"
        color={activeButton == "settings" ? "primary" : "default"}
        onClick={() => {
          props.setAdminArea(false);
          props.setSecens(false);
          props.setSettings(true);

          setActiveButton("settings");
        }}
        title="Einstellungen"
      >
        <BuildIcon></BuildIcon>
      </IconButton>

      {/* logout */}
      <Logout
        setActUser={props.setActUser}
        setLoggedIn={props.setLoggedIn}
      ></Logout>
    </Stack>
  );
};

export default NavigateBar;
