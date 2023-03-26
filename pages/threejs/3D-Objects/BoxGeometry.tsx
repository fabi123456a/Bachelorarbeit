import React, { useRef } from "react";
import * as THREE from "three";

function BoxGeometry(props: {
  // position & skalieren der Box
  geometrie: BoxGeometryValue;
  color?: string;
}) {
  // ref auf das mesh der Box
  const ref = useRef<THREE.Mesh>(null);

  return (
    <>
      <mesh
        ref={ref}
        position={[
          props.geometrie.positionXYZ[0],
          props.geometrie.positionXYZ[1],
          props.geometrie.positionXYZ[2],
        ]}
      >
        <boxBufferGeometry args={props.geometrie.scaleXYZ} />
        <meshStandardMaterial color={props.color} />
      </mesh>
    </>
  );
}

export default BoxGeometry;
