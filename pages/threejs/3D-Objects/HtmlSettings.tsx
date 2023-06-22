import { Checkbox, Stack, Typography } from "@mui/material";
import { Html } from "@react-three/drei";
import React, { Ref, useRef, useState } from "react";
import * as THREE from "three";
import { BufferGeometry, Material, Mesh } from "three";

function HtmlSettings(props: {
  flag: boolean;
  setCurentObj: (obj: TypeObjectProps) => void;
  currentObjProps: TypeObjectProps;
}) {
  return (
    <>
      {props.flag ? (
        <Html>
          <Stack direction={"row"}>
            <Typography>{props.currentObjProps.name}</Typography>

            <Checkbox
              checked={props.currentObjProps.visibleInOtherPerspective}
              onClick={(e) => {
                props.setCurentObj({
                  ...props.currentObjProps,
                  visibleInOtherPerspective:
                    !props.currentObjProps.visibleInOtherPerspective,
                });
              }}
            ></Checkbox>
          </Stack>
        </Html>
      ) : null}
    </>
  );
}

export default HtmlSettings;
