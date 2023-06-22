import { FormControl, FormLabel, NativeSelect, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import TreeItem from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SceneModelListItem from "./ScenModeListItem";
import { checkPropsForNull } from "../../../../utils/checkIfPropIsNull";

export default function SceneModelList(props: {
  models: TypeObjectProps[];
  currentObjProps: TypeObjectProps;
  setCurrentObj: (objProps: TypeObjectProps) => void;
  deleteObject: (id: string) => void;
  selectedId: string;
}) {
  const [selectedId, setSelectedId] = useState<string>(props.selectedId);

  const handleTreeItemClick = (id) => {
    setSelectedId(id);
  };

  // bedingtes rendern
  if (checkPropsForNull(props)) return null;

  return (
    <Stack
      sx={{
        height: "300px",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        defaultExpanded={["scene"]}
      >
        <TreeItem nodeId="scene" label="Scene">
          {props.models.map((model) => (
            <SceneModelListItem
              currentObjProps={props.currentObjProps}
              setCurrentObj={props.setCurrentObj}
              model={model}
              key={model.id}
              setSelectedId={handleTreeItemClick}
              selectedID={props.selectedId}
              deleteObject={props.deleteObject}
              models={props.models}
            ></SceneModelListItem>
          ))}
        </TreeItem>
      </TreeView>
    </Stack>
  );
}
