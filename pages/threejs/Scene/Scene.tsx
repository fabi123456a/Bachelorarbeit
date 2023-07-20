import SceneModel from "../3D-Objects/SceneModel";
import Camera from "./Camera";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import BoxGeoPivot from "../3D-Objects/BoxGeoPivot";
import Cylinderqq from "../3D-Objects/CylinderPivot";
import { Box, TransformControls } from "@react-three/drei";
import LightModeIcon from "@mui/icons-material/LightMode";
import PointlightPivot from "../../../components/Pointlight";
import { MutableRefObject, useEffect, useState } from "react";
import Cube from "../3D-Objects/test";
import { fetchData } from "../../../utils/fetchData";
import { CurrentSceneEdit } from "@prisma/client";
import User from "../3D-Objects/User";
import io from "socket.io-client";

let socket;

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
  ambientValue: number;
  setCamPos: (pos: number[]) => void;
  setRotCam: (rot: number[]) => void;
  posCam: number[];
  rotCam: number[];
  sessionID: string;
  idUser: string;
  idScene: string;
  refCurrentWorkingScene: MutableRefObject<CurrentSceneEdit>;
}) {
  const [workers, setWorkers] = useState<CurrentSceneEdit[]>(null);
  const [reload, setReload] = useState<number>(null);

  const getWorkers = async () => {
    const requestedWorkers = await fetchData(
      props.idUser,
      props.sessionID,
      "CurrentSceneEdit",
      "select",
      {
        idScene: props.idScene,
      },
      null,
      null
    );

    if (requestedWorkers.error) return null;
    setWorkers(requestedWorkers);
    return requestedWorkers;
  };

  useEffect(() => {
    getWorkers();
  }, [reload]);

  useEffect(() => {
    if (!workers) return;
    //alert(workers.length);
  }, [workers]);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();

      // socket.on("connect", () => {
      //   console.log("connected");
      // });

      socket.on("getUsersCamData", (data) => {
        //setReload(Math.random());
      });

      socket.on("getRefreshWorkers", () => {
        setReload(Math.random());
      });
    };
    socketInitializer();
  }, []);

  return props.models ? (
    <Canvas
      onPointerMissed={() => {
        props.setCurrentObjectProps(null);
      }}
      className="canvas"
      ref={props.sceneRef}
    >
      {/* Canvas nimmt größe von parent container */}
      {/* Canvas richtet eine Szene & Kamera ein */}
      {/* Kamera */}
      <Camera
        refCurrentWorkingScene={props.refCurrentWorkingScene}
        controlsRef={props.controlsRef}
        perspektive={props.perspektive}
        testMode={props.testMode}
        setCamPos={props.setCamPos}
        setRotCam={props.setRotCam}
      ></Camera>

      {workers
        ? workers.map((worker: CurrentSceneEdit) => {
            if (props.refCurrentWorkingScene.current.id == worker.id) return;
            return (
              <User
                worker={worker}
                idUser={props.idUser}
                sessionID={props.sessionID}
              ></User>
            );
          })
        : null}

      {/* Licht */}
      <ambientLight intensity={props.ambientValue} />
      {/* <pointLight position={[10, 10, 10]} /> */}

      <PointlightPivot
        camPerspektive={props.perspektive}
        controlsRef={props.controlsRef}
        isSelected={"licht1" === props.currentObjectProps?.id}
        setCurrentObjectProps={props.setCurrentObjectProps}
      ></PointlightPivot>

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
              texture={null}
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
          ) : model.info == "licht" ? (
            <PointlightPivot
              camPerspektive={props.perspektive}
              controlsRef={props.controlsRef}
              isSelected={model.id === props.currentObjectProps?.id}
              setCurrentObjectProps={props.setCurrentObjectProps}
              objProps={model}
            ></PointlightPivot>
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
              texture={null}
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

      {/* <Cube></Cube> */}

      {/* <Stats className="stats" /> */}
    </Canvas>
  ) : null;
}
