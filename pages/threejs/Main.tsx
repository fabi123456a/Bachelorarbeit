import Stack from "@mui/material/Stack";
import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Alert, Button, Divider, Snackbar, Typography } from "@mui/material";
import PropertieContainer from "./UI-Elements/PropertieContainer/PropertieContainer";
import ToolBar from "./UI-Elements/ToolBar/ToolBar";
import ModelList from "./UI-Elements/ModelList/ModelList";
import ThreeJsScene from "./Scene/Scene";
import * as THREE from "three";
import { arrayBufferToBase64, base64ToBlob } from "../../utils/converting";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import exportToGLTF from "../../utils/exporting";
import { Scene, User } from "@prisma/client";
import WallList from "./UI-Elements/WallList/WallList";
import { debug } from "console";
import SceneModelList from "./UI-Elements/SceneModelTreeView/SceneModelList";
import { Radio } from "@mui/material";
import { RadioGroup } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import Chat from "../chat/Chat";
import io from "Socket.IO-client";
import MenuBar from "./UI-Elements/Menubar/menuBar";

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

  // useEffect(() => {
  //   fetchData();
  // }, []);

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
    fetch("api/database/Session/DB_sessionKeepAlive");

    // zum debuggebn
    console.log(currentObjectProps);
  }, [currentObjectProps]);

  // anfangs scene laden, nach dem eine scene in der sceneList ausgewählt wurde
  useEffect(() => {
    const getSceneJsonString = async () => {
      const response = await fetch("/api/filesystem/FS_getSceneByID", {
        method: "POST",
        body: JSON.stringify({
          sceneID: props.scene.id,
        }),
      });

      const result = await response.json();

      loadSceneFromJsonString(result["data"]);
    };
    getSceneJsonString();
  }, []);

  // scene neu socket.io laden
  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();

      // socket.on("connect", () => {
      //   console.log("connected");
      // });

      socket.on("getSceneRefresh", (msg) => {
        // msg => scene id von der seite die jemand gespeichert hat
        //setInput([...input, msg]);xxxx
        console.log("scene wurde refresht: " + msg);
        setRefreshedSceneID(msg);

        if (msg == props.scene.id) {
          const handle = async () => {
            const response = await fetch("/api/filesystem/FS_getSceneByID", {
              method: "POST",
              body: JSON.stringify({
                sceneID: props.scene.id,
              }),
            });

            const result = await response.json();

            loadSceneFromJsonString(result["data"]);
          };
          handle();
        }
      });
    };
    socketInitializer();
  }, []);

  //debuggen

  useEffect(() => {
    console.log("Objekte in der szene hat sich geändert");
    console.log(models);
  }, [models]);

  // ----- FUNCTIONS ----

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
  async function safeSceneInFS() {
    // const files = await Promise.all(
    //   fbx_models_files.map(async (fileData) => {
    //     const { pathName, name, file } = fileData;
    //     const base64 = arrayBufferToBase64(await file.arrayBuffer()); //Convert the arrayBuffer of the file to a base64 encoded string
    //     return { pathName, name, file: base64 };
    //   })
    // );

    const toSaveObj = {
      //roomDimensions: roomDimensions,
      models: [...models], // models enthält alles was in der scene ist. Walls und FBX-Models
      //fbx_models: files,
    };
    const sceneJsonString = JSON.stringify(toSaveObj);

    console.log("safe Scene");
    console.log(sceneJsonString);

    // auf server laden, scene mit gleichen id uploaden ist quasi scene speichern

    const response = await fetch("/api/filesystem/FS_uploadScene", {
      method: "POST",
      body: JSON.stringify({
        jsonData: sceneJsonString,
        sceneID: props.scene.id,
      }),
    });
    const result = await response.json();

    alert("Scene wurde erfolgreich gespeichert (" + result["result"] + ")");
  }

  function isExportedScene(data: any) {
    return (
      typeof data === "object" &&
      data !== null &&
      // "roomDimensions" in data &&
      "models" in data
    );
  }

  async function loadSceneFromJsonString(jsonDataString: string) {
    const data = JSON.parse(jsonDataString);
    console.log("loadScene2");
    console.log(data.models);

    // prüfen ob der JSON string korrekt ist
    if (!isExportedScene(data)) {
      alert("The JSON data string is not compatible");
      return;
    }

    setModels(data.models);
  }

  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // ---- COMPONENT ----
  return (
    <Stack className="main">
      <MenuBar
        setScene={props.setScene}
        scene={props.scene}
        isTestMode={isTestMode}
      ></MenuBar>
      {/* <Typography>
        Scene: {props.scene.name}, testMode: {isTestMode ? "ja" : "nein"}
      </Typography> */}
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

        {/* ModelList j */}
        {props.user ? (
          props.user.readOnly ? null : (
            <>
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
                saveScene={safeSceneInFS}
                setIsTestMode={setIsTestMode}
                isTestMode={isTestMode}
                setCurentObj={setCurrentObjectProps}
                scene={props.scene}
                setHtmlSettings={setHtmlsettings}
                htmlSettings={htmlsettings}
              ></ToolBar>

              <WallList addWall={handleWallAdd}></WallList>

              {/* PropertieContainer */}
              <Stack
                style={{
                  background: "#d9d9d9",
                  width: "30%",
                }}
                className="properties"
              >
                {selectedOption == "chat" ? (
                  <Chat user={props.user} scene={props.scene}></Chat>
                ) : (
                  <>
                    <PropertieContainer
                      objProps={currentObjectProps}
                      setObjProps={setCurrentObjectProps}
                    ></PropertieContainer>
                    <Divider sx={{ margin: "8px" }}></Divider>
                    <SceneModelList
                      models={models}
                      currentObjProps={currentObjectProps}
                      setCurrentObj={setCurrentObjectProps}
                      deleteObject={handleModelDelete}
                      selectedId={treeViewSelectedId}
                    ></SceneModelList>
                  </>
                )}

                <RadioGroup
                  value={selectedOption}
                  onChange={handleOptionChange}
                >
                  <Stack direction={"row"}>
                    <FormControlLabel
                      value="chat"
                      control={<Radio />}
                      label="Chat"
                    />
                    <FormControlLabel
                      value="properties"
                      control={<Radio />}
                      label="Eigenschaften"
                    />
                  </Stack>
                </RadioGroup>
              </Stack>
            </>
          )
        ) : null}
        {/* Canvas */}
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

/*
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

      // if (data.roomDimensions) {
      //   setRoomDimensions({ ...data.roomDimensions });
      // }

      setModelPathsFS((prev) => [
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
*/
