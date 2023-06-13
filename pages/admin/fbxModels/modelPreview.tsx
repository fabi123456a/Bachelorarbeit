import React, { useRef, useEffect, useState } from "react";
import { Canvas, useLoader } from "react-three-fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import THREE from "three";
import { CircularProgress } from "@mui/material";

const ModelPreview = (props: { fbxName: string }) => {
  const fbxRef = useRef();
  const fbxModel = useLoader(FBXLoader, "./ModelsFBX/" + props.fbxName);

  return (
    <Canvas
      style={{
        height: "200px",
        width: "200px",
        border: "1px solid black",
        margin: "2px",
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls></OrbitControls>
      <primitive object={fbxModel.clone()} ref={fbxRef} />
    </Canvas>
  );
};

export default ModelPreview;
