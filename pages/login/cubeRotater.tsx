import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { a } from "@react-spring/three";
import type { MutableRefObject } from "react";
import type { GroupProps } from "@react-three/fiber";
import { Vector2 } from "three";

type FollowMouseProps = {
  mesh: JSX.Element;
  mouse: MutableRefObject<Vector2>;
} & GroupProps;

export default function CubeRotater(props: { loggedIn: boolean }) {
  const mouse = useRef(new Vector2(0, 0));
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.set(
        e.clientX - window.innerWidth / 2,
        e.clientY - window.innerHeight / 2
      );
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  let styleAbsolute = {
    height: "300px",
    width: "300px",
    background: "",
    position: "absolute",
    left: 0,
    bottom: 0,
  };

  let styleNormal = {
    height: "300px",
    width: "300px",
  };

  return (
    <Canvas
      style={props.loggedIn ? styleAbsolute : styleNormal}
      camera={{ position: [0, 0, 10], fov: 70 }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[7, 7, 7]} />
      <FollowMouse
        mesh={
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshNormalMaterial />
          </mesh>
        }
        mouse={mouse}
      />
    </Canvas>
  );
}

function FollowMouse({ mesh, mouse, ...props }: FollowMouseProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  useFrame(() => {
    const x = (mouse.current.x / size.width) * 0.6 - 1;
    const y = -(mouse.current.y / size.height) * 0.6 + 1;
    const z = 0;
    const position = [x, y, z];
    groupRef.current.position.set(position[0], position[1], position[2]);
    groupRef.current.rotation.x = (y * Math.PI) / 8;
    groupRef.current.rotation.y = (x * Math.PI) / 8;
  });

  return (
    <a.group ref={groupRef} {...props}>
      {mesh}
    </a.group>
  );
}
