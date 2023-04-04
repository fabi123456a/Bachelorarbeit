import {
  Button,
  FormControl,
  FormLabel,
  NativeSelect,
  Stack,
} from "@mui/material";
import React from "react";
import TreeItem from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function SceneModelListItem(props: {
  model: TypeObjectProps;
  currentObjProps: TypeObjectProps;
  setCurrentObj: (objProps: TypeObjectProps) => void;
  setSelectedId: (id: string) => void;
  selectedID: string;
  deleteObject: (id: string) => void;
}) {
  const handleIconClick = (e, id: string) => {
    e.stopPropagation();

    let result = confirm("Das Objekt wird gelöscht...");

    if (result) props.deleteObject(id);
  };

  return (
    <TreeItem
      key={props.model.id}
      nodeId={props.model.id}
      label={props.model.id}
      onClick={() => {
        // set selected id
        props.setSelectedId(props.model.id);

        //
        props.model.editMode = "translate";
        props.model.showXTransform = true;
        props.model.showYTransform = true;
        props.model.showZTransform = true;
        props.setCurrentObj(props.model);
      }}
      endIcon={
        props.selectedID === props.model.id ? (
          <Button onClick={(e) => handleIconClick(e, props.model.id)}>
            <DeleteForeverIcon />
          </Button>
        ) : null
      }
      sx={
        // abfragen ob es ein currentObj schon gibt und wenn ja, zusätzlich prüfen ob es das currentobj ist ist, also on´b model == currentObj
        props.currentObjProps
          ? props.currentObjProps.id == props.model.id
            ? { background: "lightgreen" }
            : null
          : null
      }
    ></TreeItem>
  );
}
