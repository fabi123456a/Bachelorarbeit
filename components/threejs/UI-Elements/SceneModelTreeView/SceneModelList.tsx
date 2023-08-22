import {
  FormControl,
  FormLabel,
  Hidden,
  NativeSelect,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import TreeItem from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SceneModelListItem from "./ScenModeListItem";
import Draggable from "react-draggable";
import CloseIcon from "@mui/icons-material/Close";
import { TypeObjectProps } from "../../../../pages/threejs/types";

export default function SceneModelList(props: {
  models: TypeObjectProps[];
  currentObjProps: TypeObjectProps;
  setCurrentObj: (objProps: TypeObjectProps) => void;
  deleteObject: (id: string) => void;
  selectedId: string;
}) {
  const [selectedId, setSelectedId] = useState<string>(props.selectedId);
  const [visible, setVisible] = useState<boolean>(true);

  const handleTreeItemClick = (id) => {
    setSelectedId(id);
  };

  // useEffect(() => {
  //   alert(props.models.length);
  // }, [props]);

  return props.models ? (
    visible ? (
      <Stack className="sceneTreeView roundedShadow">
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          defaultExpanded={["scene"]}
          sx={{ overflowY: "auto", overflowX: "hidden" }}
        >
          <TreeItem
            nodeId="scene"
            label={<Typography fontWeight="bold">Szene</Typography>}
          >
            {props.models.map((model) => (
              // <Typography>{model.name}</Typography>
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
    ) : (
      <Stack
        className="roundedShadow treeViewBtn minOpenBtn"
        onClick={() => {
          setVisible(true);
        }}
      >
        <Typography>TreeView</Typography>
      </Stack>
    )
  ) : null;
}
