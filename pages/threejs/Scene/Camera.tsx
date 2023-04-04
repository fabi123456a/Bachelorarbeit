import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { FirstPersonControls } from "@react-three/drei";
import { FlyControls } from "@react-three/drei";
import { Vector3 } from "three";
import { useFrame } from "react-three-fiber";

export function Camera(props: {
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

  return (
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
  );
}

///* enableRotate={props.lockCamera ? false : true} */

{
  /* <OrbitControls
        ref={props.controlsRef}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        position={new Vector3(1, 10, 1)}

      /> */
}

{
  /* <FlyControls
          ref={props.controlsRef}
          movementSpeed={5}
          rollSpeed={0.5}
          dragToLook={true}
          args={[cameraRef.current]}
          position={[10, 30, 20]}
        /> */
}
