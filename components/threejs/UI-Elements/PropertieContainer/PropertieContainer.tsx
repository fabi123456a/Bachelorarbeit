import {
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import NumberInput from "./NumberInput";
import ColorPicker from "./ColorPicker";
import TextureSelector from "./textureSelector";
import Draggable from "react-draggable";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { TypeObjectProps } from "../../../../pages/threejs/types";

// https://mui.com/material-ui/react-typography/#main-content
// links oben auf die 2 Striche klicken,
// dann sieht man alle Komponenten, mit beispielen, von MUI die man verwenden kann

// in objProps stehen die properties des currentObjects + funktionen wie z.B showPivotControlAxis
function PropertieContainer(props: {
  setObjProps: Function;
  objProps: TypeObjectProps;
  sessionID: string;
  idUser: string;
}) {
  const [visible, setVisible] = useState<boolean>(true);
  const [selectedValue, setSelectedValue] = useState(
    props.objProps ? (props.objProps.color ? "color" : "texture") : null
  ); // Standardwert

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  function handlePositionChange(position: string, value: number) {
    let newPosition: any = { ...props.objProps.position };
    newPosition[position] = value;

    props.setObjProps((prev: TypeObjectProps) => {
      return {
        ...prev,
        position: newPosition,
      };
    });
  }

  function handleScaleChange(position: string, value: number) {
    let newScale: any = { ...props.objProps.scale };
    newScale[position] = value;

    props.setObjProps((prev: TypeObjectProps) => {
      return {
        ...prev,
        scale: newScale,
      };
    });
  }

  function handleRotationChange(position: string, value: number) {
    let newRotation: any = { ...props.objProps.rotation };
    newRotation[position] = value;

    props.setObjProps((prev: TypeObjectProps) => {
      return {
        ...prev,
        rotation: newRotation,
      };
    });
  }

  useEffect(() => {
    setSelectedValue(
      props.objProps ? (props.objProps.color ? "color" : "texture") : null
    );
  }, [props.objProps]);

  return visible ? (
    <Stack className="properties roundedShadow">
      <Typography textAlign={"center"} fontSize={"1.25rem"} fontWeight={"bold"}>
        Eigenschaften
      </Typography>

      <Divider />
      {props.objProps ? (
        <Stack direction={"column"} padding="0.5rem">
          <Typography fontWeight={"bolder"}>Ausgewähltes Objekt</Typography>
          <Typography>Position</Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <NumberInput
                label="x"
                value={props.objProps ? props.objProps.position.x : ""}
                onChange={(e) =>
                  handlePositionChange("x", parseFloat(e.target.value) || 0)
                }
              />
            </Grid>
            <Grid item xs={4}>
              <NumberInput
                label="y"
                value={props.objProps ? props.objProps.position.y : ""}
                onChange={(e) =>
                  handlePositionChange("y", parseFloat(e.target.value) || 0)
                }
              />
            </Grid>
            <Grid item xs={4}>
              <NumberInput
                label="z"
                value={props.objProps ? props.objProps.position.z : ""}
                onChange={(e) =>
                  handlePositionChange("z", parseFloat(e.target.value) || 0)
                }
              />
            </Grid>
          </Grid>
          <Divider
            orientation="horizontal"
            flexItem
            style={{ marginLeft: "8px", marginRight: "8px" }}
          />
          <Stack direction={"column"}>
            <Typography>Skallierung</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <NumberInput
                  label="width"
                  value={props.objProps ? props.objProps.scale.x : ""}
                  onChange={(e) =>
                    handleScaleChange("x", parseFloat(e.target.value) || 0)
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <NumberInput
                  label="height"
                  value={props.objProps ? props.objProps.scale.y : ""}
                  onChange={(e) =>
                    handleScaleChange("y", parseFloat(e.target.value) || 0)
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <NumberInput
                  label="depth"
                  value={props.objProps ? props.objProps.scale.z : ""}
                  onChange={(e) =>
                    handleScaleChange("z", parseFloat(e.target.value) || 0)
                  }
                />
              </Grid>
            </Grid>
          </Stack>
          <Stack direction={"column"}>
            <Typography>Rotierung</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <NumberInput
                  label="x"
                  value={props.objProps ? props.objProps.rotation.x : ""}
                  onChange={(e) =>
                    handleRotationChange("x", parseFloat(e.target.value) || 0)
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <NumberInput
                  label="y"
                  value={props.objProps ? props.objProps.rotation.y : ""}
                  onChange={(e) =>
                    handleRotationChange("y", parseFloat(e.target.value) || 0)
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <NumberInput
                  label="z"
                  value={props.objProps ? props.objProps.rotation.z : ""}
                  onChange={(e) =>
                    handleRotationChange("z", parseFloat(e.target.value) || 0)
                  }
                />
              </Grid>
            </Grid>
          </Stack>
          <RadioGroup row value={selectedValue} onChange={handleRadioChange}>
            <FormControlLabel value="color" control={<Radio />} label="Farbe" />
            <FormControlLabel
              value="texture"
              control={<Radio />}
              label="Textur"
            />
          </RadioGroup>

          {!props.objProps.modelPath ? (
            <>
              {selectedValue == "color" ? (
                <ColorPicker
                  currentObjectProps={props.objProps}
                  setCurrentObjectProps={
                    props.setObjProps as (props: TypeObjectProps) => void
                  }
                ></ColorPicker>
              ) : (
                <TextureSelector
                  idUser={props.idUser}
                  sessionID={props.sessionID}
                  currentObjProps={props.objProps}
                  setCurrentObjProps={
                    props.setObjProps as (props: TypeObjectProps) => void
                  }
                  texture={props.objProps.texture}
                ></TextureSelector>
              )}
            </>
          ) : null}
        </Stack>
      ) : (
        <Typography fontSize={"small"} color="grey">
          kein Objekt ausgewählt
        </Typography>
      )}
    </Stack>
  ) : (
    <Stack
      className="showPropsBtn roundedShadow minOpenBtn"
      onClick={() => {
        setVisible(true);
      }}
    >
      <Typography>Eigenschaften</Typography>
    </Stack>
  );
}

export default PropertieContainer;
