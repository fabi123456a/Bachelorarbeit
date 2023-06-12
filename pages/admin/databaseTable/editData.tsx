import { Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";

const EditData = (props: {
  setShowEdit: (flag: boolean) => void;
  tableName: string;
  porpertie: string;
  id: string;
  currentData: string;
  setReload: (n: number) => void;
  dataType: string;
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
    <Stack className="editData">
      <Typography>
        {props.dataType + ", " + props.currentData + ", " + boolValue}
      </Typography>
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
        <Checkbox
          checked={boolValue}
          onChange={(e) => {
            setBoolValue(e.target.checked);
          }}
        ></Checkbox>
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
      <Button
        onClick={() => {
          props.setShowEdit(false);
        }}
      >
        Schließen
      </Button>
    </Stack>
  );
};

export default EditData;
