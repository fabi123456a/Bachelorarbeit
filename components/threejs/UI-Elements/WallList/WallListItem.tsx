import { Button } from "@mui/material";
import { Stack } from "@mui/system";
import { TypeObjectProps } from "../../../../pages/threejs/types";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import io from "socket.io-client";

let socket;

export default function WallListItem(props: {
  name: string;
  data: object;
  addWall: (objProps: TypeObjectProps) => void;
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

  return (
    <Stack style={{ margin: "8px" }} direction={"row"}>
      <Button
        variant="outlined"
        onClick={() => {
          let x: TypeObjectProps = {
            id: uuidv4(),
            editMode: "translate",
            showXTransform: true,
            showYTransform: true,
            showZTransform: true,
            modelPath: null,
            position: { x: 0, y: 0, z: 0 },
            scale: {
              x: props.data[props.name]["x"],
              y: props.data[props.name]["y"],
              z: props.data[props.name]["z"],
            },
            rotation: { x: 0, y: 0, z: 0 },
            color: "#eeeeee", // der boden soll eine andere farbe bekommen
            name: props.name,
            info: "",
            visibleInOtherPerspective: true,
            texture: "",
            idScene: props.idScene,
          };

          props.addWall(x);

          // socket io synchronisieren
          socket.emit("addWall", {
            wall: x,
            idScene: props.idScene,
            idUser: props.idUser,
          });
        }}
      >
        {props.name}
      </Button>
    </Stack>
  );
}
