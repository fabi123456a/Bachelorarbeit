import Stack from "@mui/material/Stack";
import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Alert,
  Button,
  Divider,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
import PropertieContainer from "./UI-Elements/PropertieContainer/PropertieContainer";
import ToolBar from "./UI-Elements/ToolBar/ToolBar";
import ModelList from "./UI-Elements/ModelList/ModelList";
import ThreeJsScene from "./Scene/Scene";
import * as THREE from "three";
import { arrayBufferToBase64, base64ToBlob } from "../../utils/converting";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import exportToGLTF from "../../utils/exporting";
import { Model, Scene, User } from "@prisma/client";
import WallList from "./UI-Elements/WallList/WallList";
import { debug } from "console";
import SceneModelList from "./UI-Elements/SceneModelTreeView/SceneModelList";
import { Radio } from "@mui/material";
import { RadioGroup } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import Chat from "../chat/Chat";
import io from "socket.io-client";
import MenuBar from "./UI-Elements/Menubar/menuBar";
import { v4 as uuidv4 } from "uuid";

//@ts-ignore
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

let socket;

export default function Main(props: {
  user: User;
  scene: Scene;
  setScene: (scene: Scene) => void;
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
  const [scenVersion, setScenVersion] = useState<number>(
    props.scene.newestVersion
  );

  // htmlsettings
  const [htmlsettings, setHtmlsettings] = useState<boolean>(false);
  const [refreshedSceneID, setRefreshedSceneID] = useState<string>("");

  // ---- REFS ----
  const sceneRef = useRef<any>(null!);
  const controlsRef = useRef<any>(null);
  const prevObjectProps = useRef(currentObjectProps);

  // ---- USE EFFECTS ----

  // load all fbx-models for the state modelPaths, am anfang
  useEffect(() => {
    // alle fbx modelle vom server laden
    const fetchData = async () => {
      let response = await fetch("api/filesystem/FS_getFbxModels");
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
  }, [currentObjectProps]);

  // anfangs scene laden, nach dem eine scene in der sceneList ausgewählt wurde und models mit setModels setzen
  useEffect(() => {
    const getSceneModels = async (idScene: string) => {
      const modelsRequest = await fetch(
        "/api/database/Model/DB_getAllModelsByID",
        {
          method: "POST",
          body: JSON.stringify({
            idScene: props.scene.id,
            version: scenVersion,
          }),
        }
      );

      const models: Model[] = await modelsRequest.json();

      const typeObjectProps: TypeObjectProps[] = [];

      // models vom Typ Model (prismaClient) zu TypeObjectProps ändern
      models.forEach((model: Model) => {
        const obj: TypeObjectProps = convertModelToTypeObjectProps(model);
        typeObjectProps.push(obj);
      });

      setModels(typeObjectProps);
    };
    getSceneModels(props.scene.id);
  }, [props.scene, scenVersion]);

  // scene neu socket.io laden // TODO:
  useEffect(() => {
    // const socketInitializer = async () => {
    //   await fetch("/api/socket");
    //   socket = io();
    //   // socket.on("connect", () => {
    //   //   console.log("connected");
    //   // });
    //   socket.on("getSceneRefresh", (msg) => {
    //     // msg => scene id von der seite die jemand gespeichert hat
    //     //setInput([...input, msg]);xxxx
    //     console.log("scene wurde refresht: " + msg);
    //     setRefreshedSceneID(msg);
    //     if (msg == props.scene.id) {
    //       const handle = async () => {
    //         const response = await fetch("/api/filesystem/FS_getSceneByID", {
    //           method: "POST",
    //           body: JSON.stringify({
    //             sceneID: props.scene.id,
    //           }),
    //         });
    //         const result = await response.json();
    //         //TODO: setModels
    //       };
    //       handle();
    //     }
    //   });
    // };
    // socketInitializer();
  }, []);

  // ----- FUNCTIONS ----

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

    const typeObjectProps = {
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
      id: Math.random().toString(), // neue id wegen datum feld, new uuid4() ging nicht
      idScene: idScene,
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

  const handleModelAdd = (pfad: string, name: string) => {
    const objProps: TypeObjectProps = {
      id: "" + Math.random() * 1000,
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
      color: pfad ? null : "red",
      info: "",
      texture: null,
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
  async function saveScene() {
    // scene speicher,also alle models in DB speichern

    const newVersion = props.scene.newestVersion + 1;

    // dann alle neu einfügen
    models.forEach(async (objProp: TypeObjectProps) => {
      let model: Model;

      model = convertTypeObjectPropsToModel(
        objProp,
        props.scene.id,
        newVersion
      );

      console.log("model");
      console.log(model);

      await insertModelToDB(model);
    });

    // neu version in scene speichern
    await changeSceneVersion(props.scene.id, newVersion);
    const updatedScene = {
      ...props.scene,
      newestVersion: newVersion,
    };
    props.setScene(updatedScene);
    setScenVersion(newVersion);
  }

  async function changeSceneVersion(idScene: String, version: number) {
    const response = await fetch("/api/database/Scene/DB_changeNewestVersion", {
      method: "POST",
      body: JSON.stringify({ idScene: idScene, version: version }),
    });
    const responseModel = await response.json();

    // weitere prüfungen
    // ...
  }

  // klappt aber wird nicht mehr benötigt wegen datum im model feld
  async function deleteAllModelsFromSceneInDB(idScene: String) {
    const response = await fetch("/api/database/Model/DB_deleteAllModelsByID", {
      method: "POST",
      body: JSON.stringify({ idScene: idScene }),
    });
    const responseModel = await response.json();

    // weitere prüfungen
    // ...
  }

  async function insertModelToDB(model: Model) {
    const response = await fetch("/api/database/Model/DB_insertModel", {
      method: "POST",
      body: JSON.stringify(model),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseModel = await response.json();

    // weitere prüfungen des eingefügten models
    // ...
  }

  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // ---- COMPONENT ----
  return (
    <Stack className="main">

      {/* menubar */}
      <MenuBar
        setScene={props.setScene}
        scene={props.scene}
        isTestMode={isTestMode}
        sceneVersion={scenVersion}
        setSceneVersion={setScenVersion}
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

        {/* ui elements ausblenden bei readonly */}
        {props.user ? (
          props.user.readOnly ? null : (
            <>
              {/* ModelList */}
              <ModelList
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
              <WallList addWall={handleWallAdd}></WallList>

              {/* Chat */}
              <Chat user={props.user} scene={props.scene}></Chat>

              {/* PropertieContainer */}
              <PropertieContainer
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
          )
        ) : null}

        {/* Canvas/ThreeJS-scene */}
        <Canvas
          onPointerMissed={() => {
            setCurrentObjectProps(null);
          }}
          className="canvas"
        >
          {/*TO ACCESS THE useThree hook in the Scene component*/}
          <ThreeJsScene
            controlsRef={controlsRef}
            perspektive={perspective}
            currentObjectProps={currentObjectProps}
            setCurrentObjectProps={setCurrentObjectProps}
            models={models}
            sceneRef={sceneRef}
            wallVisibility={wallVisiblity}
            testMode={isTestMode}
            htmlSettings={htmlsettings}
          ></ThreeJsScene>
        </Canvas>
      </Stack>
    </Stack>
  );
}
