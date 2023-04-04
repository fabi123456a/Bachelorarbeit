import { useEffect, useRef, useState } from "react";
import { TransformControls } from "@react-three/drei";
import * as THREE from "three";
import { Vector3 } from "three";
import BoxGeometry from "./BoxGeometry";

// KOMPONENTE

function BoxGeoPivot(
  props: TypeObjectProps & {
    isSelected: boolean;
    camPerspektive: string;
    controlsRef: React.RefObject<any>;
    setCurrentObjectProps: (props: TypeObjectProps) => void;
    testMode: boolean;
  }
) {
  // referenz auf das Mesh des FBX-Models
  const refMesh = useRef<THREE.Mesh>(null);
  const tcRef = useRef<any>(null);

  // default color
  const defaultColor = "#328da8";
  const highlightColor = "#fffb00";

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
      editMode: "translate", //props.editMode,
      showXTransform: true, //props.showXTransform,
      showYTransform: true, //props.showYTransform,
      showZTransform: true, //props.showZTransform,
      modelPath: null,
      info: props.info,
    });
  };

  // color
  const [color, setColor] = useState<string>(
    props.color ? props.color : defaultColor
  );

  useEffect(() => {
    //alert(props.info + props.color);
  }, []);

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
        <BoxGeometry
          ref123={refMesh}
          onclick={props.testMode ? null : setCurrentObj}
          geometrie={{ positionXYZ: [0, 0, 0], scaleXYZ: [1, 1, 1] }}
          testMode={props.testMode}
        ></BoxGeometry>
      </TransformControls>
    </>
  );
}

export default BoxGeoPivot;
