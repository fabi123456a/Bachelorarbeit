import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  NativeSelect,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import TreeItem from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { checkPropsForNull } from "../../../../utils/checkIfPropIsNull";
import { TypeObjectProps } from "../../../../pages/threejs/types";

export default function SceneModelListItem(props: {
  model: TypeObjectProps;
  currentObjProps: TypeObjectProps;
  setCurrentObj: (objProps: TypeObjectProps) => void;
  setSelectedId: (id: string) => void;
  selectedID: string;
  deleteObject: (id: string) => void;
  models: TypeObjectProps[];
}) {
  const [rename, setRename] = useState<boolean>(false);
  const [name, setName] = useState<string>(
    props.model ? props.model.name : null
  );

  const handleDeleteClick = (e, id: string) => {
    e.stopPropagation();

    let result = confirm("Das Objekt wird gelöscht...");

    if (result) props.deleteObject(id);
  };

  const saveNewName = () => {
    props.models.forEach((model1) => {
      if (model1.id == props.model.id) {
        model1.name = name;
      }
    });
  };

  return props.model ? (
    <>
      {rename ? (
        <Stack direction={"row"}>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></TextField>
          <Button
            onClick={() => {
              saveNewName();
              setRename(false);
              alert("Änderungen werden nur aktiv wenn gespeichert wird!");
            }}
          >
            ok
          </Button>
        </Stack>
      ) : (
        <TreeItem
          key={props.model.id}
          nodeId={props.model.id}
          label={props.model.name ? props.model.name : props.model.id}
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
              <Stack direction={"row"}>
                {/* <Button onClick={(e) => handleIconClick(e, props.model.id)}> */}
                <DeleteForeverIcon
                  onClick={(e) => handleDeleteClick(e, props.model.id)}
                />

                <DriveFileRenameOutlineIcon
                  sx={{ mr: "4px" }}
                  onClick={(e) => {
                    setRename((prev) => !prev);
                  }}
                />
              </Stack>
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
      )}
    </>
  ) : null;
}
