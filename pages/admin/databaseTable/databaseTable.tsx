import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Insert from "./insert";
import EditData from "./editData";

const DatabaseTable = (props: { tableName: string }) => {
  const [data, setData] = useState<any[]>();
  const [properties, setProperties] = useState<string[]>();
  const [types, setTypes] = useState<string[]>();
  const [reload, setReload] = useState<number>(0);
  const [showEditData, setShowEditData] = useState<boolean>(false);

  const [actProp, setActProp] = useState<string>("");
  const [actDataRowID, setActDataRowID] = useState<string>("");
  const [actData, setActData] = useState<string>("");
  const [actDataType, setActDataType] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>(null);

  // {id: "x", loginID: "rr", password: "rr", readOnly: true}

  useEffect(() => {
    // lädt alle Daten aus props.tablename
    async function loadData() {
      try {
        const response = await fetch("api/database/DB_getAll", {
          method: "POST",
          body: JSON.stringify({
            tableName: props.tableName,
            orderBy: sortBy,
          }),
        });

        const result = await response.json();
        if (!result) return;

        setData(result);
        setProperties(Object.keys(result[0]));

        // const dataTypes = Object.values(result[0]).map((value) => typeof value);
        // setX(dataTypes);
        const dataTypes = Object.values(result[0]).map((value) => typeof value);

        setTypes(dataTypes);

        //console.log(result[0]);
      } catch (error) {
        console.error(error);
        setData(null);
      }
    }

    loadData();
  }, [props.tableName, reload, sortBy]);

  return (
    <Stack>
      <Typography sx={{ alignSelf: "center", pb: "12px" }}>
        {data ? props.tableName : null}
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            {properties
              ? properties.map((prop: string) => (
                  <TableCell
                    sx={{ fontWeight: "bold" }}
                    key={prop}
                    onClick={() => {
                      setSortBy(prop);
                    }}
                  >
                    {prop}
                  </TableCell>
                ))
              : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            ? data.map((dataRow: any) => (
                <TableRow key={dataRow["id"]}>
                  {properties.map((prop: string) => (
                    <TableCell
                      key={dataRow[prop] + dataRow["id"] + prop}
                      onClick={() => {
                        if (prop === "id") {
                          alert("ID's ändern ist eine schlechte Idee :(");
                          return;
                        }
                        setActProp(prop);
                        setActDataRowID(dataRow["id"]);
                        setActData(dataRow[prop]);
                        setShowEditData(true);
                        setActDataType(typeof dataRow[prop]);
                      }}
                    >
                      {/* {dataRow[prop]} */}
                      {typeof dataRow[prop] === "boolean"
                        ? dataRow[prop]
                          ? "Ja"
                          : "Nein" // Convert boolean to string representation
                        : dataRow[prop]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
      <Stack sx={{ margin: "24px" }}>
        <Insert
          tableName={props.tableName}
          porperties={properties}
          setReload={setReload}
          types={types}
        ></Insert>
      </Stack>
      {showEditData ? (
        <EditData
          setShowEdit={setShowEditData}
          tableName={props.tableName}
          porpertie={actProp}
          id={actDataRowID}
          currentData={actData}
          setReload={setReload}
          dataType={actDataType}
        ></EditData>
      ) : null}
    </Stack>
  );
};

export default DatabaseTable;
