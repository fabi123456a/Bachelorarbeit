import { useEffect, useRef, useState } from "react";
import { TransformControls } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from "three";
import {
  Box3,
  Box3Helper,
  BoxHelper,
  Camera,
  LineBasicMaterial,
  Vector3,
} from "three";
import BoxGeometry from "./BoxGeometry";

// KOMPONENTE

function BoxGeoPivot(
  props: TypeObjectProps & {
    isSelected: boolean;
    camPerspektive: string;
    controlsRef: React.RefObject<any>;
    setCurrentObjectProps: (props: TypeObjectProps) => void;
  }
) {
  // referenz auf das Mesh des FBX-Models
  const refMesh = useRef<THREE.Mesh>(null);
  const tcRef = useRef<any>(null);

  // function
  const setCurrentObj = () => {
    // position des Objects als Vektor3
    let vectorPosition: Vector3 = new Vector3();
    refMesh.current?.getWorldPosition(vectorPosition);

    // skalierung des Objects als Vektor3
    let vektorScale: Vector3 = new Vector3();
    refMesh.current?.getWorldScale(vektorScale);

    props.setCurrentObjectProps({
      id: props.id,
      position: {
        x: vectorPosition.x,
        y: vectorPosition.y,
        z: vectorPosition.z,
      },
      scale: {
        x: vektorScale.x,
        y: vektorScale.y,
        z: vektorScale.z,
      },
      rotation: {
        x: tcRef.current?.object.rotation.x ?? 0,
        y: tcRef.current?.object.rotation.y ?? 0,
        z: tcRef.current?.object.rotation.z ?? 0,
      },
      editMode: props.editMode,
      showXTransform: props.showXTransform,
      showYTransform: props.showYTransform,
      showZTransform: props.showZTransform,
      modelPath: null,
      removeBoundingBox: () => setColor("#328da8"),
    });
  };

  // color
  const [color, setColor] = useState<string>("#328da8");

  return (
    <>
      <TransformControls
        ref={tcRef}
        mode={props.editMode ? props.editMode : "scale"}
        showX={props.isSelected && props.showXTransform}
        showY={props.isSelected && props.showYTransform}
        showZ={props.isSelected && props.showZTransform}
        scale={[props.scale.x, props.scale.y, props.scale.z]}
        rotation={[props.rotation.x, props.rotation.y, props.rotation.z]}
        position={
          new Vector3(props.position.x, props.position.y, props.position.z)
        }
        onMouseUp={(e) => {
          //Checks if an event happened or if component just rerendered
          if (e) {
            setCurrentObj();
            console.log("Kamerarotation frei");

            if (props.camPerspektive === "0") {
              // kamera rotation nur freigeben wenn camPerspektive normal (== "0") ist, bei othogonaler perpektive soll cam drehen nicht gehen
              props.controlsRef.current.enableRotate = true;
            }
          }
        }}
        onMouseDown={(e) => {
          //Checks if an event happened or if component just rerendered
          if (e) {
            console.log("Kamerarotation sperren");
            props.controlsRef.current.enableRotate = false;
          }
        }}
        onClick={(e) => {
          if (e) {
            e.stopPropagation();
            //insertBoundingBox();
          }
        }}
      >
        {/* <primitive
          onClick={() => {
            //insertBoundingBox();
            //setBoundingBox(true);
          }}
          onDoubleClick={() => {
            //removeBoundingBox();
          }}
          ref={refMesh}
          object={fbx.clone(true)}
        ></primitive> */}
        <BoxGeometry
          ref123={refMesh}
          onclick={setCurrentObj}
          geometrie={{ positionXYZ: [0, 0, 0], scaleXYZ: [1, 1, 1] }}
          color={color}
          setColor={setColor}
        ></BoxGeometry>
      </TransformControls>
    </>
  );
}

export default BoxGeoPivot;
