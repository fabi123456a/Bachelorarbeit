import * as THREE from "three";
import { useEffect, useRef } from "react";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { useLoader } from "@react-three/fiber";

const Cube = () => {
  const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] = useLoader(
    TextureLoader,
    [
      "./textures/wood/Substance_Graph_BaseColor.jpg",
      "./textures/wood/Substance_Graph_Height.jpg",
      "./textures/wood/Substance_Graph_Normal.jpg",
      "./textures/wood/Substance_Graph_Roughness.jpg",
      "./textures/wood/Substance_Graph_AmbientOcclusion.jpg",
    ]
  );

  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        map={colorMap}
        displacementMap={displacementMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        aoMap={aoMap}
      />
    </mesh>
  );
};

export default Cube;

/*
      PAVING STONES
      "./textures/pavingStones/PavingStones092_1K_Color.jpg",
      "./textures/pavingStones/PavingStones092_1K_Displacement.jpg",
      "./textures/pavingStones/PavingStones092_1K_NormalGL.jpg",
      "./textures/pavingStones/PavingStones092_1K_Roughness.jpg",
      "./textures/pavingStones/PavingStones092_1K_AmbientOcclusion.jpg",

      WOOD
      "./textures/wood/Substance_Graph_BaseColor.jpg",
      "./textures/wood/Substance_Graph_Height.jpg",
      "./textures/wood/Substance_Graph_Normal.jpg",
      "./textures/wood/Substance_Graph_Roughness.jpg",
      "./textures/wood/Substance_Graph_AmbientOcclusion.jpg",
*/
