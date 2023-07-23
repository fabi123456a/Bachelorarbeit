export type TypeWallVisibility = {
  leftWall: boolean;
  rightWall: boolean;
};

export type BoxGeometryValue = {
  positionXYZ: number[];
  scaleXYZ: number[];
};

export type TypeModel = { name: string; path: string };

// position des Objects
export type TypePosition = {
  x: number;
  y: number;
  z: number;
};

// skalierung des Objects
export type TypeScale = {
  x: number; // beu cylinder -> radius
  y: number; // bei cylinder -> höhe
  z: number; // bei cylinder -> nix
};

// rotierung des Objects
export type TypeRotation = {
  x: number;
  y: number;
  z: number;
};

// schnittstelle zum currentObject
export type TypeObjectProps = {
  id: string;
  position: TypePosition;
  scale: TypeScale;
  rotation: TypeRotation;
  editMode: "scale" | "translate" | "rotate" | undefined;
  showXTransform: boolean;
  showYTransform: boolean;
  showZTransform: boolean;
  modelPath: string;
  visibleInOtherPerspective: boolean;
  name: string;
  info: string;
  color: string;
  texture: string;
  idScene: string;
};
export type TypeCamPerspektive = {
  topDown: boolean;
  leftToMid: boolean;
  rightToMid: boolean;
  frontal: boolean;
};

export type TypeRoomDimensions = {
  height: number;
  width: number;
  depth: number;
};

export type TypeCamPosition = {
  topDown: THREE.Vector3;
  leftToMid: THREE.Vector3;
  rightToMid: THREE.Vector3;
  frontal: THREE.Vector3;
};

export type ExportedScene = {
  roomDimensions: TypeRoomDimensions;
  models: TypeModel[];
  fbx_models: { pathName: string; name: string; file: string }[];
};
