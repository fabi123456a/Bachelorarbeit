import { Button } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect } from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

let socket;

export default function ModelListItem(props: {
  name: string;
  pfad: string;
  addObject: (pfad: string, info: string, id?: string) => void;
  idScene: string;
  idUser: string;
}) {
  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();
    };
    socketInitializer();
  }, []);

  return props.name ? (
    <Stack style={{ margin: "8px" }} direction={"row"}>
      <Button
        onClick={() => {
          const idModel = uuidv4();
          // TODO: prüfen ob das hinzufügen geklappt hat, und dann erst socket.emit
          props.addObject(
            props.pfad,
            get_model_name(props.pfad.toLowerCase()),
            idModel
          );

          socket.emit("addFbx", {
            modelPath: props.pfad,
            idScene: props.idScene,
            idUser: props.idUser,
            modelID: idModel,
          });
        }}
        className="modelListEntry"
        variant="contained"
      >
        {props.name.toLowerCase().replace(".fbx", "")}
      </Button>
      {/* <Stack
        className="roundedShadow modelListEntry"
        onClick={() => {
          props.addObject(props.pfad, get_model_name(props.pfad.toLowerCase()));
        }}
      >
        {props.name.toLowerCase().replace(".fbx", "")}
      </Stack> */}
    </Stack>
  ) : null;
}

export function get_model_name(path: string): string {
  // Teile den Pfad anhand des Schrägstrichs (/) auf
  const parts = path.split("/");

  // Nimm den letzten Teil des Pfads
  const filename = parts[parts.length - 1];

  // Entferne die Dateierweiterung (.fbx) und gib den verbleibenden Teil zurück
  const modelName = filename.replace(".fbx", "");

  return modelName;
}
