import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";

const Cube = () => {
  const cubeRef = useRef<THREE.Mesh>();
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta / 2;
      cubeRef.current.rotation.y += delta / 1;
    }
  });

  useEffect(() => {
    camera.position.z = 4;
  }, [camera]);

  const piece = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
  const material = new THREE.MeshBasicMaterial({
    vertexColors: true,
  });
  const positionAttribute = piece.getAttribute("position");
  const colors = [];

  const color = new THREE.Color();

  for (let i = 0; i < positionAttribute.count; i += 6) {
    color.setHex(0xffffff * Math.random());

    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);

    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
  }

  // define the new attribute
  piece.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  return <mesh ref={cubeRef} geometry={piece} material={material} />;
};

export default Cube;
