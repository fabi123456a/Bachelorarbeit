import { useEffect, useRef, useState } from "react";
import { TransformControls } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
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
  }
) {
  // lädt das FBX-Model
  const fbx: THREE.Group = useLoader(FBXLoader, props.modelPath);
  // referenz auf das Mesh des FBX-Models
  const refMesh = useRef<THREE.Mesh>(null);
  const tcRef = useRef<any>(null);
  // function
  const sendCurrentObjectDataToControls = () => {
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
      modelPath: props.modelPath,
      removeBoundingBox: () => removeBoundingBox(),
    });
  };

  // BoundingBox management
  const box = useRef<BoxHelper>(new BoxHelper(fbx, 0xff0000));
  const [boundingBox, setBoundingBox] = useState<boolean>(false);

  const insertBoundingBox = () => {
    box.current.geometry.computeBoundingBox();
    const material = new LineBasicMaterial({ color: 0xff0000 });
    box.current.material = material;
    refMesh?.current?.add(box.current);
  };

  const removeBoundingBox = () => {
    refMesh?.current?.remove(box.current);
    setBoundingBox(false);
  };

  useEffect(() => {
    if (boundingBox) {
      insertBoundingBox();
    }
  });

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
            sendCurrentObjectDataToControls();
            console.log("Kamerarotation frei");

            if (props.camPerspektive === "0") {
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
            sendCurrentObjectDataToControls();
            insertBoundingBox();
          }
        }}
      >
        <group>
          <primitive
            onClick={() => {
              sendCurrentObjectDataToControls();
              insertBoundingBox();
              setBoundingBox(true);
            }}
            onDoubleClick={() => {
              removeBoundingBox();
            }}
            ref={refMesh}
            object={fbx.clone(true)}
          ></primitive>
        </group>
      </TransformControls>
    </>
  );
}

export default SceneModel;
