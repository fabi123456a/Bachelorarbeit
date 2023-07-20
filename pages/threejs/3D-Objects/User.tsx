import { useEffect, useRef, useState } from "react";
import { Box, Cylinder, Html, TransformControls } from "@react-three/drei";
import * as THREE from "three";
import { MeshBasicMaterial, Vector3 } from "three";
import BoxGeometry from "./BoxGeometry";
import { Button, Typography } from "@mui/material";
import HtmlSettings from "./HtmlSettings";
import { checkPropsForNull } from "../../../utils/checkIfPropIsNull";
import { CurrentSceneEdit, User } from "@prisma/client";
import io from "socket.io-client";
import { fetchData } from "../../../utils/fetchData";

let socket;

function User(props: {
  worker: CurrentSceneEdit;
  sessionID: string;
  idUser: string;
}) {
  const [pos, setPos] = useState<{ x: number; y: number; z: number }>(null);
  const [rot, setRot] = useState<{ _x: number; _y: number; _z: number }>(null);
  const [user, setUser] = useState<User>(null);

  const loadUserByID = async () => {
    const requestedUser = await fetchData(
      props.idUser,
      props.sessionID,
      "user",
      "select",
      { id: props.idUser },
      null,
      null
    );

    if (requestedUser.error) return;

    // alert(JSON.stringify(requestedUser));
    return requestedUser;
  };

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
          console.log(
            "rotation: " + JSON.stringify(data[props.worker.id].rotation)
          );
          setPos(data[props.worker.id].position);
          setRot(data[props.worker.id].rotation);
        }
      });
    };
    socketInitializer();
    loadUserByID().then((users: User) => {
      //alert(user.loginID);
      setUser(users[0]);
    });
  }, []);

  return pos ? (
    <>
      <Html position={[pos.x, pos.y, pos.z]}>
        <Typography>{user ? user.loginID : "lädt.."}</Typography>
      </Html>
      <Box
        material={new THREE.MeshStandardMaterial({ color: "red" })}
        position={[pos.x, pos.y, pos.z]}
        rotation={[rot._x, rot._y, rot._z]}
      ></Box>
    </>
  ) : null;
}

export default User;
