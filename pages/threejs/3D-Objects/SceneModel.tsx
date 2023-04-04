import { useEffect, useRef, useState } from "react";
import { TransformControls } from "@react-three/drei";
import { ThreeEvent, useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from "three";
import { BoxHelper, Camera, LineBasicMaterial, Vector3 } from "three";
// KOMPONENTE

function SceneModel(
  props: TypeObjectProps & {
    controlsRef: React.RefObject<any>;
    isSelected: boolean;
    camPerspektive: string;
    setCurrentObjectProps: (props: TypeObjectProps) => void;
    testmode: boolean;
  }
) {
  // lädt das FBX-Model
  const fbx: THREE.Group = useLoader(FBXLoader, props.modelPath);

  // referenz auf das Mesh des FBX-Models
  const refMesh = useRef<THREE.Mesh>(null);
  const tcRef = useRef<any>(null);

  // function
  const setCurrentObj = () => {
    if (props.testmode) return;

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
      editMode: "translate", //props.editMode,
      showXTransform: true, //props.showXTransform,
      showYTransform: true, //props.showYTransform,
      showZTransform: true, //props.showZTransform,
      modelPath: props.modelPath,
    });
  };

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
          if (props.testmode) return;
          //Checks if an event happened or if component just rerendered
          if (e) {
            setCurrentObj();
            console.log("Kamerarotation frei");

            if (props.camPerspektive === "normal") {
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
          if (props.testmode) return;
          if (e) {
            e.stopPropagation();
            setCurrentObj();
          }
        }}
      >
        <primitive
          onClick={() => {
            if (props.testmode) return;
            setCurrentObj();
          }}
          ref={refMesh}
          object={fbx.clone(true)}
        ></primitive>
      </TransformControls>
    </>
  );
}

export default SceneModel;
