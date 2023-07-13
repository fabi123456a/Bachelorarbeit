import Checkbox from "@mui/material/Checkbox";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Insert = (props: {
  tableName: string;
  porperties: string[];
  setReload: (zahl: number) => void;
  types: string[];
  sessionID: string;
  idUser: string;
}) => {
  const [values, setValues] = useState<any[]>([]);

  const handleTextFieldChange = (index: number, value: any) => {
    const updatedTextFields = [...values];
    updatedTextFields[index] = value;
    setValues(updatedTextFields);
  };

  const handleInsert = async () => {
    let insertData = createObjectFromArray(props.porperties);

    const response = await fetch("/api/database/DB_insertInTable", {
      method: "POST",
      body: JSON.stringify({
        tableName: props.tableName,
        data: insertData,
        sessionID: props.sessionID,
        idUser: props.idUser,
      }),
    });

    const erg = await response.json();

    return erg;
  };

  const createObjectFromArray = (keys: string[]): { [key: string]: any } => {
    if (keys.length <= 0) return;

    const obj: { [key: string]: any } = {};

    keys.forEach((key, index) => {
      if (key == "id") obj[key] = uuidv4();
      else
        obj[key] =
          values[props.porperties.indexOf(key)] == undefined &&
          props.types[index] == "boolean"
            ? false
            : values[props.porperties.indexOf(key)];
    });

    return obj;
  };

  function hasUndefinedProperty(obj: any): boolean {
    for (const key in obj) {
      if (obj[key] === undefined) {
        return true;
      }
    }
    return false;
  }

  return (
    <Stack>
      <Typography
        fontWeight={"bold"}
        fontSize={"20px"}
        sx={{ alignSelf: "center" }}
      >
        Neuen {props.tableName} erstellen
      </Typography>
      {props.porperties
        ? props.porperties.map((prop: string, index: number) => {
            if (prop === "id") {
              return null; // Überspringe den Code für "id"
            }

            return (
              <Stack key={prop}>
                {/* <Typography>
                  {prop}, {props.types[index]}
                </Typography> */}
                {props.types[index] === "string" ? (
                  <TextField
                    sx={{ margin: "8px", maxWidth: "200px" }}
                    key={prop}
                    label={prop}
                    onChange={(e) =>
                      handleTextFieldChange(index, e.target.value)
                    }
                  ></TextField>
                ) : (
                  <Stack direction={"row"} className="centerV">
                    <Checkbox
                      onChange={(e) => {
                        handleTextFieldChange(index, e.target.checked);
                      }}
                    ></Checkbox>
                    <Typography>{prop}</Typography>
                  </Stack>
                )}
              </Stack>
            );
          })
        : null}
      <Button
        onClick={async () => {
          let insertData = createObjectFromArray(props.porperties);
          if (hasUndefinedProperty(insertData)) {
            alert(
              "Füllen Sie alles aus. Wenn alles ausgefüllt ist, muss die Checkbox min. einmal angeklickt werden."
            );
            return;
          }
          const flag = await handleInsert();

          if (!flag || flag.error) {
            alert(flag.error);
            return;
          }

          alert("DB_insertInTable erfolgreich");
          props.setReload(Math.random());
        }}
      >
        Hinzufügen
      </Button>
    </Stack>
  );
};

export default Insert;
