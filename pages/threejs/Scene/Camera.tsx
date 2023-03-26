import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { useState } from "react";
import * as THREE from "three";

export function Camera(props: {
  controlsRef: React.RefObject<any>;
  orthogonal: boolean;
  perspektive: string;
}) {
  const [camPos] = useState<TypeCamPosition>({
    topDown: new THREE.Vector3(0, 999, 0),
    leftToMid: new THREE.Vector3(-999, 0, 0),
    rightToMid: new THREE.Vector3(999, 0, 0),
    frontal: new THREE.Vector3(0, 0, 999),
  });

  return (
    <>
      {props.orthogonal ? (
        <OrthographicCamera
          position={
            props.perspektive === "1"
              ? camPos.topDown
              : props.perspektive === "2"
              ? camPos.frontal
              : props.perspektive === "3"
              ? camPos.leftToMid
              : camPos.rightToMid
          }
          zoom={20}
          makeDefault
        ></OrthographicCamera>
      ) : null}
      <OrbitControls
        ref={
          props.controlsRef
        } /* enableRotate={props.lockCamera ? false : true} */
      />
    </>
  );
}
