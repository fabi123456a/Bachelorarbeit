import { useEffect, useState } from "react";
import { Box, Html } from "@react-three/drei";
import * as THREE from "three";
import { Typography } from "@mui/material";
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
      { id: props.worker.idUser },
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

      socket.on("getUsersCamData", (data) => {
        if (props.worker.id in data) {
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
