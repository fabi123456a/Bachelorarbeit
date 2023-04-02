import Stack from "@mui/material/Stack";
import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Alert, Button, Divider, Snackbar, Typography } from "@mui/material";
import PropertieContainer from "./UI-Elements/PropertieContainer/PropertieContainer";
import ToolBar from "./UI-Elements/ToolBar/ToolBar";
import { ModelList } from "./UI-Elements/ModelList/ModelList";
import Scene from "./Scene/Scene";
import * as THREE from "three";
import { arrayBufferToBase64, base64ToBlob } from "./utils/converting";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import exportToGLTF from "./utils/exporting";

//@ts-ignore
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { ModelScene } from "../api/_models";

export default function Main(props: {
  scene: ModelScene;
  setScene: (scene: ModelScene) => void;
}) {
  const [showControlsInfo, setShowControlsInfo] = useState(true);
  const [fbx_models_files, setFbx_models_files] = useState<any[]>([]); //Contains all FBX Model Files which can be selected via the ModelList Component. Is needed to save the Scene and all FBX Model Files

  // contains all models which are currently in the scene
  const [models, setModels] = useState<TypeObjectProps[]>([
    {
      id: "123567",
      position: { x: -2, y: 0, z: 0 },
      scale: { x: 0.06, y: 0.06, z: 0.06 },
      rotation: { x: 0, y: 0, z: 0 },
      editMode: undefined,
      showXTransform: false,
      showYTransform: false,
      showZTransform: false,
      modelPath: "./ModelsFBX/Computer Desk.FBX",
      removeBoundingBox: () => {},
    },
    {
      id: "12321321367",
      position: { x: -1, y: 0, z: 0 },
      scale: { x: 0.03, y: 0.03, z: 0.03 },
      rotation: { x: 0, y: -1.6, z: 0 },
      editMode: undefined,
      showXTransform: false,
      showYTransform: false,
      showZTransform: false,
      modelPath: "./ModelsFBX/Chair.FBX",
      removeBoundingBox: () => {},
    },
    {
      id: "123211231233321367",
      position: {
        x: 2.0517650695421015,
        y: 1.83353328885948,
        z: 3.489659672608047,
      },
      scale: { x: 0.03, y: 0.03, z: 0.03 },
      rotation: { x: 0, y: 1.6, z: 0 },
      editMode: undefined,
      showXTransform: false,
      showYTransform: false,
      showZTransform: false,
      modelPath: "./ModelsFBX/Monitor.FBX",
      removeBoundingBox: () => {},
    },
  ]);

  //Contains all Model Files and their name which can be selected via the ModelList
  const [modelPaths, setModelPaths] = useState<TypeModel[]>([]);
  // [
  //   { name: "Car", path: "./ModelsFBX/car.fbx" },
  //   { name: "Mercedes", path: "./ModelsFBX/mercedes.fbx" },
  //   { name: "Couch", path: "./ModelsFBX/couch.fbx" },
  //   { name: "Low Poly Tree", path: "./ModelsFBX/lowpolytree.fbx" },
  //   { name: "Sofa", path: "./ModelsFBX/sofa.fbx" },
  //   { name: "Table And Chairs", path: "./ModelsFBX/tableandchairs.fbx" },
  //   { name: "Monitor", path: "./ModelsFBX/Monitor.FBX" },
  //   { name: "Chair", path: "./ModelsFBX/Chair.FBX" },
  //   { name: "Computer Desk", path: "./ModelsFBX/Computer Desk.FBX" },
  // ]

  // load all models for the state modelPaths, am anfang
  useEffect(() => {
    // alle fbx modelle vom server laden
    const fetchData = async () => {
      let response = await fetch("api/FS_getFbxModels");
      let result = await response.json();
      let fileNames: Array<string> = result["files"];

      let typeModels: TypeModel[] = [];

      for (let i = 0; i < fileNames.length; i++) {
        let nameFile: string = fileNames[i];
        typeModels[i] = { name: nameFile, path: "./ModelsFBX/" + nameFile };
      }

      setModelPaths(typeModels);
    };

    fetchData();
  }, []);

  // currentObjectProps
  const [currentObjectProps, setMainCurrentObjectProps] =
    useState<TypeObjectProps>(null!);
  const [copiedObjectProps, setCopiedObjectProps] =
    useState<TypeObjectProps | null>(null);
  const textRef = useRef<string>("");

  // cam
  const [ortho, setOrtho] = useState<boolean>(false);
  const [perspective, setPerspective] = useState<string>("0");
  const [roomDimensions, setRoomDimensions] = useState<TypeRoomDimensions>({
    height: 7,
    width: 50,
    depth: 50,
  });

  // to show the left or right wall or hide it when the camera mode changes
  const [wallVisiblity, setWallVisiblity] = useState<TypeWallVisibility>({
    leftWall: true,
    rightWall: true,
  });

  const sceneRef = useRef<any>(null!);
  const controlsRef = useRef<any>(null);
  const prevObjectProps = useRef(currentObjectProps);

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

  useEffect(() => {
    if (!currentObjectProps) return;
    updateModels(currentObjectProps.id, currentObjectProps);

    if (prevObjectProps.current != null) {
      if (prevObjectProps.current.id !== currentObjectProps.id) {
        prevObjectProps.current.removeBoundingBox();
      }
    }

    prevObjectProps.current = currentObjectProps;
  }, [currentObjectProps]);

  const handleModelAdd = (pfad: string) => {
    setModels([
      ...models,
      {
        id: "" + Math.random() * 1000,
        editMode: undefined,
        showXTransform: false,
        showYTransform: false,
        showZTransform: false,
        modelPath: pfad,
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 0.02, y: 0.02, z: 0.02 },
        rotation: { x: 0, y: 0, z: 0 },
        removeBoundingBox: () => {},
      },
    ]);
  };

  const handleModelDelete = (id: string) => {
    setModels((prevModels) => prevModels.filter((model) => model.id !== id));
    setMainCurrentObjectProps(null!);
  };

  const handleModelexport = async () => {
    const scene = new THREE.Scene();
    const fbxLoader = new FBXLoader();

    for (const element of models) {
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
  const [valueGltf, setValueGltf] = useState<THREE.Group>(null!);
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
    setModels((prev: TypeObjectProps[]) => [
      {
        ...prev.find((model) => model.id === modelID),
        ...newModelData,
      },
      ...prev.filter((model) => model.id !== modelID),
    ]);
  };

  // save Scene
  async function saveScene() {
    const files = await Promise.all(
      fbx_models_files.map(async (fileData) => {
        const { pathName, name, file } = fileData;
        const base64 = arrayBufferToBase64(await file.arrayBuffer()); //Convert the arrayBuffer of the file to a base64 encoded string
        return { pathName, name, file: base64 };
      })
    );
    const toSaveObj = {
      roomDimensions: roomDimensions,
      models: [...models],
      fbx_models: files,
    };
    const sceneJsonString = JSON.stringify(toSaveObj);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([sceneJsonString], { type: "application/json" })
    );
    link.download = "Scene";
    document.body.appendChild(link);
    //link.click();
    document.body.removeChild(link);

    // auf server laden, scene mit gleichen id safen ist quasi scene speichern

    const response = await fetch("/api/FS_uploadScene", {
      method: "POST",
      body: JSON.stringify({
        jsonData: sceneJsonString,
        sceneID: props.scene.id,
      }),
    });
    const result = await response.json();

    alert(result["result"]);
  }

  function isExportedScene(data: any): data is ExportedScene {
    return (
      typeof data === "object" &&
      data !== null &&
      "roomDimensions" in data &&
      "models" in data &&
      "fbx_models" in data
    );
  }

  // load Scene
  async function loadScene(file: File | null) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = JSON.parse(e?.target?.result as string);
      if (!isExportedScene(data)) {
        alert("The File type is not correct");
        return;
      }

      const modifiedPaths = await Promise.all(
        data.fbx_models?.map(async (fbx_model: any) => {
          const url = URL.createObjectURL(base64ToBlob(fbx_model.file)); //generate a Path from the decoded base64 ArrayBuffe String, the default type is "" and means it is a binary file
          return {
            name: fbx_model.name,
            oldPathName: fbx_model.pathName,
            newPathName: url,
          };
        })
      );

      if (data.roomDimensions) {
        setRoomDimensions({ ...data.roomDimensions });
      }

      setModelPaths((prev) => [
        ...prev,
        ...modifiedPaths.map((fbx_model) => {
          return { name: fbx_model.name, path: fbx_model.newPathName };
        }),
      ]);

      setModels([
        ...data.models.map((model: any) => {
          const newPathName = modifiedPaths.find((modelFbxPath) => {
            return modelFbxPath?.oldPathName === model?.modelPath;
          });
          return {
            ...model,
            modelPath: newPathName?.newPathName ?? model.modelPath,
          };
        }),
      ]);
    };
    reader.readAsText(file);
  }

  async function loadScene2(data2: string) {
    const data = JSON.parse(data2);
    if (!isExportedScene(data)) {
      alert("The File type is not correct");
      return;
    }

    const modifiedPaths = await Promise.all(
      data.fbx_models?.map(async (fbx_model: any) => {
        const url = URL.createObjectURL(base64ToBlob(fbx_model.file)); //generate a Path from the decoded base64 ArrayBuffe String, the default type is "" and means it is a binary file
        return {
          name: fbx_model.name,
          oldPathName: fbx_model.pathName,
          newPathName: url,
        };
      })
    );

    if (data.roomDimensions) {
      setRoomDimensions({ ...data.roomDimensions });
    }

    setModelPaths((prev) => [
      ...prev,
      ...modifiedPaths.map((fbx_model) => {
        return { name: fbx_model.name, path: fbx_model.newPathName };
      }),
    ]);

    setModels([
      ...data.models.map((model: any) => {
        const newPathName = modifiedPaths.find((modelFbxPath) => {
          return modelFbxPath?.oldPathName === model?.modelPath;
        });
        return {
          ...model,
          modelPath: newPathName?.newPathName ?? model.modelPath,
        };
      }),
    ]);
  }

  // anfangs scene laden
  useEffect(() => {
    const handle = async () => {
      const response = await fetch("/api/FS_getSceneByID", {
        method: "POST",
        body: JSON.stringify({
          sceneID: props.scene.id,
        }),
      });

      const result = await response.json();

      loadScene2(result["data"]);
    };
    handle();
  }, []);

  return (
    <Stack
      direction="row"
      style={{ height: "100%", background: "#d9d9d9", overflowY: "auto" }}
      divider={<Divider orientation="vertical" flexItem />}
    >
      <Button
        onClick={() => {
          props.setScene(null);
        }}
      >
        Back
      </Button>
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
          onClose={(event?: React.SyntheticEvent | Event, reason?: string) => {
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
      {/* ModelList */}
      <Stack
        style={{
          background: "#d9d9d9",
          width: "20%",
        }}
      >
        <ModelList
          addObject={handleModelAdd}
          deleteModel={(url: string) => {
            setModelPaths((prev) => [
              ...prev.filter((path) => path.path !== url),
            ]);
            setFbx_models_files((prev) => [
              ...prev.filter((path) => path.pathName !== url),
            ]);
          }}
          addModel={(name: string, url: string, file: any) => {
            setModelPaths((prev) => [...prev, { name: name, path: url }]);
            setFbx_models_files((prev: any[]) => {
              if (prev.find((elem) => elem.pathName === url)) {
                return prev;
              }
              const newFile = {
                pathName: url,
                name: name,
                file: file,
              };
              return [...prev, newFile];
            });
          }}
          paths={modelPaths}
        ></ModelList>
      </Stack>

      {/* ToolBar */}
      <Stack
        direction="column"
        style={{
          width: "100%",
          background: "white",
        }}
        divider={<Divider orientation="horizontal" flexItem />}
      >
        <Stack
          style={{
            background: "#d9d9d9",
          }}
        >
          <ToolBar
            setPerspective={setPerspective}
            setOrtho={setOrtho}
            deleteObject={handleModelDelete}
            exportObject={handleModelexport}
            importObject={handleModelimport}
            removeObject={handleModelRemoval}
            objProps={currentObjectProps}
            setObjProps={setMainCurrentObjectProps}
            controlsRef={controlsRef}
            setWallVisibility={setWallVisiblity}
            saveScene={saveScene}
            loadScene={loadScene}
          ></ToolBar>
        </Stack>

        {/* Canvas */}
        <Stack
          style={{
            border: "1px solid darkgray",
            height: "100%",
            flex: "1",
          }}
        >
          <Canvas>
            {/*TO ACCESS THE useThree hook in the Scene component*/}
            <Scene
              controlsRef={controlsRef}
              perspektive={perspective}
              ortho={ortho}
              currentObjectProps={currentObjectProps}
              setMainCurrentObjectProps={setMainCurrentObjectProps}
              models={models}
              roomDimensions={roomDimensions}
              sceneRef={sceneRef}
              wallVisibility={wallVisiblity}
            ></Scene>
          </Canvas>
        </Stack>
      </Stack>

      {/* PropertieContainer */}
      <Stack
        style={{
          background: "#d9d9d9",
          width: "30%",
        }}
      >
        <PropertieContainer
          objProps={currentObjectProps}
          setObjProps={setMainCurrentObjectProps}
          roomDimensions={roomDimensions}
          setRoomDimensions={setRoomDimensions}
        ></PropertieContainer>
      </Stack>
    </Stack>
  );
}
