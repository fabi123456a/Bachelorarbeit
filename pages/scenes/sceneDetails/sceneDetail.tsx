import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Model, Scene, SceneMemberShip, User } from "@prisma/client";
import { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MembersList from "./membersList/membersList";

const SceneDetails = (props: {
  scene: Scene;
  setSelectedScene: (scene: Scene) => void;
  setScene: (scene: Scene) => void;
  loggedInUser: User;
}) => {
  //const [scenes, setScenes] = useState<Scene[]>();
  const [creator, setCreator] = useState<User>();
  const [modelsCount, setModelsCount] = useState<number>();
  const [members, setMembers] = useState<
    (SceneMemberShip & {
      user: User;
    })[]
  >();
  const [reload, setReload] = useState<number>(0);

  const getUserFromIdCreator = async (idCreator: string): Promise<User> => {
    const response = await fetch("/api/database/User/DB_getUserByID", {
      method: "POST",
      body: JSON.stringify({
        idUser: props.scene.idUserCreater,
      }),
    });
    const user: User = await response.json();
    return user;
  };

  const getSceneModelsCount = async (idScene: string) => {
    const modelsRequest = await fetch(
      "/api/database/Model/DB_getAllModelsByID",
      {
        method: "POST",
        body: JSON.stringify({
          idScene: props.scene.id,
          version: props.scene.newestVersion,
        }),
      }
    );

    const models: Model[] = await modelsRequest.json();
    setModelsCount(models.length);
  };

  const getAllSceneMembers = async (idScene: string) => {
    const membersRequest = await fetch(
      "/api/database/Membership/DB_getAllMembersBySceneID",
      {
        method: "POST",
        body: JSON.stringify({
          idScene: props.scene.id,
        }),
      }
    );

    const members: (SceneMemberShip & {
      user: User;
    })[] = await membersRequest.json();
    setMembers(members);
  };

  useEffect(() => {
    getUserFromIdCreator(props.scene.idUserCreater).then((user: User) => {
      setCreator(user);
    });
    getSceneModelsCount(props.scene.id);
    getAllSceneMembers(props.scene.id);
  }, [reload]);
  return (
    <Stack sx={{ padding: "12px" }}>
      <IconButton
        className="iconButton"
        onClick={() => {
          props.setSelectedScene(null);
        }}
      >
        <ArrowBackIosIcon></ArrowBackIosIcon>
      </IconButton>
      <Typography variant="h5">
        Konfiguration: <b>{props.scene.name}</b>
      </Typography>
      <Stack className="roundedShadow">
        <Typography fontWeight={"bold"}>Infos: </Typography>
        <Typography>
          ertsellt am:
          {new Date(props.scene.createDate).toLocaleDateString()}
        </Typography>
        <Typography>Creator: {creator?.loginID}</Typography>
        <Typography>Version: {props.scene.newestVersion}</Typography>
        <Typography>
          Anzahl Objekte: {modelsCount ? modelsCount : "lädt.."}
        </Typography>
      </Stack>

      <MembersList
        members={members}
        scene={props.scene}
        setReload={setReload}
        loggedInUser={props.loggedInUser}
      ></MembersList>

      <Button
        onClick={() => {
          props.setScene(props.scene);
        }}
        variant="contained"
      >
        Konfigurieren
      </Button>
    </Stack>
  );
};

export default SceneDetails;
