import React, { Ref, useEffect, useState } from "react";
import { BufferGeometry, Material, Mesh } from "three";
import HtmlSettings from "./HtmlSettings";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { useLoader } from "@react-three/fiber";
import { BoxGeometryValue, TypeObjectProps } from "../../../pages/threejs/types";

function BoxGeometry(props: {
  // position & skalieren der Box
  geometrie: BoxGeometryValue;
  onclick?: () => void;
  ref123?: Ref<Mesh<BufferGeometry, Material | Material[]>>;
  testMode: boolean;
  color: string;
  htmlSettings: boolean;
  setCurentObj: (obj: TypeObjectProps) => void;
  objProps: TypeObjectProps;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] =
    props.objProps
      ? props.objProps.texture
        ? useLoader(TextureLoader, [
            `./textures/${props.objProps.texture}/Substance_Graph_BaseColor.jpg`,
            `./textures/${props.objProps.texture}/Substance_Graph_Height.jpg`,
            `./textures/${props.objProps.texture}/Substance_Graph_Normal.jpg`,
            `./textures/${props.objProps.texture}/Substance_Graph_Roughness.jpg`,
            `./textures/${props.objProps.texture}/Substance_Graph_AmbientOcclusion.jpg`,
          ])
        : []
      : [];

  useEffect(() => {
    if (
      (colorMap && displacementMap && normalMap && roughnessMap && aoMap) ||
      (props.objProps && !props.objProps.texture)
    ) {
      setIsLoading(false);
    }
  }, [colorMap, displacementMap, normalMap, roughnessMap, aoMap]);

  if (isLoading && props.objProps && props.objProps.texture) {
    return null;
  }

  return props.objProps ? (
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
      <boxGeometry
        args={[
          props.geometrie.scaleXYZ[0],
          props.geometrie.scaleXYZ[1],
          props.geometrie.scaleXYZ[2],
        ]}
      />
      {colorMap && displacementMap && normalMap && roughnessMap && aoMap ? (
        <meshStandardMaterial
          map={colorMap}
          // displacementMap={displacementMap} // ausblenden
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          aoMap={aoMap}
          color={props.objProps ? props.color : ""} // TODO:
        />
      ) : (
        <meshStandardMaterial color={props.color ? props.color : ""} />
        // <meshBasicMaterial
        //   color={props.color ? props.color : ""}
        // ></meshBasicMaterial>
      )}

      {props.htmlSettings ? (
        <HtmlSettings
          flag={true}
          currentObjProps={props.objProps}
          setCurentObj={props.setCurentObj}
        ></HtmlSettings>
      ) : null}
    </mesh>
  ) : null;
}

export default BoxGeometry;

// normal deviced coordinates
