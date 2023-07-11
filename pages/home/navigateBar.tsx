import {
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import SceneList from "../scenes/sceneList";
import { Scene, User } from "@prisma/client";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BuildIcon from "@mui/icons-material/Build";
import AppsIcon from "@mui/icons-material/Apps";
import Logout from "../login/logout";
import ReorderIcon from "@mui/icons-material/Reorder";
import TextureIcon from "@mui/icons-material/Texture";
import { useState } from "react";

const NavigateBar = (props: {
  setAdminArea: (flag: boolean) => void;
  setSecens: (flag: boolean) => void;
  setSettings: (flag: boolean) => void;
  setActUser: (user: User) => void;
  setLoggedIn: (flag: boolean) => void;
  setFbxModels: (flag: boolean) => void;
  setScene: (scene: Scene) => void;
  setTextures: (flag: boolean) => void;
  user: User;
}) => {
  const [activeButton, setActiveButton] = useState("scenes");

  return (
    <Stack className="navigateBar">
      <Stack className="accountImgComtainer">
        <Typography variant="h5">
          {props.user.loginID.length == 1
            ? props.user.loginID.toUpperCase()
            : props.user.loginID.substring(0, 2).toUpperCase()}
        </Typography>
      </Stack>

      {/* sceneList */}
      <IconButton
        sx={activeButton == "scenes" ? { color: "tan" } : { color: "black" }}
        className="iconButton"
        onClick={() => {
          props.setAdminArea(false);
          props.setSettings(false);
          props.setFbxModels(false);
          props.setSecens(true);

          setActiveButton("scenes");
        }}
        title="Scenes"
      >
        <AppsIcon></AppsIcon>
      </IconButton>

      {/* adminarea */}
      <IconButton
        sx={activeButton == "adminArea" ? { color: "tan" } : { color: "black" }}
        className="iconButton"
        onClick={() => {
          props.setSecens(false);
          props.setSettings(false);
          props.setFbxModels(false);
          props.setTextures(false);

          props.setAdminArea(true);

          setActiveButton("adminArea");
        }}
        title="AdminArea"
      >
        <AdminPanelSettingsIcon></AdminPanelSettingsIcon>
      </IconButton>

      {/* fbxModels */}
      <IconButton
        sx={activeButton == "fbxModels" ? { color: "tan" } : { color: "black" }}
        className="iconButton"
        onClick={() => {
          props.setSecens(false);
          props.setSettings(false);
          props.setAdminArea(false);
          props.setTextures(false);

          props.setFbxModels(true);

          setActiveButton("fbxModels");
        }}
        title="FBX-Models"
      >
        <ReorderIcon></ReorderIcon>
      </IconButton>

      {/* Tetxtures */}
      <IconButton
        sx={activeButton == "textures" ? { color: "tan" } : { color: "black" }}
        className="iconButton"
        onClick={() => {
          props.setSecens(false);
          props.setSettings(false);
          props.setAdminArea(false);
          props.setFbxModels(false);

          props.setTextures(true);

          setActiveButton("textures");
        }}
        title="FBX-Models"
      >
        <TextureIcon></TextureIcon>
      </IconButton>

      {/* settings */}
      <IconButton
        sx={activeButton == "settings" ? { color: "tan" } : { color: "black" }}
        className="iconButton"
        onClick={() => {
          props.setAdminArea(false);
          props.setSecens(false);
          props.setFbxModels(false);
          props.setTextures(false);

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
        setScene={props.setScene}
      ></Logout>
    </Stack>
  );
};

export default NavigateBar;
