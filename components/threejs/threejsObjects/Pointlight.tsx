import { useEffect, useRef } from "react";
import { TransformControls, SpotLight, Box, Html } from "@react-three/drei";
import * as THREE from "three";
import { Vector3 } from "three";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useFrame } from "@react-three/fiber";

// KOMPONENTE

function PointlightPivot(props: {
  isSelected: boolean;
  camPerspektive: string;
  controlsRef: React.RefObject<any>;
  setCurrentObjectProps: (props: TypeObjectProps) => void;
  objProps?: TypeObjectProps;
}) {
  // referenz auf das Mesh des FBX-Models
  const refMesh = useRef<THREE.Mesh>(null);
  const tcRef = useRef<any>(null);
  const boxRef = useRef<THREE.Mesh>();
  const x = useRef<THREE.Mesh>();

  useFrame(() => {
    // Aktualisiere die Rotation der Box-Komponente
    if (!boxRef.current) return;
    if (props.objProps) return;
    boxRef.current.lookAt(0, 0, 0);
  });

  // function
  const setCurrentObj = () => {
    // position des Objects als Vektor3
    let vectorPosition: Vector3 = new Vector3();
    refMesh.current?.getWorldPosition(vectorPosition);

    // skalierung des Objects als Vektor3
    let vektorScale: Vector3 = new Vector3();
    refMesh.current?.getWorldScale(vektorScale);

    props.setCurrentObjectProps({
      id: props.objProps ? props.objProps.id : "licht1",
      position: {
        x: vectorPosition.x,
        y: vectorPosition.y,
        z: vectorPosition.z,
      },
      scale: {
        x: vektorScale.x,
        y: vektorScale.y,
        z: vektorScale.z,
      },
      rotation: {
        x: tcRef.current?.object.rotation.x ?? 0,
        y: tcRef.current?.object.rotation.y ?? 0,
        z: tcRef.current?.object.rotation.z ?? 0,
      },
      editMode: props.objProps ? props.objProps.editMode : "translate", //props.editMode,
      showXTransform: true, //props.showXTransform,
      showYTransform: true, //props.showYTransform,
      showZTransform: true, //props.showZTransform,
      modelPath: null,
      info: "licht",
      visibleInOtherPerspective: true,
      name: props.objProps ? props.objProps.name : "lichtquelle",
      color: "",
      texture: "",
      idScene: props.objProps.idScene,
    });
  };

  useEffect(() => {
    //alert(props.info + props.color);
  }, []);

  return (
    <TransformControls
      ref={tcRef}
      mode={props.objProps ? props.objProps.editMode : "translate"}
      showX={props.isSelected}
      showY={props.isSelected}
      showZ={props.isSelected}
      position={props.objProps ? [10, 10, 10] : [27, 27, -27]}
      onMouseUp={(e) => {
        //Checks if an event happened or if component just rerendered
        if (e) {
          setCurrentObj();
          console.log("_Kamerarotation frei");

          if (props.camPerspektive === "normal") {
            // kamera rotation nur freigeben wenn camPerspektive normal (== "0") ist, bei othogonaler perpektive soll cam drehen nicht gehen
            props.controlsRef.current.enableRotate = true;
          }
        }
      }}
      onMouseDown={(e) => {
        //Checks if an event happened or if component just rerendered
        if (e) {
          console.log("_Kamerarotation sperren");
          props.controlsRef.current.enableRotate = false;
        }
      }}
      onClick={(e) => {
        if (e) {
          e.stopPropagation();

          //insertBoundingBox();
        }
      }}
    >
      {props.objProps ? (
        <group>
          <pointLight intensity={1.5}></pointLight>
          {/* <Sphere
                onClick={(e) => {
                  if (e) {
                    setCurrentObj();
                  }
                }}
                position={[0, 0, 0]}
                scale={[1, 1, 1]}
              >
                <meshStandardMaterial color="red" />
              </Sphere> */}
          <Html>
            <LightModeIcon
              color="warning"
              onClick={(e) => {
                if (e) {
                  setCurrentObj();
                }
              }}
            ></LightModeIcon>
          </Html>
        </group>
      ) : (
        // <pointLight intensity={2}></pointLight>

        <group>
          <Box
            args={[1, 1, 2]} // Args for the buffer geometry
            ref={boxRef}
            onClick={(e) => {
              if (e) {
                setCurrentObj();
              }
            }}
            position={[0, 1, 0]}
          >
            <meshStandardMaterial color={"red"} />
          </Box>
          <SpotLight
            distance={300}
            angle={1}
            attenuation={5}
            anglePower={10} // Diffuse-cone anglePower (default: 5)
          ></SpotLight>
          <Html>
            <LightModeIcon color="warning"></LightModeIcon>
          </Html>
        </group>
      )}

      {/* <mesh
            ref={boxRef}
            geometry={new THREE.ConeGeometry(1, 2, 32)}
            material={new THREE.MeshStandardMaterial({ color: "hotpink" })}
            onClick={(e) => {
              if (e) {
                setCurrentObj();
              }
            }}
          >
            <meshStandardMaterial color="hotpink" />
          </mesh> */}
    </TransformControls>
  );
}

export default PointlightPivot;
