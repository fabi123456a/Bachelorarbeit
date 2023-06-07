import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const EditData = (props: {
  setShowEdit: (flag: boolean) => void;
  tableName: string;
  porpertie: string;
  id: string;
  currentData: string;
  setReload: (n: number) => void;
}) => {
  const [txt, setTxt] = useState<string>(props.currentData);

  const editDataInDatabase = async () => {
    const response = await fetch("/api/database/DB_updateTable", {
      method: "POST",
      body: JSON.stringify({
        tableName: props.tableName,
        id: props.id,
        prop: props.porpertie,
        newData: txt,
      }),
    });
  };

  return (
    <Stack className="editData">
      <TextField
        label={props.porpertie}
        value={txt}
        onChange={(e) => {
          setTxt(e.target.value);
        }}
      ></TextField>
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
