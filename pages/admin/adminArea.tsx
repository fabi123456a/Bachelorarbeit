import { Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { DeleteForeverOutlined } from "@mui/icons-material";
import DatabaseTable from "./databaseTable/databaseTable";
import FbxList from "./fbxModels/fbxList";
import { Scene, User } from "@prisma/client";
import MemberList from "./memberships/sceneMembershipsList";
import ErrorIcon from "@mui/icons-material/Error";
import fetchData from "../fetchData";

const AdminArea = (props: {
  setAdminArea: (flag: boolean) => void;
  user: User;
  setScene: (scene: Scene) => void;
  sessionID: string;
}) => {
  const [loadedScenes, setLoadedScenes] = useState<Scene[]>([]);

  const loadAllScenesFromDB = async () => {
    // const requestetScenes = await fetch("/api/database/Scene/DB_getAllScenes", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     sessionID: props.sessionID,
    //     idUser: props.user.id,
    //   }),
    // });

    // const scenes: Scene[] = await requestetScenes.json();

    // if (!scenes || scenes["error"]) {
    //   //alert("alle scenen laden fehlgeschlagen");
    //   return [];
    // }

    const requestedScenes = await fetchData(
      props.user.id,
      props.sessionID,
      "scene",
      "select",
      {},
      null,
      null
    );

    if (requestedScenes.err) return;

    return requestedScenes;
  };

  useEffect(() => {
    loadAllScenesFromDB().then((scenes: Scene[]) => {
      setLoadedScenes(scenes);
    });
  }, []);

  return props.user ? (
    props.user.isAdmin ? ( //|| true
      <Stack className="adminArea">
        <DatabaseTable
          user={props.user}
          tableName="user"
          showInsert={true}
          sessionID={props.sessionID}
        ></DatabaseTable>
        <Divider orientation="horizontal"></Divider>
        {loadedScenes && !loadedScenes["error"] ? (
          <MemberList
            idUser={props.user.id}
            sessionID={props.sessionID}
            scenes={loadedScenes}
            setScene={props.setScene}
          ></MemberList>
        ) : (
          <Typography>scenen + member werden geladen</Typography>
        )}
      </Stack>
    ) : (
      <Stack direction={"row"} sx={{ m: "10px" }}>
        <ErrorIcon color="error" sx={{ mr: "8px" }}></ErrorIcon>
        <Typography color={"#d32f2f"}>
          Sie haben keine Berechtigung um den Berreich zu öffnen
        </Typography>
      </Stack>
    )
  ) : null;
};

export default AdminArea;
