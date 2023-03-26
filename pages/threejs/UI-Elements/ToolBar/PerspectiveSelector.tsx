import { FormControl, FormLabel, NativeSelect } from "@mui/material";
import React from "react";

export default function PerspectiveSelector(props: {
  setOrtho: Function;
  controlsRef: React.RefObject<any>;
  setPerspective: Function;
  setWallVisibility: (flag: TypeWallVisibility) => void;
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
      <NativeSelect
        disableUnderline
        onChange={(e) => {
          const camPerspective = e.target.value;
          // wenn Kameraperspektive geändert wurde, "0" = normale perspektive
          if (camPerspective !== "0") {
            props.setOrtho(true);
            props.controlsRef.current.enableRotate = false;
          } else {
            props.setOrtho(false);
            props.controlsRef.current.enableRotate = false;
            props.setPerspective(camPerspective);
            props.setWallVisibility({ leftWall: true, rightWall: true });
          }
          switch (camPerspective) {
            case "1": // topDown
              props.setPerspective(camPerspective);
              props.setWallVisibility({ leftWall: false, rightWall: false });
              break;
            case "2": // frontal
              props.setPerspective(camPerspective);
              props.setWallVisibility({ leftWall: false, rightWall: false });
              break;
            case "3": // leftMid
              props.setPerspective(camPerspective);
              props.setWallVisibility({ leftWall: false, rightWall: true });
              break;
            case "4": // rightMid
              props.setPerspective(camPerspective);
              props.setWallVisibility({ leftWall: true, rightWall: false });
              break;
          }
        }}
      >
        <option value={"0"} label="Normal" />
        <option value={"1"} label="TopDown" />
        <option value={"2"} label="Frontal" />
        <option value={"3"} label="LeftMid" />
        <option value={"4"} label="RightMid" />
      </NativeSelect>
    </FormControl>
  );
}
