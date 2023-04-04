import SceneModel from "../3D-Objects/SceneModel";
import { Camera } from "./Camera";
import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import BoxGeoPivot from "../3D-Objects/BoxGeoPivot";

export default function Scene(props: {
  controlsRef: React.RefObject<any>;
  models: TypeObjectProps[];
  currentObjectProps: TypeObjectProps;
  perspektive: string;
  setCurrentObjectProps: (props: TypeObjectProps) => void;
  sceneRef: any;
  wallVisibility: boolean;
  testMode: boolean;
}) {
  const { scene } = useThree();
  props.sceneRef.current = scene;

  // gitter raster erstellen & einfügen
  useEffect(() => {
    // TODO: wird das raster mehrmals eingefügt??
    if (props.perspektive == "normal") {
      for (let j: number = -500; j < 500; j += 50) {
        for (let i: number = -500; i < 500; i += 50) {
          const geometry = new THREE.BoxGeometry(50, 0, 50);
          const material = new THREE.MeshBasicMaterial({
            color: 0xf5f5f5,
            wireframe: true,
            opacity: 0.5,
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(i, 0, j);
          scene.add(mesh);
        }
      }
    }
  }, [scene, props.perspektive]);

  return (
    <>
      {/* Canvas nimmt größe von parent container */}
      {/* Canvas richtet eine Szene & Kamera ein */}
      {/* Kamera */}
      <Camera
        controlsRef={props.controlsRef}
        perspektive={props.perspektive}
        testMode={props.testMode}
      ></Camera>
      {/* Licht */}
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} />
      {/* Modelle */}
      {props.models.map((model) =>
        model.modelPath ? ( // model nur einfügen wenn kein path da ist, weil dann ist es eine wand
          <SceneModel
            controlsRef={props.controlsRef}
            key={model.id}
            id={model.id}
            isSelected={model.id === props.currentObjectProps?.id}
            setCurrentObjectProps={props.setCurrentObjectProps}
            editMode={model.editMode}
            modelPath={model.modelPath}
            showXTransform={model.showXTransform}
            showYTransform={model.showYTransform}
            showZTransform={model.showZTransform}
            position={model.position}
            scale={model.scale}
            rotation={model.rotation}
            camPerspektive={props.perspektive}
            testmode={props.testMode}
          ></SceneModel>
        ) : props.wallVisibility ? (
          <BoxGeoPivot
            key={model.id}
            id={model.id}
            controlsRef={props.controlsRef}
            isSelected={model.id === props.currentObjectProps?.id}
            editMode={model.editMode}
            modelPath={model.modelPath}
            showXTransform={model.showXTransform}
            showYTransform={model.showYTransform}
            showZTransform={model.showZTransform}
            position={model.position}
            scale={model.scale}
            rotation={model.rotation}
            camPerspektive={props.perspektive}
            setCurrentObjectProps={props.setCurrentObjectProps}
            info={model.info}
            color={model.color}
            testMode={props.testMode}
          ></BoxGeoPivot>
        ) : null
      )}
      {/* Raum */}
      {/* <Room
        height={props.roomDimensions.height}
        width={props.roomDimensions.width}
        depth={props.roomDimensions.depth}
        leftWall={props.wallVisibility.leftWall}
        rightWall={props.wallVisibility.rightWall}
      /> */}
    </>
  );
}
