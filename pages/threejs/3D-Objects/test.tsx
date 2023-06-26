import * as THREE from "three";
import { useEffect, useRef } from "react";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { useLoader } from "@react-three/fiber";

const Cube = () => {
  const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] = useLoader(
    TextureLoader,
    [
      "./textures/sciFi/Substance_Graph_BaseColor.jpg",
      "./textures/sciFi/Substance_Graph_Height.png",
      "./textures/sciFi/Substance_Graph_Normal.jpg",
      "./textures/sciFi/Substance_Graph_Roughness.jpg",
      "./textures/sciFi/Substance_Graph_AmbientOcclusion.jpg",
    ]
  );

  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        map={colorMap}
        //displacementMap={displacementMap}
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

      STOFF
      "./textures/stoff/Substance_Graph_BaseColor.jpg",
      "./textures/stoff/Substance_Graph_Height.png",    // !! PNG
      "./textures/stoff/Substance_Graph_Normal.jpg",
      "./textures/stoff/Substance_Graph_Roughness.jpg",
      "./textures/stoff/Substance_Graph_AmbientOcclusion.jpg",

      STONEFLOOR
      "./textures/stoneFloor/Substance_Graph_BaseColor.jpg",
      "./textures/stoneFloor/Substance_Graph_Height.jpg",
      "./textures/stoneFloor/Substance_Graph_Normal.jpg",
      "./textures/stoneFloor/Substance_Graph_Roughness.jpg",
      "./textures/stoneFloor/Substance_Graph_AmbientOcclusion.jpg",

      WOODMETAL
      "./textures/woodMetal/Substance_Graph_BaseColor.jpg",
      "./textures/woodMetal/Substance_Graph_Height.png",  // !!  PNG
      "./textures/woodMetal/Substance_Graph_Normal.jpg",
      "./textures/woodMetal/Substance_Graph_Roughness.jpg",
      "./textures/woodMetal/Substance_Graph_AmbientOcclusion.jpg",

      METAL
      "./textures/metal/Substance_Graph_BaseColor.jpg",
      "./textures/metal/Substance_Graph_Height.png",
      "./textures/metal/Substance_Graph_Normal.jpg",
      "./textures/metal/Substance_Graph_Roughness.jpg",
      "./textures/metal/Substance_Graph_AmbientOcclusion.jpg",

      SCFI
      "./textures/sciFi/Substance_Graph_BaseColor.jpg",
      "./textures/sciFi/Substance_Graph_Height.png",
      "./textures/sciFi/Substance_Graph_Normal.jpg",
      "./textures/sciFi/Substance_Graph_Roughness.jpg",
      "./textures/sciFi/Substance_Graph_AmbientOcclusion.jpg",
*/
