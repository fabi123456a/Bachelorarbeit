import React from "react";
import BoxGeometry from "./BoxGeometry";

export default function Room({
  height,
  width,
  depth,
  leftWall,
  rightWall,
}: {
  height: number;
  width: number;
  depth: number;
  leftWall: boolean;
  rightWall: boolean;
}) {
  return (
    <>
      {/* Raum */} {/* TODO: eigene Komponete für den Raum */}
      {/* Boden */}
      <BoxGeometry
        geometrie={{ positionXYZ: [0, 0, 0], scaleXYZ: [width, 0.001, depth] }}
        color="grey"
      ></BoxGeometry>
      {/* Wand Links */}
      {leftWall ? (
        <BoxGeometry
          geometrie={{
            positionXYZ: [-width / 2, height / 2, 0],
            scaleXYZ: [0.001, height, depth],
          }}
          color="#328da8"
        ></BoxGeometry>
      ) : null}
      {/* Wand Rechts */}
      {rightWall ? (
        <BoxGeometry
          geometrie={{
            positionXYZ: [width / 2, height / 2, 0],
            scaleXYZ: [0.001, height, depth],
          }}
          color="#328da8"
        ></BoxGeometry>
      ) : null}
      {/* Wand Hinten */}
      <BoxGeometry
        geometrie={{
          positionXYZ: [0, height / 2, -depth / 2],
          scaleXYZ: [width, height, 0.001],
        }}
        color="#328da8"
      ></BoxGeometry>
    </>
  );
}
