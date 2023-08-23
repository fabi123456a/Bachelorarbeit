import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { MutableRefObject, useEffect, useState } from "react";
import * as THREE from "three";
import { FlyControls } from "@react-three/drei";
import { checkPropsForNull } from "../../../utils/checkIfPropIsNull";
import io from "socket.io-client";
import { CurrentSceneEdit } from "@prisma/client";
import { TypeCamPosition } from "../../../pages/threejs/types";

let socket;

export default function Camera(props: {
  controlsRef: React.RefObject<any>;
  perspektive: string;
  testMode: boolean;
  setCamPos: (pos: number[]) => void;
  setRotCam: (rot: number[]) => void;
  refCurrentWorkingScene: MutableRefObject<CurrentSceneEdit>;
}) {
  const [camPos, setCamPos] = useState<TypeCamPosition>({
    topDown: new THREE.Vector3(0, 999, 0),
    leftToMid: new THREE.Vector3(-999, 0, 0),
    rightToMid: new THREE.Vector3(999, 0, 0),
    frontal: new THREE.Vector3(0, 0, 999),
  });

  // bedingtes rendern
  if (checkPropsForNull(props)) return null;

  useEffect(() => {
    props.controlsRef.current.addEventListener("change", (event) => {
      const pos = props.controlsRef.current.object.position;
      props.setCamPos([pos.x, pos.y, pos.z]);

      const rot = props.controlsRef.current.object.rotation;
      props.setRotCam([rot.x, rot.y, rot.z]);

      socket.emit(
        "setUserCamData",
        props.refCurrentWorkingScene.current
          ? {
              [props.refCurrentWorkingScene.current.id]: {
                position: pos,
                rotation: rot,
              },
            }
          : null
      );
    });
  }, []);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();

      // socket.on("connect", () => {
      //   console.log("connected");
      // });
    };
    socketInitializer();
  }, []);

  return props.controlsRef ? (
    <>
      {props.testMode ? (
        <FlyControls
          ref={props.controlsRef}
          movementSpeed={8}
          rollSpeed={0.5}
          dragToLook={true}
          position={[10, 30, 20]}
          makeDefault
        />
      ) : props.perspektive == "normal" ? (
        <OrbitControls
          ref={props.controlsRef}
          /* enableRotate={props.lockCamera ? false : true} */
        />
      ) : (
        <OrthographicCamera // TODO: warum guckt die kamera immer in die mitte und nicht nach vorne?
          position={
            props.perspektive === "topdown"
              ? camPos.topDown
              : props.perspektive === "frontal"
              ? camPos.frontal
              : props.perspektive === "leftmid"
              ? camPos.leftToMid
              : camPos.rightToMid
          }
          zoom={20}
          makeDefault // TODO:  glaube durch das make deafult wird die oritcontrol cam überschrieben
        >
          <OrbitControls ref={props.controlsRef} enableRotate={false} />
        </OrthographicCamera>
      )}
    </>
  ) : null;
}
