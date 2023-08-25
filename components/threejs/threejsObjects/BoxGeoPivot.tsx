import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Html, TransformControls } from "@react-three/drei";
import * as THREE from "three";
import { Vector3 } from "three";
import BoxGeometry from "./BoxGeometryMesh";
import { Button } from "@mui/material";
import HtmlSettings from "./HtmlSettings";
import { checkPropsForNull } from "../../../utils/checkIfPropIsNull";
import { TypeObjectProps } from "../../../pages/threejs/types";

// KOMPONENTE

function BoxGeoPivot(props: {
  objProps: TypeObjectProps;
  isSelected: boolean;
  camPerspektive: string;
  controlsRef: React.RefObject<any>;
  setCurrentObjectProps: (props: TypeObjectProps) => void;
  testMode: boolean;
  htmlSettings: boolean;
  idScene: string;
  reCurrent: MutableRefObject<TypeObjectProps>;
}) {
  // referenz auf das Mesh des FBX-Models
  const refMesh = useRef<THREE.Mesh>(null);
  const tcRef = useRef<any>(null);

  // function
  const setCurrentObj = () => {
    let editModeC = "translate";

    if (props.reCurrent.current.id == props.objProps.id)
      editModeC = props.objProps.editMode;

    // position des Objects als Vektor3
    let vectorPosition: Vector3 = new Vector3();
    refMesh.current?.getWorldPosition(vectorPosition);

    // skalierung des Objects als Vektor3
    let vektorScale: Vector3 = new Vector3();
    refMesh.current?.getWorldScale(vektorScale);

    props.setCurrentObjectProps({
      id: props.objProps.id,
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
      editMode: editModeC as "translate" | "scale" | "rotate", //props.editMode,
      showXTransform: true, //props.showXTransform,
      showYTransform: true, //props.showYTransform,
      showZTransform: true, //props.showZTransform,
      modelPath: null,
      info: props.objProps.info,
      visibleInOtherPerspective: props.objProps.visibleInOtherPerspective,
      name: props.objProps.name,
      color: props.objProps.color ? props.objProps.color : "",
      texture: props.objProps ? props.objProps.texture : null,
      idScene: props.idScene,
    });
  };

  useEffect(() => {
    //alert(props.info + props.color);
  }, []);

  // bedingtes rendern
  // if (checkPropsForNull(props)) {
  //   return null;
  // }

  return props.objProps ? (
    <>
      <TransformControls
        ref={tcRef}
        mode={props.objProps.editMode} //  ? props.objProps.editMode : "scale"
        showX={props.isSelected && props.objProps.showXTransform}
        showY={props.isSelected && props.objProps.showYTransform}
        showZ={props.isSelected && props.objProps.showZTransform}
        scale={[
          props.objProps.scale.x,
          props.objProps.scale.y,
          props.objProps.scale.z,
        ]}
        rotation={[
          props.objProps.rotation.x,
          props.objProps.rotation.y,
          props.objProps.rotation.z,
        ]}
        position={
          new Vector3(
            props.objProps.position.x,
            props.objProps.position.y,
            props.objProps.position.z
          )
        }
        onMouseUp={(e) => {
          //Checks if an event happened or if component just rerendered
          if (e) {
            console.log("mouseup:" + props.objProps.name);
            setCurrentObj();
            console.log("_Kamerarotation frei");

            if (props.camPerspektive === "normal") {
              // kamera rotation nur freigeben wenn camPerspektive normal (== "0") ist, bei othogonaler perpektive soll cam drehen nicht gehen
              props.controlsRef.current.enableRotate = true;
            }
          }
        }}
        onMouseDown={(e) => {
          //Checks if an event happened or if component just rerendered
          if (e) {
            console.log("_Kamerarotation sperren");
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
        <>
          <BoxGeometry
            reCurrent={props.reCurrent}
            ref123={refMesh}
            setCurrentObjProps={props.testMode ? null : setCurrentObj}
            geometrie={{ positionXYZ: [0, 0, 0], scaleXYZ: [1, 1, 1] }}
            testMode={props.testMode}
            color={props.objProps.color}
            htmlSettings={props.htmlSettings}
            setCurentObj={props.setCurrentObjectProps}
            objProps={props.objProps}
          ></BoxGeometry>
        </>
      </TransformControls>
    </>
  ) : null;
}

export default BoxGeoPivot;
