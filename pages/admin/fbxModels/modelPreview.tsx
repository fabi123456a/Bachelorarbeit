import { useRef } from "react";
import { Canvas, useLoader } from "react-three-fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "@react-three/drei";

export default function ModelPreview(props: { fbxName: string }) {
  const fbxRef = useRef();
  const fbxModel = props.fbxName
    ? useLoader(FBXLoader, "./ModelsFBX/" + props.fbxName)
    : null;

  return props.fbxName ? (
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
  ) : null;
}
