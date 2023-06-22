import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { useState } from "react";
import * as THREE from "three";
import { FlyControls } from "@react-three/drei";
import { checkPropsForNull } from "../../../utils/checkIfPropIsNull";

export default function Camera(props: {
  controlsRef: React.RefObject<any>;
  perspektive: string;
  testMode: boolean;
}) {
  const [camPos, setCamPos] = useState<TypeCamPosition>({
    topDown: new THREE.Vector3(0, 999, 0),
    leftToMid: new THREE.Vector3(-999, 0, 0),
    rightToMid: new THREE.Vector3(999, 0, 0),
    frontal: new THREE.Vector3(0, 0, 999),
  });

  // bedingtes rendern
  if (checkPropsForNull(props)) return null;

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
