import SceneModel from "../3D-Objects/SceneModel";
import Camera from "./Camera";
import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import BoxGeoPivot from "../3D-Objects/BoxGeoPivot";
import { Cylinder, Grid, Sky, Stars, Stats } from "@react-three/drei";
import Cylinderqq from "../3D-Objects/CylinderPivot";
import Cube from "../3D-Objects/test";
import { checkPropsForNull } from "../../../utils/checkIfPropIsNull";

export default function Scene(props: {
  controlsRef: React.RefObject<any>;
  models: TypeObjectProps[];
  currentObjectProps: TypeObjectProps;
  perspektive: string;
  setCurrentObjectProps: (props: TypeObjectProps) => void;
  sceneRef: any;
  wallVisibility: boolean;
  testMode: boolean;
  htmlSettings: boolean;
}) {
  // if (props.currentObjectProps) {
  //   const { scene } = useThree();
  //   props.sceneRef.current = scene;
  // }

  if (props.perspektive != null) {
    const { scene } = useThree();
    props.sceneRef.current = scene;
  }

  return props.models ? (
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
        props.perspektive == "normal" ? (
          model.modelPath ? ( // model nur einfügen wenn kein path da ist, weil dann ist es eine wand
            <SceneModel
              visibleInOtherPerspective={model.visibleInOtherPerspective}
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
              color={null}
              info={""}
              name={model.name}
            ></SceneModel>
          ) : model.info == "cylinder" ? (
            <Cylinderqq
              objProps={model}
              key={model.id}
              controlsRef={props.controlsRef}
              isSelected={model.id === props.currentObjectProps?.id}
              camPerspektive={props.perspektive}
              setCurrentObjectProps={props.setCurrentObjectProps}
              testMode={props.testMode}
              htmlSettings={props.htmlSettings}
            ></Cylinderqq>
          ) : (
            <BoxGeoPivot
              key={model.id}
              controlsRef={props.controlsRef}
              isSelected={model.id === props.currentObjectProps?.id}
              camPerspektive={props.perspektive}
              setCurrentObjectProps={props.setCurrentObjectProps}
              objProps={model}
              htmlSettings={props.htmlSettings}
              testMode={props.testMode}
            ></BoxGeoPivot>
          )
        ) : model.visibleInOtherPerspective ? (
          model.modelPath ? ( // model nur einfügen wenn kein path da ist, weil dann ist es eine wand
            <SceneModel
              visibleInOtherPerspective={model.visibleInOtherPerspective}
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
              color={null}
              info={""}
              name={model.name}
            ></SceneModel>
          ) : model.info == "cylinder" ? (
            <Cylinderqq
              objProps={model}
              key={model.id}
              controlsRef={props.controlsRef}
              isSelected={model.id === props.currentObjectProps?.id}
              camPerspektive={props.perspektive}
              setCurrentObjectProps={props.setCurrentObjectProps}
              testMode={props.testMode}
              htmlSettings={props.htmlSettings}
            ></Cylinderqq>
          ) : (
            <BoxGeoPivot
              key={model.id}
              // id={model.id}
              controlsRef={props.controlsRef}
              isSelected={model.id === props.currentObjectProps?.id}
              // editMode={model.editMode}
              // modelPath={model.modelPath}
              // showXTransform={model.showXTransform}
              // showYTransform={model.showYTransform}
              // showZTransform={model.showZTransform}
              // position={model.position}
              // scale={model.scale}
              // rotation={model.rotation}
              camPerspektive={props.perspektive}
              setCurrentObjectProps={props.setCurrentObjectProps}
              objProps={model}
              htmlSettings={props.htmlSettings}
              testMode={props.testMode}
              // info={model.info}
              // color={model.color}
              // testMode={props.testMode}
            ></BoxGeoPivot>
          )
        ) : null
      )}
      {/* ground plane */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / -2, 0, 0]}>
        <planeGeometry args={[1000, 1000, 30, 30]} />
        <meshBasicMaterial
          wireframe
          side={THREE.DoubleSide} /* color={0x000000} */
        />
      </mesh>

      <Cube></Cube>

      {/* <Stats className="stats" /> */}
      {/* Raum */}
      {/* <Room
        height={props.roomDimensions.height}
        width={props.roomDimensions.width}
        depth={props.roomDimensions.depth}
        leftWall={props.wallVisibility.leftWall}
        rightWall={props.wallVisibility.rightWall}
      /> */}
    </>
  ) : null;
}
