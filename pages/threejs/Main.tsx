import Stack from "@mui/material/Stack";
import { useState, useEffect, useRef, MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Alert,
  Button,
  Divider,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
import PropertieContainer from "../../components/threejs/UI-Elements/PropertieContainer/PropertieContainer";
import ToolBar from "../../components/threejs/UI-Elements/ToolBar/ToolBar";
import ModelList from "../../components/threejs/UI-Elements/ModelList/ModelList";
import ThreeJsScene from "../../components/threejs/Scene/Scene";
import * as THREE from "three";
import { arrayBufferToBase64, base64ToBlob } from "../../utils/converting";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import exportToGLTF from "../../utils/exporting";
import {
  CurrentSceneEdit,
  Model,
  Scene,
  SceneMemberShip,
  User,
} from "@prisma/client";
import WallList from "../../components/threejs/UI-Elements/WallList/WallList";
import { debug } from "console";
import SceneModelList from "../../components/threejs/UI-Elements/SceneModelTreeView/SceneModelList";
import { Radio } from "@mui/material";
import { RadioGroup } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import Chat from "../../components/chat/Chat";
import io from "socket.io-client";
import MenuBar from "../../components/threejs/UI-Elements/Menubar/menuBar";
import { v4 as uuidv4 } from "uuid";

//@ts-ignore
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Light } from "@mui/icons-material";
import LightSettings from "../../components/threejs/UI-Elements/Light/lightSetting";
import { fetchData } from "../../utils/fetchData";
import { TypeModel, TypeObjectProps } from "./types";
import { get_model_name } from "../../components/threejs/UI-Elements/ModelList/ModelListItem";
import CurrentWorkingList from "../../components/sceneList/sceneListEntry/currentWorkingList";

let socket;

