import { Typography, Stack, Button } from "@mui/material";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { fetchData } from "../utils/fetchData";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import {
  Debug,
  Physics,
  useBox,
  usePlane,
  useSphere,
  useTrimesh,
  useCylinder,
  useConvexPolyhedron,
} from "@react-three/cannon";

function Box() {
  const [ref, api] = useBox(() => ({ mass: 1, position: [0, 5, 0] }));

  return (
    <mesh
      ref={ref}
      onClick={() => {
        let min = -20;
        let max = 20;
        api.velocity.set(
          Math.random() * (max - min) + min,
          Math.random() * (max - min) + min,
          Math.random() * (max - min) + min / 2
        );
      }}
    >
      <boxBufferGeometry attach={"geometry"} args={[0.5, 0.5, 0.5]} />
      <meshLambertMaterial attach={"material"} color={"pink"} />
    </mesh>
  );
}

function Plane() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  const [ref1] = useBox(() => ({
    position: [0, 0, 5.5],
    args: [17, 500, 0.1],
  }));
  const [ref2] = useBox(() => ({
    position: [0, 0, -5.5],
    args: [17, 500, 0.1],
  }));
  const [ref3] = useBox(() => ({
    position: [-8.5, 0, 0],
    args: [0.1, 500, 20],
  }));
  const [ref4] = useBox(() => ({
    position: [8.5, 0, 0],
    args: [0.1, 500, 20],
  }));

  return (
    <>
      {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeBufferGeometry attach={"geometry"} args={[17, 11]} />
        <meshLambertMaterial attach={"material"} color={"green"} />
      </mesh>
      <mesh position={[0, 0, 5.5]}>
        <boxBufferGeometry attach={"geometry"} args={[17, 5, 0.1]} />
        <meshLambertMaterial attach={"material"} color={"blue"} />
      </mesh>
      <mesh position={[0, 0, -5.5]}>
        <boxBufferGeometry attach={"geometry"} args={[17, 5, 0.1]} />
        <meshLambertMaterial attach={"material"} color={"blue"} />
      </mesh>
      <mesh position={[8.5, 0, 0]}>
        <boxBufferGeometry attach={"geometry"} args={[0.1, 5, 20]} />
        <meshLambertMaterial attach={"material"} color={"blue"} />
      </mesh>
      <mesh position={[-8.5, 0, 0]}>
        <boxBufferGeometry attach={"geometry"} args={[0.1, 5, 20]} />
        <meshLambertMaterial attach={"material"} color={"blue"} />
      </mesh> */}
    </>
  );
}

const Test = () => {
  return (
    <Stack
      sx={{
        //background: "red",
        position: "absolute",
        height: "100%",
        width: "100%",
        pointerEvents: "none",
      }}
    >
      <Canvas
        sx={{}}
        camera={{
          position: [0, 10, 0],
          fov: 60,
        }} // Setze die Kameraposition und das Sichtfeld (fov)
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        {/* <OrbitControls /> */}

        <ambientLight intensity={0.5} />
        <spotLight position={[20, 15, 10]} angle={0.3} intensity={1} />
        <Physics>
          <Plane />
          <Box />
        </Physics>
      </Canvas>
    </Stack>
  );
};

export default Test;

{
  /* <mesh rotation={[0, 0, 0]} position={[0, 0, 5.5]}>
        <planeBufferGeometry attach={"geometry"} args={[17, 11]} />
        <meshLambertMaterial attach={"material"} color={"blue"} />
      </mesh>
      <mesh rotation={[0, 0, 0]} position={[0, 0, -5.5]}>
        <planeBufferGeometry attach={"geometry"} args={[17, 11]} />
        <meshLambertMaterial attach={"material"} color={"blue"} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[8.5, 0, 0]}>
        <planeBufferGeometry attach={"geometry"} args={[17, 11]} />
        <meshLambertMaterial attach={"material"} color={"blue"} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[-8.5, 0, 0]}>
        <planeBufferGeometry attach={"geometry"} args={[17, 11]} />
        <meshLambertMaterial attach={"material"} color={"blue"} />
      </mesh>
    </> */
}
