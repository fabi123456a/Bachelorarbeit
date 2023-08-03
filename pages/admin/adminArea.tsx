import { Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { DeleteForeverOutlined } from "@mui/icons-material";
import DatabaseTable from "../../components/adminArea/databaseTable/databaseTable";
import FbxList from "../fbxModels/fbxList";
import { Scene, User } from "@prisma/client";
import MemberList from "../../components/adminArea/memberships/sceneMembershipsList";
import ErrorIcon from "@mui/icons-material/Error";
import { fetchData } from "../../utils/fetchData";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const AdminArea = (props: {
  setAdminArea: (flag: boolean) => void;
  user: User;
  setScene: (scene: Scene) => void;
  sessionID: string;
}) => {
  const [loadedScenes, setLoadedScenes] = useState<Scene[]>([]);
  const [actPage, setActPage] = useState<string>("users");

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
        <Stack
          direction={"row"}
          sx={{
            alignItems: "center",
            justifyContent: "center",
            position: "sticky",
            top: 0,
            left: 0,
            right: 0,
            background: "white",
            padding: "14px",
          }}
        >
          <Button
            onClick={() => {
              setActPage("users");
            }}
            sx={
              actPage == "users"
                ? { boxShadow: "0px 7px 14px 0px rgba(0, 0, 0, 0.5)" }
                : {}
            }
          >
            Benutzer
          </Button>
          <Divider orientation="vertical" sx={{ m: "8px" }}></Divider>
          <Button
            onClick={() => {
              setActPage("scenes");
            }}
            sx={
              actPage == "scenes"
                ? { boxShadow: "0px 7px 14px 0px rgba(0, 0, 0, 0.5)" }
                : {}
            }
          >
            Konfigurationen
          </Button>
        </Stack>
        {actPage == "users" ? (
          <DatabaseTable
            user={props.user}
            tableName="user"
            showInsert={true}
            sessionID={props.sessionID}
          ></DatabaseTable>
        ) : null}

        {actPage == "scenes" ? (
          loadedScenes && !loadedScenes["error"] ? (
            <MemberList
              idUser={props.user.id}
              sessionID={props.sessionID}
              scenes={loadedScenes}
              setScene={props.setScene}
            ></MemberList>
          ) : (
            <Typography>scenen + member werden geladen</Typography>
          )
        ) : null}
        {/* {loadedScenes && !loadedScenes["error"] ? (
          <MemberList
            idUser={props.user.id}
            sessionID={props.sessionID}
            scenes={loadedScenes}
            setScene={props.setScene}
          ></MemberList>
        ) : (
          <Typography>scenen + member werden geladen</Typography>
        )} */}
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
