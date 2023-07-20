import { useEffect, useRef, useState } from "react";
import { Box, Cylinder, Html, TransformControls } from "@react-three/drei";
import * as THREE from "three";
import { MeshBasicMaterial, Vector3 } from "three";
import BoxGeometry from "./BoxGeometry";
import { Button } from "@mui/material";
import HtmlSettings from "./HtmlSettings";
import { checkPropsForNull } from "../../../utils/checkIfPropIsNull";
import { CurrentSceneEdit } from "@prisma/client";
import io from "socket.io-client";

let socket;

function User(props: { worker: CurrentSceneEdit }) {
  const [pos, setPos] = useState<{ x: number; y: number; z: number }>(null);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();

      // socket.on("connect", () => {
      //   console.log("connected");
      // });

      socket.on("getUsersCamData", (data) => {
        //console.log(JSON.stringify(data));
        if (props.worker.id in data) {
          console.log(JSON.stringify(data[props.worker.id].position));
          setPos(data[props.worker.id].position);
        }
      });
    };
    socketInitializer();
  }, []);
  return pos ? (
    <Box
      material={new THREE.MeshStandardMaterial({ color: "red" })}
      position={[pos.x, pos.y, pos.z]}
    ></Box>
  ) : (
    <Box
      material={new THREE.MeshStandardMaterial({ color: "red" })}
      position={[1, 1, 1]}
    ></Box>
  );
}

export default User;
