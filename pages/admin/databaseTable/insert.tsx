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

const Insert = (props: {
  tableName: string;
  porperties: string[];
  setReload: (zahl: number) => void;
}) => {
  const [textFields, setTextFields] = useState<string[]>([]);

  const handleTextFieldChange = (index: number, value: string) => {
    const updatedTextFields = [...textFields];
    updatedTextFields[index] = value;
    setTextFields(updatedTextFields);
  };

  const handleInsert = async () => {
    let insertData = createObjectFromArray(props.porperties);

    const response = await fetch("/api/database/DB_insertInTable", {
      method: "POST",
      body: JSON.stringify({
        tableName: props.tableName,
        data: insertData,
      }),
    });
  };

  const createObjectFromArray = (keys: string[]): { [key: string]: any } => {
    const obj: { [key: string]: any } = {};

    keys.forEach((key) => {
      obj[key] = textFields[props.porperties.indexOf(key)]; // Du kannst den initialen Wert hier anpassen, falls erforderlich
    });

    return obj;
  };

  return (
    <Stack>
      <Typography fontWeight={"bold"} fontSize={"20px"}>
        Neuen {props.tableName} erstellen
      </Typography>
      {props.porperties
        ? props.porperties.map((prop: string, index: number) => (
            <Stack>
              <Typography>{prop}</Typography>
              <TextField
                label={prop}
                onChange={(e) => handleTextFieldChange(index, e.target.value)}
              ></TextField>
            </Stack>
          ))
        : null}
      <Button
        onClick={() => {
          handleInsert();
          props.setReload(Math.random());
        }}
      >
        Insert
      </Button>
    </Stack>
  );
};

export default Insert;
