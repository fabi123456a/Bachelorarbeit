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
import DownloadIcon from "@mui/icons-material/Download";
import SaveIcon from "@mui/icons-material/Save";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import PublishIcon from "@mui/icons-material/Publish";
import RemoveIcon from "@mui/icons-material/Remove";

function ToolBar(props: {
  objProps: TypeObjectProps; // ist gleich die currentObjectProps
  setObjProps: Function;
  controlsRef: React.RefObject<any>;
  deleteObject: (id: string) => void; // funktion um ein Object/Model aus der Szene zu entfernen
  exportObject: () => void;
  importObject: (file: File | null) => void;
  removeObject: () => void;
  setOrtho: (flag: boolean) => void; // funktion die ein boolean setzt, ob gerade ein Orthografische Kamera aktiv ist
  setPerspective: (perspective: string) => void; // funktion setzt die Kamera Perspektive -> "0"=normal, "1"=topDown, "2"=frontal, "3"=leftMid, "4"=rightMid
  setWallVisibility: (flag: TypeWallVisibility) => void;
  saveScene: () => void;
  loadScene: (file: File | null) => void;
}) {
  // funktion
  const checkIfAObjectIsSelected = (): boolean => {
    if (!props.objProps) return false;
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

  return (
    <Stack
      direction={"row"}
      alignItems="stretch"
      alignContent="center"
      gap="1rem"
      justifyContent="center"
    >
      {/* Transform: Verschieben, Rotieren & Skalieren */}
      <Stack direction={"row"}>
        <FormControl
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {props.objProps ? (
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
                      props.objProps.editMode === "translate"
                        ? "primary"
                        : undefined
                    }
                    onClick={() => {
                      if (!checkIfAObjectIsSelected()) return;
                      if (props.objProps.editMode === "translate") {
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
                      props.objProps.editMode === "scale"
                        ? "primary"
                        : undefined
                    }
                    onClick={() => {
                      if (!checkIfAObjectIsSelected()) return;
                      if (props.objProps.editMode === "scale") {
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
                      props.objProps.editMode === "rotate"
                        ? "primary"
                        : undefined
                    }
                    onClick={() => {
                      if (!checkIfAObjectIsSelected()) return;
                      if (props.objProps.editMode === "rotate") {
                        resetEditMode();
                        return;
                      }
                      setEditMode("rotate");
                    }}
                  >
                    <ThreeSixtyIcon></ThreeSixtyIcon>
                  </IconButton>
                  {/* Sperren */}
                  <IconButton
                    color={
                      props.objProps.editMode === undefined
                        ? "primary"
                        : undefined
                    }
                    onClick={() => {
                      if (!checkIfAObjectIsSelected()) return;
                      resetEditMode();
                    }}
                  >
                    <LockIcon></LockIcon>
                  </IconButton>
                </Stack>
                <Stack>
                  <IconButton
                    onClick={() => {
                      if (!checkIfAObjectIsSelected()) {
                        alert("Kein Objekt ausgewählt");
                        return;
                      }

                      props.deleteObject(props.objProps.id);
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
                <Typography color="grey">
                  Noch kein Objekt ausgewählt.
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
          setOrtho={props.setOrtho}
          controlsRef={props.controlsRef}
          setPerspective={props.setPerspective}
          setWallVisibility={props.setWallVisibility}
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
            title="View GLTF scene"
            style={{ ...(buttonWithTextStyle as any) }}
            onClick={() => {
              const inputElement = document.createElement("input");
              inputElement.type = "file";
              document.body.appendChild(inputElement);
              inputElement.click();
              document.body.removeChild(inputElement);
              inputElement.addEventListener("change", (e) => {
                const target = e.target as HTMLInputElement;
                if (target?.files && target?.files[0]) {
                  props.importObject(target.files[0]);
                }
              });
            }}
          >
            <PublishIcon></PublishIcon>
            <Typography fontSize=".75rem">Add View</Typography>
          </IconButton>
          <IconButton
            title="Remove Gltf Scene View"
            style={{ ...(buttonWithTextStyle as any) }}
            onClick={() => {
              props.removeObject();
            }}
          >
            <RemoveIcon></RemoveIcon>
            <Typography fontSize=".75rem">Remove View</Typography>
          </IconButton>
          <IconButton
            title="Load Scene"
            style={{ ...(buttonWithTextStyle as any) }}
            onClick={() => {
              const inputElement = document.createElement("input");
              inputElement.type = "file";
              document.body.appendChild(inputElement);
              inputElement.click();
              document.body.removeChild(inputElement);
              inputElement.addEventListener("change", (e) => {
                const target = e.target as HTMLInputElement;
                if (target?.files && target?.files[0]) {
                  props.loadScene(target.files[0]);
                }
              });
            }}
          >
            <DownloadIcon></DownloadIcon>
            <Typography fontSize=".75rem">Load</Typography>
          </IconButton>
          <IconButton
            style={{ ...(buttonWithTextStyle as any) }}
            title="Save current Scene"
            onClick={() => {
              props.saveScene();
            }}
          >
            <SaveIcon></SaveIcon>
            <Typography fontSize=".75rem">Save</Typography>
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default ToolBar;