export default function Main(props: {
  user: User;
  scene: Scene;
  setScene: (scene: Scene) => void;
  membership: SceneMemberShip;
  sessionID: string;
  currentWorkingScene: MutableRefObject<CurrentSceneEdit>;
}) {
  // ---- STATES ----
  const [treeViewSelectedId, setTreeViewSelectedId] = useState<string>(null);
  const [showControlsInfo, setShowControlsInfo] = useState<boolean>(true);
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [models, setModels] = useState<TypeObjectProps[]>([]); // contains all models which are currently in the scene, models without path are walls - walls and fbxModels
  const [modelPathsFS, setModelPathsFS] = useState<TypeModel[]>([]); //Contains all FBX-Model Files and their name which can be selected via the ModelList, wird am anfang von FS geladen
  const [refresFbxModelPathsData, setRefreshFbxModelPathsData] =
    useState<boolean>(false);
  const [currentObjectProps, setCurrentObjectProps] = useState<TypeObjectProps>(
    null!
  ); // currentObjectProps
  const [copiedObjectProps, setCopiedObjectProps] =
    useState<TypeObjectProps | null>(null);
  const textRef = useRef<string>("");
  const [perspective, setPerspective] = useState<string>("normal"); // cam TODO: type für perspektiven

  const [wallVisiblity, setWallVisiblity] = useState<boolean>(true); // to show the left or right wall or hide it when the camera mode changes
  const [valueGltf, setValueGltf] = useState<THREE.Group>(null!);

  // sceneVersion
  // const [scenVersion, setScenVersion] = useState<number>(
  //   props.scene ? props.scene.newestVersion : null
  // );

  // ambient light
  const [ambientValue, setAmbientValue] = useState<number>(0.5);

  // htmlsettings
  const [htmlsettings, setHtmlsettings] = useState<boolean>(false);

  // kamera position & rotatre
  const [camPos, setCamPos] = useState<number[]>(null);
  const [camRot, setCamRot] = useState<number[]>(null);

  // synchronisation via socket io
  const [newSocketioData, setNewSocketioData] = useState<TypeObjectProps>(null);
  const [newSocketioFbxModel, setNewSocketioFbxModel] = useState<{
    modelPath: string;
    idModel: string;
  }>(null);
  const [newSocketioWall, setNewSocketioWall] = useState<TypeObjectProps>(null);

  // ---- REFS ----
  const sceneRef = useRef<any>(null!);
  const controlsRef = useRef<any>(null);
  const prevObjectProps = useRef(currentObjectProps);

  // ---- USE EFFECTS ----

  // load all fbx-models for the state modelPaths, am anfang
  useEffect(() => {
    // alle fbx modelle vom server laden
    const fetchData = async () => {
      if (!props.user) return;

      let response = await fetch("api/filesystem/FS_getFbxModels", {
        method: "POST",
        body: JSON.stringify({
          idUser: props.user.id,
          sessionID: props.sessionID,
        }),
      });
      let result = await response.json();
      let fileNames: Array<string> = result["files"];

      let typeModels: TypeModel[] = [];

      for (let i = 0; i < fileNames.length; i++) {
        let nameFile: string = fileNames[i];
        typeModels[i] = { name: nameFile, path: "./ModelsFBX/" + nameFile };
      }

      setModelPathsFS(typeModels);
    };

    fetchData();
  }, [refresFbxModelPathsData]);

  //Shortcuts
  useEffect(() => {
    function handleShortcuts(event: KeyboardEvent) {
      /* if (event.key === "Backspace") {
        setModels((prev) => [
          ...prev.filter((model) => model.id !== prevObjectProps.current.id),
        ]);
        setMainCurrentObjectProps(null!);
        textRef.current = "Model Gelöscht";
      } */
      if (event.key === "c" && (event.metaKey || "Control")) {
        // Command + C is pressed
        setCopiedObjectProps((prev) => {
          return { ...prevObjectProps.current };
        });
        textRef.current = "Model Kopiert";
      }
      if (event.key === "v" && (event.metaKey || "Control")) {
        // Command + V is pressed
        if (copiedObjectProps) {
          setModels((prev) => [
            ...prev,
            { ...copiedObjectProps, id: "" + Math.random() * 1000 },
          ]);
          textRef.current = "Model Eingefügt";
        }
      }
    }
    document.addEventListener("keydown", handleShortcuts);
    return () => {
      document.removeEventListener("keydown", handleShortcuts);
    };
  }, [copiedObjectProps]);

  // wird ausgeführt wenn currentObject sich ändert
  useEffect(() => {
    // wenn man pointer missed ist currentObjectProps null oder wenn es keine gibt
    if (!currentObjectProps) {
      return;
    }

    // xxx
    updateModels(currentObjectProps.id, currentObjectProps);

    // treeview setselected id
    setTreeViewSelectedId(currentObjectProps.id);

    prevObjectProps.current = currentObjectProps;

    // session nalive keepen
    // fetch("api/database/Session/DB_sessionKeepAlive"); // TODO: session keep alive

    // zum debuggebn
    console.log(currentObjectProps);

    // socket io
    socket.emit("newObjectData", {
      currentObjectProps: currentObjectProps,
      user: props.user,
    });
  }, [currentObjectProps]);

  const getSceneModels = async (version: number) => {
    if (!props.user) return;

    const requestedModels = await fetchData(
      props.user.id,
      props.sessionID,
      "model",
      "select",
      { idScene: props.scene.id, version: version },
      null,
      null
    );

    if (requestedModels.err) return;

    const typeObjectProps: TypeObjectProps[] = [];

    // models vom Typ Model (prismaClient) zu TypeObjectProps ändern
    requestedModels.forEach((model: Model) => {
      const obj: TypeObjectProps = convertModelToTypeObjectProps(model);
      typeObjectProps.push(obj);
    });

    setModels(typeObjectProps);
  };

  // anfangs scene laden, nach dem eine scene in der sceneList ausgewählt wurde und models mit setModels setzen
  useEffect(() => {
    if (!props.scene) return;
    getSceneModels(props.scene.newestVersion);
  }, [props.scene]); // [props.scene, sceneVersion]

  // scene neu socket.io laden // TODO:
  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();

      socket.on("syncScene", async (data) => {
        if (props.scene.id == data.idScene) {
          const scene = await fetchData(
            props.user.id,
            props.sessionID,
            "scene",
            "select",
            { id: props.scene.id },
            null,
            null
          );

          props.setScene(scene[0]);
        }

        if (props.scene.id == data.idScene && props.user.id != data.idUser) {
          alert("Scene wird gespeichert...");
        }
      });

      // object daten vie socket io synchronisieren
      socket.on("getNewObjectData", (data) => {
        if (!props.currentWorkingScene.current) return;
        if (
          props.currentWorkingScene.current.idScene ==
          data.currentObjectProps.idScene
        ) {
          setNewSocketioData(data.currentObjectProps);
        }
      });

      // fbx add synchronisieren via socket io
      socket.on("getAddFbx", (data) => {
        if (data.idScene != props.scene.id || props.user.id == data.idUser)
          return;

        setNewSocketioFbxModel({
          modelPath: data.modelPath,
          idModel: data.modelID,
        });
      });

      // wall, cuber, floor, cylinder add synchronisieren via socket io
      socket.on("getAddWall", (data) => {
        // {
        //   wall: x,
        //   idScene: props.idScene,
        //   idUser: props.idUser,
        // }
        if (data.idScene != props.scene.id || props.user.id == data.idUser)
          return;

        setNewSocketioWall(data.wall);
      });
    };
    socketInitializer();
  }, []);

  useEffect(() => {
    if (!newSocketioData) return;
    updateModelById(newSocketioData.id, newSocketioData);
  }, [newSocketioData]);

  useEffect(() => {
    if (!newSocketioFbxModel) return;
    handleModelAdd(
      newSocketioFbxModel.modelPath,
      get_model_name(newSocketioFbxModel.modelPath),
      newSocketioFbxModel.idModel
    );
  }, [newSocketioFbxModel]);

  useEffect(() => {
    if (!newSocketioWall) return;
    handleWallAdd(newSocketioWall);
  }, [newSocketioWall]);

  // ----- FUNCTIONS ----

  // Funktion zum Aktualisieren des Modells mit einer bestimmten id
  const updateModelById = (idToUpdate, updatedModelData) => {
    // Verwenden Sie die map-Funktion, um die Liste der Modelle zu durchlaufen
    const updatedModels = models.map((model) => {
      // Wenn die id des aktuellen Modells mit der idToUpdate übereinstimmt,
      // geben Sie ein aktualisiertes Modell mit den neuen Daten zurück
      if (model.id === idToUpdate) {
        return updatedModelData;
      }
      // Andernfalls geben Sie das ursprüngliche Modell unverändert zurück
      return model;
    });

    // Setzen Sie die aktualisierte Liste zurück, um den Zustand zu aktualisieren
    setModels(updatedModels);
  };

  // Model (prisma) -> TypeObjectProps
  function convertModelToTypeObjectProps(model: Model) {
    const position = {
      x: model.positionX,
      y: model.positionY,
      z: model.positionZ,
    };

    const scale = {
      x: model.scaleX,
      y: model.scaleY,
      z: model.scaleZ,
    };

    const rotation = {
      x: model.rotationX,
      y: model.rotationY,
      z: model.rotationZ,
    };

    const typeObjectProps: TypeObjectProps = {
      id: model.id,
      position: position,
      scale: scale,
      rotation: rotation,
      editMode: undefined,
      showXTransform: model.showXTransform,
      showYTransform: model.showYTransform,
      showZTransform: model.showZTransform,
      modelPath: model.modelPath || "",
      visibleInOtherPerspective: model.visibleInOtherPerspective,
      name: model.name,
      info: model.info || "",
      color: model.color,
      texture: model.texture || "",
      idScene: model.idScene,
    };

    return typeObjectProps;
  }

  // TypeObjectProps -> Model (prisma)
  function convertTypeObjectPropsToModel(
    typeObjectProps: TypeObjectProps,
    idScene: string,
    version: number
  ) {
    const model: Model = {
      id: uuidv4(), // neue id wegen datum feld, new uuid4() ging nicht
      idScene: typeObjectProps.idScene,
      positionX: typeObjectProps.position.x,
      positionY: typeObjectProps.position.y,
      positionZ: typeObjectProps.position.z,
      scaleX: typeObjectProps.scale.x,
      scaleY: typeObjectProps.scale.y,
      scaleZ: typeObjectProps.scale.z,
      rotationX: typeObjectProps.rotation.x,
      rotationY: typeObjectProps.rotation.y,
      rotationZ: typeObjectProps.rotation.z,
      visibleInOtherPerspective: typeObjectProps.visibleInOtherPerspective,
      showXTransform: typeObjectProps.showXTransform,
      showYTransform: typeObjectProps.showYTransform,
      showZTransform: typeObjectProps.showZTransform,
      modelPath: typeObjectProps.modelPath,
      info: typeObjectProps.info,
      name: typeObjectProps.name,
      color: typeObjectProps.color,
      texture: typeObjectProps.texture,
      version: version,
    };

    return model;
  }

  const handleRefreshFbxModelPaths = () => {
    setRefreshFbxModelPathsData((prevRefreshData) => !prevRefreshData);
  };

  const handleModelAdd = (pfad: string, name: string, id?: string) => {
    const objProps: TypeObjectProps = {
      id: id ? id : uuidv4(),
      editMode: "translate",
      showXTransform: true,
      showYTransform: true,
      showZTransform: true,
      modelPath: pfad,
      position: { x: 0, y: 0, z: 0 },
      scale: { x: 0.02, y: 0.02, z: 0.02 },
      rotation: { x: 0, y: 0, z: 0 },
      name: name,
      visibleInOtherPerspective: true,
      color: "",
      info: "",
      texture: "",
      idScene: props.scene.id,
    };
    console.log("handleModelAdd");
    console.log(objProps);

    setModels([...models, objProps]);

    setCurrentObjectProps(objProps);
  };

  // wall add, damit sind walls floors und cubes gemeint, also alles aus wallList
  const handleWallAdd = (objProps: TypeObjectProps) => {
    console.log(objProps);

    setModels([...models, objProps]);
    setCurrentObjectProps(objProps);

    // objProps.insertBoundingBox(); // TODO:
  };

  const handleWallAdd2 = () => {
    const objPr: TypeObjectProps = {
      id: uuidv4(),
      position: {
        x: 0,
        y: 3,
        z: 0,
      },
      scale: {
        x: 1,
        y: 1,
        z: 1,
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
      editMode: "translate", //props.editMode,
      showXTransform: true, //props.showXTransform,
      showYTransform: true, //props.showYTransform,
      showZTransform: true, //props.showZTransform,
      modelPath: "",
      info: "licht",
      visibleInOtherPerspective: false,
      name: "pointLight",
      color: "",
      texture: "",
      idScene: props.scene.id,
    };

    setModels([...models, objPr]);
    setCurrentObjectProps(objPr);

    // objProps.insertBoundingBox(); // TODO:
  };

  const handleModelDelete = (id: string) => {
    setModels((prevModels) => prevModels.filter((model) => model.id !== id));
    setCurrentObjectProps(null!);
  };

  const handleModelexport = async () => {
    const scene = new THREE.Scene();
    const fbxLoader = new FBXLoader();

    for (const element of models) {
      if (!element.modelPath) continue;

      await new Promise((resolve, reject) => {
        fbxLoader.load(element.modelPath, (object) => {
          object.scale.set(element.scale.x, element.scale.y, element.scale.z);
          object.position.set(
            element.position.x,
            element.position.y,
            element.position.z
          );
          object.rotation.set(
            element.rotation.x,
            element.rotation.y,
            element.rotation.z
          );
          scene.add(object);
          resolve("");
        });
      });
    }
    exportToGLTF(scene);
  };

  const handleModelimport = async (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const contents: string = JSON.parse(e?.target?.result as string);
      const gltfLoader = new GLTFLoader();
      gltfLoader.parse(contents, "", function (gltf) {
        setValueGltf(gltf.scene);
        sceneRef.current.add(gltf.scene);
      });
    };
    reader.readAsText(file);
  };

  const handleModelRemoval = async () => {
    sceneRef.current.remove(valueGltf);
  };

  const updateModels = (modelID: string, newModelData: any) => {
    // setModels((prev: TypeObjectProps[]) => [
    //   {
    //     ...prev.find((model) => model.id === modelID),
    //     ...newModelData,
    //   },
    //   ...prev.filter((model) => model.id !== modelID),
    // ]);

    setModels((prev: TypeObjectProps[]) =>
      prev.map((model) => {
        if (model.id === modelID) {
          return {
            ...model,
            ...newModelData,
          };
        } else {
          return model;
        }
      })
    );
  };

  // save Scene
  async function saveScene(idScene: string) {
    // erst neue version
    const newVersion = props.scene.newestVersion + 1;

    // dann alle neu einfügen, mit nuer version als vermerk
    models.forEach(async (objProp: TypeObjectProps) => {
      let model: Model;

      if (objProp.info == "licht") {
        // TODO: licht macht probleme beim speichern
        alert("licht");
        return;
      }

      model = convertTypeObjectPropsToModel(
        objProp,
        props.scene.id,
        newVersion
      );

      await insertModelToDB(model);
    });

    // neu version in scene speichern
    await changeSceneVersion(newVersion);
    const updatedScene = {
      ...props.scene,
      newestVersion: newVersion,
    };

    props.setScene(updatedScene);

    // socket.io
    socket.emit("setSyncScene", {
      version: newVersion,
      idScene: idScene,
      idUser: props.user.id,
    });
  }

  async function changeSceneVersion(version: number) {
    if (!props.user) return;

    const requestChangeVersion = await fetchData(
      props.user.id,
      props.sessionID,
      "scene",
      "update",
      { id: props.scene.id },
      { newestVersion: version },
      null
    );

    if (requestChangeVersion.error) return null;
  }

  async function insertModelToDB(model: Model) {
    const rquestInsertModel = await fetchData(
      props.user.id,
      props.sessionID,
      "model",
      "create",
      {},
      model,
      null
    );

    if (rquestInsertModel.err) return;
  }

  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // ---- COMPONENT ----
  return props.user && props.sessionID ? (
    <Stack className="main">
      <MenuBar
        idUser={props.user.id}
        sessionID={props.sessionID}
        currentWorkingScene={props.currentWorkingScene}
        setScene={props.setScene}
        scene={props.scene}
        isTestMode={isTestMode}
      ></MenuBar>
      <Stack
        direction="row"
        style={{ height: "100%", background: "#d9d9d9", overflowY: "auto" }}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Snackbar
          autoHideDuration={4000}
          open={textRef.current !== ""}
          onClose={(event?: React.SyntheticEvent | Event, reason?: string) => {
            if (reason === "clickaway") {
              return;
            }
            textRef.current = "";
          }}
        >
          <Alert severity="info">{textRef.current}</Alert>
        </Snackbar>
        <Snackbar
          open={showControlsInfo}
          onClose={(event?: React.SyntheticEvent | Event, reason?: string) => {
            if (reason === "clickaway") {
              return;
            }
            setShowControlsInfo(false);
          }}
        >
          <Alert
            severity="info"
            onClose={(
              event?: React.SyntheticEvent | Event,
              reason?: string
            ) => {
              if (reason === "clickaway") {
                return;
              }
              setShowControlsInfo(false);
            }}
          >
            <Typography>Controls: </Typography>
            Modelle Kopieren: COMMAND + C, <br />
            Modelle Eingfügen: COMMAND + V
          </Alert>
        </Snackbar>

        {/* ui elements ausblenden, wenn keine lese rechte oder kein admin oder readonly im membership */}
        {props.user ? (
          props.user.isAdmin ||
          (props.user.write && !props.membership.readOnly) ? (
            <>
              <Chat
                scene={props.scene}
                sessionID={props.sessionID}
                user={props.user}
              ></Chat>
              {/* ModelList */}
              <ModelList
                idUser={props.user.id}
                idScene={props.scene.id}
                addObject={handleModelAdd}
                paths={modelPathsFS}
                setRefreshData={handleRefreshFbxModelPaths}
              ></ModelList>

              {/* ToolBar */}
              <ToolBar
                setPerspective={setPerspective}
                deleteObject={handleModelDelete}
                exportObject={handleModelexport}
                importObject={handleModelimport}
                removeObject={handleModelRemoval}
                currentObjProps={currentObjectProps}
                setObjProps={setCurrentObjectProps}
                controlsRef={controlsRef}
                setWallVisibility={setWallVisiblity}
                saveScene={saveScene}
                setIsTestMode={setIsTestMode}
                isTestMode={isTestMode}
                setCurentObj={setCurrentObjectProps}
                scene={props.scene}
                setHtmlSettings={setHtmlsettings}
                htmlSettings={htmlsettings}
              ></ToolBar>

              {/* Wallist */}
              <WallList
                idUser={props.user.id}
                addWall={handleWallAdd}
                idScene={props.scene.id}
              ></WallList>

              {/* lightSettings */}
              <LightSettings
                ambientValue={ambientValue}
                setAmbientValue={setAmbientValue}
                addLightToScene={handleWallAdd2}
              ></LightSettings>

              {/* Chat */}
              {/* <Chat user={props.user} scene={props.scene}></Chat> */}

              {/* PropertieContainer */}
              <PropertieContainer
                idUser={props.user.id}
                sessionID={props.sessionID}
                objProps={currentObjectProps}
                setObjProps={setCurrentObjectProps}
              ></PropertieContainer>

              {/* treeview */}
              <SceneModelList
                models={models}
                currentObjProps={currentObjectProps}
                setCurrentObj={setCurrentObjectProps}
                deleteObject={handleModelDelete}
                selectedId={treeViewSelectedId}
              ></SceneModelList>
            </>
          ) : null
        ) : null}

        {/* Canvas/ThreeJS-scene */}
        {/* <Canvas
          onPointerMissed={() => {
            setCurrentObjectProps(null);
          }}
          className="canvas"
        > */}
        {/*TO ACCESS THE useThree hook in the Scene component*/}
        <ThreeJsScene
          addObject={handleModelAdd}
          refCurrentWorkingScene={props.currentWorkingScene}
          ambientValue={ambientValue}
          controlsRef={controlsRef}
          perspektive={perspective}
          currentObjectProps={currentObjectProps}
          setCurrentObjectProps={setCurrentObjectProps}
          models={models}
          sceneRef={sceneRef}
          wallVisibility={wallVisiblity}
          testMode={isTestMode}
          htmlSettings={htmlsettings}
          posCam={camPos}
          rotCam={camRot}
          setCamPos={setCamPos}
          setRotCam={setCamRot}
          idUser={props.user.id}
          sessionID={props.sessionID}
          idScene={props.scene.id}
        ></ThreeJsScene>
        {/* </Canvas> */}
      </Stack>
    </Stack>
  ) : null;
}
