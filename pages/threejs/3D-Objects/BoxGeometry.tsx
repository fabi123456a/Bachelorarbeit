import React, { Ref, useRef, useState } from "react";
import * as THREE from "three";
import { BufferGeometry, Material, Mesh } from "three";

function BoxGeometry(props: {
  // position & skalieren der Box
  geometrie: BoxGeometryValue;
  onclick?: () => void;
  ref123?: Ref<Mesh<BufferGeometry, Material | Material[]>>;
  testMode: boolean;
  color?: string;
}) {
  const defaultColor = "#328da8";
  const highlightColor = "#fffb00";

  return (
    <>
      <mesh
        ref={props.ref123}
        position={[
          props.geometrie.positionXYZ[0],
          props.geometrie.positionXYZ[1],
          props.geometrie.positionXYZ[2],
        ]}
        onClick={(e) => {
          if (e) {
            props.onclick ? props.onclick() : null;
          }
        }}
      >
        <boxBufferGeometry args={props.geometrie.scaleXYZ} />
        <meshStandardMaterial color={props.color ? props.color : null} />
      </mesh>
    </>
  );
}

export default BoxGeometry;
