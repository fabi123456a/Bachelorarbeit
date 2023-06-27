import {
  FormControl,
  FormLabel,
  IconButton,
  NativeSelect,
} from "@mui/material";
import React, { useRef } from "react";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";

export default function PerspectiveSelector(props: {
  controlsRef: React.RefObject<any>;
  setPerspective: Function;
  setWallVisibility: (flag: boolean) => void;
  setIsTestMode: (flag: boolean) => void;
  isTestMode: boolean;
  setCurrentObj: (obj: TypeObjectProps) => void;
}) {
  return (
    <FormControl
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <FormLabel>Perspektive</FormLabel>
      <IconButton
        onClick={() => {
          props.setIsTestMode(!props.isTestMode);
          props.setCurrentObj(null);

          !props.isTestMode
            ? alert(
                "TESTMODUS AKTIV \n\n BEWEGUNG \n w = nach vorne \n a = nach links \n s = nach hinten \n d = nach rechts \n r = hoch \n f = runter \n\n KAMERA \n q = kamera nach links neigen \n e = kamera nach rechts neigen \n maus + linke Maustaste = umgucken"
              )
            : null;
        }}
        color={props.isTestMode ? "success" : "default"}
      >
        <DirectionsWalkIcon />
      </IconButton>
      {props.isTestMode ? null : (
        <NativeSelect
          disableUnderline
          onChange={(e) => {
            const camPerspective: string = e.target.value;

            if (camPerspective !== "normal") {
              props.controlsRef.current.enableRotate = false;
              // setPerspective & setWallVisibility wird weiter unten gesetzt
            } else {
              props.controlsRef.current.enableRotate = true;
              props.setPerspective(camPerspective);
              props.setWallVisibility(true);
            }

            // unnötig TODO: setPerspective & setWallVisibility oben reinpacken
            switch (camPerspective) {
              case "topdown": // topDown
                props.setPerspective(camPerspective);
                props.setWallVisibility(false);
                break;
              case "frontal": // frontal
                props.setPerspective(camPerspective);
                props.setWallVisibility(false);
                break;
              case "leftmid": // leftMid
                props.setPerspective(camPerspective);
                props.setWallVisibility(false);
                break;
              case "rightmid": // rightMid
                props.setPerspective(camPerspective);
                props.setWallVisibility(false);
                break;
            }
          }}
        >
          <option value={"normal"} label="Normal" />
          <option value={"topdown"} label="TopDown" />
          <option value={"frontal"} label="Frontal" />
          <option value={"leftmid"} label="LeftMid" />
          <option value={"rightmid"} label="RightMid" />
        </NativeSelect>
      )}
    </FormControl>
  );
}
