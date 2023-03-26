type TypeWallVisibility = {
  leftWall: boolean;
  rightWall: boolean;
};

type BoxGeometryValue = {
  positionXYZ: number[];
  scaleXYZ: number[];
};

type TypeModel = { name: string; path: string };

// position des Objects
type TypePosition = {
  x: number;
  y: number;
  z: number;
};

// skalierung des Objects
type TypeScale = {
  x: number;
  y: number;
  z: number;
};

// rotierung des Objects
type TypeRotation = {
  x: number;
  y: number;
  z: number;
};

// schnittstelle zum currentObject
type TypeObjectProps = {
  id: string;
  position: TypePosition;
  scale: TypeScale;
  rotation: TypeRotation;
  editMode: "scale" | "translate" | "rotate" | undefined;
  showXTransform: boolean;
  showYTransform: boolean;
  showZTransform: boolean;
  modelPath: string;
  removeBoundingBox: () => void;
};
type TypeCamPerspektive = {
  topDown: boolean;
  leftToMid: boolean;
  rightToMid: boolean;
  frontal: boolean;
};
type TypeRoomDimensions = {
  height: number;
  width: number;
  depth: number;
};

type TypeCamPosition = {
  topDown: THREE.Vector3;
  leftToMid: THREE.Vector3;
  rightToMid: THREE.Vector3;
  frontal: THREE.Vector3;
};

type ExportedScene = {
  roomDimensions: TypeRoomDimensions;
  models: TypeModel[];
  fbx_models: { pathName: string; name: string; file: string }[];
};
