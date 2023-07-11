import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import CloseIcon from "@mui/icons-material/Close";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const EditData = (props: {
  setShowEdit: (flag: boolean) => void;
  tableName: string;
  porpertie: string;
  id: string;
  currentData: string;
  setReload: (n: number) => void;
  dataType: string;
  setActProp: (props: string) => void;
  setActData: (data: string) => void;
  setActDataRowID: (id: string) => void;
}) => {
  const [stringValue, setStringValue] = useState<string>(props.currentData);
  const [boolValue, setBoolValue] = useState<boolean>(
    props.dataType === "boolean"
      ? props.currentData == "true" || props.currentData == "1"
        ? true
        : false
      : null
  );

  const editDataInDatabase = async () => {
    const response = await fetch("/api/database/DB_updateTable", {
      method: "POST",
      body: JSON.stringify({
        tableName: props.tableName,
        id: props.id,
        prop: props.porpertie,
        newData: props.dataType === "string" ? stringValue : boolValue,
      }),
    });
  };

  return (
    <Stack
      className="editData roundedShadow"
      position={"relative"}
      sx={{ padding: "12px" }}
    >
      <IconButton
        sx={{
          position: "absolute",
          right: "-18px",
          top: "-18px",
          background: "white",
        }}
        className="iconButton"
        onClick={() => {
          props.setActProp(null);
          props.setActData(null);
          props.setActDataRowID(null);
          props.setShowEdit(false);
        }}
      >
        <HighlightOffIcon></HighlightOffIcon>
      </IconButton>

      {props.dataType === "string" ? (
        <TextField
          label={props.porpertie}
          value={stringValue}
          onChange={(e) => {
            setStringValue(e.target.value);
          }}
        ></TextField>
      ) : null}
      {props.dataType === "boolean" ? (
        <Stack direction={"row"} sx={{ alignItems: "center" }}>
          <Checkbox
            checked={boolValue}
            onChange={(e) => {
              setBoolValue(e.target.checked);
            }}
          ></Checkbox>
          <Typography>
            {/* {props.dataType + ", " + props.currentData + ", " + boolValue} */}
            {props.porpertie}
          </Typography>
        </Stack>
      ) : null}
      <Button
        onClick={() => {
          editDataInDatabase(); // TODO: prüfen ob das löschen überhaupt funktioniert hat
          props.setReload(Math.random());
          props.setShowEdit(false);
        }}
      >
        Ändern
      </Button>
    </Stack>
  );
};

export default EditData;
