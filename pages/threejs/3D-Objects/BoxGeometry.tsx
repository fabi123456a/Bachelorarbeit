import React, { Ref, useRef, useState } from "react";
import * as THREE from "three";
import { BufferGeometry, Material, Mesh } from "three";
import HtmlSettings from "./HtmlSettings";

function BoxGeometry(props: {
  // position & skalieren der Box
  geometrie: BoxGeometryValue;
  onclick?: () => void;
  ref123?: Ref<Mesh<BufferGeometry, Material | Material[]>>;
  testMode: boolean;
  color: string;
  htmlSettings: boolean;
  setCurentObj: (obj: TypeObjectProps) => void;
  currentObjProps: TypeObjectProps;
}) {
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
        <meshStandardMaterial color={props.color} />
        {props.htmlSettings ? (
          <HtmlSettings
            flag={true}
            currentObjProps={props.currentObjProps}
            setCurentObj={props.setCurentObj}
          ></HtmlSettings>
        ) : null}
      </mesh>
    </>
  );
}

export default BoxGeometry;
