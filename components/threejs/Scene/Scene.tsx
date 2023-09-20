import Camera from "./Camera";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
// import BoxGeoPivot from "../3D-Objects/BoxGeoPivot";
// import Cylinderqq from "../3D-Objects/CylinderPivot";
import { Box, TransformControls } from "@react-three/drei";
import LightModeIcon from "@mui/icons-material/LightMode";
import PointlightPivot from "../threejsObjects/Pointlight";
import { MutableRefObject, useEffect, useState, useRef } from "react";
import { fetchData } from "../../../utils/fetchData";
import { CurrentSceneEdit } from "@prisma/client";
import io from "socket.io-client";
import SceneModel from "../threejsObjects/SceneModel";
import BoxGeoPivot from "../threejsObjects/BoxGeoPivot";
import Cylinderqq from "../threejsObjects/CylinderPivot";
import UserCam from "../threejsObjects/UserCam";
import { get_model_name } from "../UI-Elements/ModelList/ModelListItem";
import { TypeObjectProps } from "../../../pages/threejs/types";

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
  addObject: (pfad: string, info: string) => void;
}) {
  const [workers, setWorkers] = useState<CurrentSceneEdit[]>(null); // beinhaltet alle Benutzer die an der Szene arbeiten
  const [reload, setReload] = useState<number>(null);
  const refCurrent = useRef<TypeObjectProps>();

  // lädt alle CurrentSceneEdit-Datensätze der Szene
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

    if (!requestedWorkers) return null;
    setWorkers(requestedWorkers);
    return requestedWorkers;
  };

  // lädt die Workers (also die, die an der Szene arbeiten)
  useEffect(() => {
    getWorkers();
  }, [reload]);

  useEffect(() => {
    if (!workers) return;
    //alert(workers.length);
  }, [workers]);

  // socket io initialisieren
  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();

      // auf beitritt von benutzer in eine Szene lauschen
      socket.on("getSceneOnEnter", (data: CurrentSceneEdit) => {
        // daten verwerfen, wenn man an keiner Szene arbeitet oder wenn man der selbe benutzer ist der dieses ereignis ausgelöst hat
        if (
          !props.refCurrentWorkingScene.current ||
          data.idUser == props.idUser
        )
          return;

        // wenn man an derselben Szene arbeitet, dann Szene neu laden (bzw. getWorkers() neu aufrufen)
        if (data.idScene == props.refCurrentWorkingScene.current.idScene) {
          setReload(Math.random());
        }
      });

      // wenn einer eine Szene verlässt
      socket.on("getSceneOnLeave", (data: CurrentSceneEdit) => {
        // daten verwerfen, wenn man an keiner Szene arbeitet oder wenn man der selbe benutzer ist der dieses ereignis ausgelöst hat
        if (
          !props.refCurrentWorkingScene.current ||
          data.idUser == props.idUser
        )
          return;

        // wenn man an derselben Szene arbeitet, dann Szene neu laden (bzw. getWorkers() neu aufrufen)
        if (data.idScene == props.refCurrentWorkingScene.current.idScene) {
          //alert("Ein Benutzer hat die Konfiguration verlassen: " + data.idUser);
          setReload(Math.random());
        }
      });
    };
    socketInitializer();
  }, []);

  // updated die Uhrzeit des CurrentSceneEdit-Datensatz
  const keepSceneEditAlive = async () => {
    // der fall, falls der admin sich die Szene aus dem Adminbereich anschaut, dieser hat ja dann keinen currentSceneEdit Datensatz
    if (!props.refCurrentWorkingScene.current) return;

    const requestedUpdate = await fetchData(
      props.idUser,
      props.sessionID,
      "CurrentSceneEdit",
      "update",
      {
        id: props.refCurrentWorkingScene.current.id,
      },
      {
        entryDate: new Date(),
      },
      null
    );

    if (!requestedUpdate) return null;
    return requestedUpdate;
  };

  return props.models ? (
    <Canvas
      onPointerMissed={() => {
        props.setCurrentObjectProps(null);
      }}
      onClick={async () => {
        // updated den eigenen CurrentSceneEdit-Datensatz
        await keepSceneEditAlive();
        // löscht alte CurrentSceneEdit-Datensätze (älter als 10min inaktivität)
        await deleteOldSceneEdits(props.idUser, props.sessionID);
      }}
      className="canvas"
      ref={props.sceneRef}
    >
      {/* Kamera */}
      <Camera
        refCurrentWorkingScene={props.refCurrentWorkingScene}
        controlsRef={props.controlsRef}
        perspektive={props.perspektive}
        testMode={props.testMode}
        setCamPos={props.setCamPos}
        setRotCam={props.setRotCam}
      ></Camera>

      {/* workers, also die Benutzer die in dieser Szene arbeiten */}
      {workers
        ? workers.map((worker: CurrentSceneEdit) => {
            if (!props.refCurrentWorkingScene.current) return;
            if (props.refCurrentWorkingScene.current.id == worker.id) return;
            return (
              <UserCam
                worker={worker}
                idUser={props.idUser}
                sessionID={props.sessionID}
              ></UserCam>
            );
          })
        : null}

      {/* Umgebungslicht */}
      <ambientLight intensity={props.ambientValue} />
      {/* <pointLight position={[10, 10, 10]} /> */}

      {/* Punktlicht */}
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
              idScene={model.idScene}
              htmlSettings={props.htmlSettings}
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
              idScene={model.idScene}
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
              reCurrent={refCurrent}
              key={model.id}
              controlsRef={props.controlsRef}
              isSelected={model.id === props.currentObjectProps?.id}
              camPerspektive={props.perspektive}
              setCurrentObjectProps={props.setCurrentObjectProps}
              objProps={model}
              htmlSettings={props.htmlSettings}
              testMode={props.testMode}
              idScene={model.idScene}
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
              idScene={model.idScene}
              htmlSettings={props.htmlSettings}
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
              idScene={model.idScene}
            ></Cylinderqq>
          ) : (
            <BoxGeoPivot
              reCurrent={refCurrent}
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
              idScene={model.idScene}
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

// löscht currentSceneEdits die älter als 10min sind
export const deleteOldSceneEdits = async (
  idUser: string,
  sessionID: string
) => {
  const requestedOldCurrentEdits = await fetchData(
    idUser,
    sessionID,
    "CurrentSceneEdit",
    "select",
    {
      entryDate: {
        lte: new Date(Date.now() - 10 * 60 * 1000), // 30sek new Date(Date.now() - 30 * 1000), // 7min new Date(Date.now() - 7 * 60 * 1000),
      },
    },
    null,
    null
  );

  if (!requestedOldCurrentEdits) return;
  try {
    for (const edit of requestedOldCurrentEdits as CurrentSceneEdit[]) {
      await fetchData(
        idUser,
        sessionID,
        "CurrentSceneEdit",
        "delete",
        {
          id: edit.id,
        },
        null,
        null
      );
    }
  } catch (e) {
    console.log(e);
  }
};
