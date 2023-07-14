import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Model, Scene, SceneMemberShip, User } from "@prisma/client";
import { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MembersList from "./membersList/membersList";
import fetchData from "../../fetchData";

const SceneDetails = (props: {
  scene: Scene;
  setSelectedScene: (scene: Scene) => void;
  setScene: (scene: Scene) => void;
  loggedInUser: User;
  ownMembership: SceneMemberShip;
  sessionID: string;
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
    // const response = await fetch("/api/database/User/DB_getUserByID", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     idUser: props.scene.idUserCreater,
    //     sessionID: props.sessionID,
    //   }),
    // });
    // const user: User = await response.json();

    const requestedUser = await fetchData(
      props.sessionID,
      "user",
      "select",
      { id: props.scene.idUserCreater },
      null,
      null
    );

    if (requestedUser.err) return;

    return requestedUser[0];
  };

  const getSceneModelsCount = async (idScene: string) => {
    // const modelsRequest = await fetch(
    //   "/api/database/Model/DB_getAllModelsByID",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({
    //       idScene: props.scene.id,
    //       version: props.scene.newestVersion,
    //       sessionID: props.sessionID,
    //       idUser: props.loggedInUser.id,
    //     }),
    //   }
    // );

    // const models: Model[] = await modelsRequest.json();

    const requestedModels = await fetchData(
      props.sessionID,
      "Model",
      "select",
      { idScene: props.scene.id, version: props.scene.newestVersion },
      null,
      null
    );

    if (requestedModels.err) return;
    setModelsCount(requestedModels.length);
  };

  const getAllSceneMembers = async (idScene: string) => {
    // const membersRequest = await fetch(
    //   "/api/database/Membership/DB_getAllMembersBySceneID",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({
    //       idScene: props.scene.id,
    //       sessionID: props.sessionID,
    //       idUser: props.loggedInUser.id,
    //     }),
    //   }
    // );

    // const members: (SceneMemberShip & {
    //   user: User;
    // })[] = await membersRequest.json();

    const requestedMembers = await fetchData(
      props.sessionID,
      "SceneMemberShip",
      "select",
      { idScene: idScene },
      null,
      { user: true }
    );

    if (requestedMembers.err) return;

    setMembers(requestedMembers);
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
      <Stack direction={"row"} sx={{ alignItems: "center" }}>
        <IconButton
          className="iconButton"
          onClick={() => {
            props.setSelectedScene(null);
          }}
        >
          <ArrowBackIosIcon></ArrowBackIosIcon>
        </IconButton>
        {/* {props.ownMembership?.readOnly ? "readonly" : "lesen/schreiben"} */}
        <Typography variant="h5">
          <b>{props.scene.name}</b>
        </Typography>
      </Stack>

      <Stack className="roundedShadow" direction={"column"}>
        <Stack direction={"row"}></Stack>
        <Typography fontWeight={"bold"} sx={{ mb: "2vh" }}>
          Infos:{" "}
        </Typography>

        <Stack direction={"row"}>
          <Typography sx={{ minWidth: "15vh" }}>ertsellt am:</Typography>
          <Typography>
            {new Date(props.scene.createDate).toLocaleDateString()}
          </Typography>
        </Stack>

        <Stack direction={"row"}>
          <Typography sx={{ minWidth: "15vh" }}>Creator:</Typography>
          <Typography>{creator?.loginID}</Typography>
        </Stack>

        <Stack direction={"row"}>
          <Typography sx={{ minWidth: "15vh" }}>Version:</Typography>
          <Typography>{props.scene.newestVersion}</Typography>
        </Stack>

        <Stack direction={"row"}>
          <Typography sx={{ minWidth: "15vh" }}>Objekte:</Typography>
          <Typography>{modelsCount ? modelsCount : "lädt.."}</Typography>
        </Stack>
      </Stack>

      <MembersList
        sessionID={props.sessionID}
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
        Konfiguration betreten
      </Button>
    </Stack>
  );
};

export default SceneDetails;
