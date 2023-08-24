import {
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import ExpandIcon from "@mui/icons-material/Expand";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import LockIcon from "@mui/icons-material/Lock";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ThreeSixtyIcon from "@mui/icons-material/ThreeSixty";
import PerspectiveSelector from "./PerspectiveSelector";
import SaveIcon from "@mui/icons-material/Save";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Scene } from "@prisma/client";
import ShowHtml from "./showHtml";
import Draggable from "react-draggable";
import CloseIcon from "@mui/icons-material/Close";
import { TypeObjectProps } from "../../../../pages/threejs/types";

let socket1;

function ToolBar(props: {
  currentObjProps: TypeObjectProps; // ist gleich die currentObjectProps
  setObjProps: Function;
  controlsRef: React.RefObject<any>;
  deleteObject: (id: string) => void; // funktion um ein Object/Model aus der Szene zu entfernen
  exportObject: () => void;
  importObject: (file: File | null) => void;
  removeObject: () => void;
  setPerspective: (perspective: string) => void; // funktion setzt die Kamera Perspektive -> "0"=normal, "1"=topDown, "2"=frontal, "3"=leftMid, "4"=rightMid
  setWallVisibility: (flag: boolean) => void;
  saveScene: (idScene: string) => void;
  setIsTestMode: (flag: boolean) => void;
  isTestMode: boolean;
  setCurentObj: (obj: TypeObjectProps) => void;
  scene: Scene;
  setHtmlSettings: (flag: boolean) => void;
  htmlSettings: boolean;
}) {
  const [visible, setVisible] = useState<boolean>(true);

  const checkIfAObjectIsSelected = (): boolean => {
    if (!props.currentObjProps) return false;
    return true;
  };

  function resetEditMode() {
    props.setObjProps((prev: TypeObjectProps) => {
      return {
        ...prev,
        editMode: undefined,
        showXTransform: false,
        showYTransform: false,
        showZTransform: false,
      };
    });
  }

  function setEditMode(editMode: "translate" | "scale" | "rotate") {
    props.setObjProps((prev: TypeObjectProps) => {
      console.log(prev);
      if (prev.info == "wall" && editMode == "scale") {
        return {
          ...prev,
          editMode: editMode,
          showXTransform: false,
          showYTransform: true,
          showZTransform: true,
        };
      }
      if (prev.info == "floor" && editMode == "scale") {
        return {
          ...prev,
          editMode: editMode,
          showXTransform: true,
          showYTransform: false,
          showZTransform: true,
        };
      }

      return {
        ...prev,
        editMode: editMode,
        showXTransform: true,
        showYTransform: true,
        showZTransform: true,
      };
    });
  }

  const buttonWithTextStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0",
  };

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket1 = io();
    };
    socketInitializer();
  }, []);

  return visible ? (
    <Stack className="toolBar roundedShadow">
      {/* <CloseIcon
          className="iconButton"
          onClick={() => {
            setVisible(false);
          }}
        ></CloseIcon> */}
      {/* Transform: Verschieben, Rotieren & Skalieren */}
      <Stack direction={"row"}>
        <FormControl
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {props.currentObjProps ? (
            <>
              <FormLabel>Transform</FormLabel>
              <Stack direction={"row"} style={{ width: "100%" }}>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  style={{ width: "100%" }}
                >
                  {/* Verschieben */}
                  <IconButton
                    color={
                      props.currentObjProps.editMode === "translate" || //vorher war ohne  || !props.currentObjProps.editMode, weil sonderfall, am anfamng ist editmode undefinded weil es keinen wert initial in der DB gibt
                      !props.currentObjProps.editMode
                        ? "primary"
                        : undefined
                    }
                    onClick={() => {
                      if (!checkIfAObjectIsSelected()) return;
                      if (props.currentObjProps.editMode === "translate") {
                        resetEditMode();
                        return;
                      }
                      setEditMode("translate");
                    }}
                  >
                    <OpenWithIcon></OpenWithIcon>
                  </IconButton>
                  {/* Skalieren */}
                  <IconButton
                    color={
                      props.currentObjProps.editMode === "scale"
                        ? "primary"
                        : undefined
                    }
                    onClick={() => {
                      if (!checkIfAObjectIsSelected()) return;
                      if (props.currentObjProps.editMode === "scale") {
                        resetEditMode();
                        return;
                      }
                      setEditMode("scale");
                    }}
                  >
                    <ExpandIcon></ExpandIcon>
                  </IconButton>
                  {/* Rotieren */}
                  <IconButton
                    color={
                      props.currentObjProps.editMode === "rotate"
                        ? "primary"
                        : undefined
                    }
                    onClick={() => {
                      if (!checkIfAObjectIsSelected()) return;
                      if (props.currentObjProps.editMode === "rotate") {
                        resetEditMode();
                        return;
                      }
                      setEditMode("rotate");
                    }}
                  >
                    <ThreeSixtyIcon></ThreeSixtyIcon>
                  </IconButton>
                  {/* Sperren */}
                  {/* <IconButton
                    color={
                      props.currentObjProps.editMode === undefined
                        ? "primary"
                        : undefined
                    }
                    onClick={() => {
                      if (!checkIfAObjectIsSelected()) return;
                      resetEditMode();
                    }}
                  >
                    <LockIcon></LockIcon>
                  </IconButton> */}
                </Stack>
                <Stack>
                  <IconButton
                    onClick={() => {
                      if (!checkIfAObjectIsSelected()) {
                        alert("Kein Objekt ausgewählt");
                        return;
                      }

                      let result = confirm("Das Objekt wird gelöscht...");

                      if (result) props.deleteObject(props.currentObjProps.id);
                    }}
                  >
                    <DeleteForeverIcon></DeleteForeverIcon>
                  </IconButton>
                </Stack>
              </Stack>
            </>
          ) : (
            <>
              <FormLabel>Transform</FormLabel>
              <Stack direction={"row"} style={{ width: "100%" }}>
                <Typography color="grey" fontSize={"small"}>
                  kein Objekt ausgewählt
                </Typography>
              </Stack>
            </>
          )}
        </FormControl>
      </Stack>

      <Divider orientation="vertical" flexItem />

      {/* Kamera Perpektiven: normal, top-down, ... */}
      <Stack>
        <PerspectiveSelector
          controlsRef={props.controlsRef}
          setPerspective={props.setPerspective}
          setWallVisibility={props.setWallVisibility}
          setIsTestMode={props.setIsTestMode}
          isTestMode={props.isTestMode}
          setCurrentObj={props.setCurentObj}
        />
      </Stack>

      <Divider orientation="vertical" flexItem />

      {/* Laden/Speichern & Expotieren */}
      <Stack justifyContent={"center"} alignItems={"center"}>
        <FormLabel>Dateien</FormLabel>
        <Stack direction="row" gap="1rem" style={{ background: "" }}>
          <IconButton
            title="Export current Scene as GLTF"
            style={{ ...(buttonWithTextStyle as any) }}
            onClick={() => {
              props.exportObject();
            }}
          >
            <ImportExportIcon></ImportExportIcon>
            <Typography fontSize=".75rem">Export</Typography>
          </IconButton>
          <IconButton
            style={{ ...(buttonWithTextStyle as any) }}
            title="Save current Scene"
            onClick={() => {
              props.saveScene(props.scene.id); // TODO: await props.safeScene

              // socket1.emit("sceneRefresh", props.scene.id);
              alert("Scene wurde gespeichert");
            }}
          >
            <SaveIcon></SaveIcon>
            <Typography fontSize=".75rem">Save</Typography>
          </IconButton>
        </Stack>
      </Stack>

      <Divider orientation="vertical" flexItem />

      {/* World setting*/}
      <Stack justifyContent={"center"} alignItems={"center"}>
        <Typography>Welt</Typography>
        <ShowHtml
          htmlSettings={props.htmlSettings}
          setHtmlSettings={props.setHtmlSettings}
        ></ShowHtml>
      </Stack>
    </Stack>
  ) : (
    <Stack
      className="showToolbarBtn roundedShadow minOpenBtn"
      onClick={() => {
        setVisible(true);
      }}
    >
      <Typography>Toolbar</Typography>
    </Stack>
  );
}

export default ToolBar;
