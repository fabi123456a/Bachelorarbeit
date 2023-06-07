import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Insert from "./insert";
import EditData from "./editData";

const DatabaseTable = (props: {
  tableName: string;
  setAdminArea: (flag: boolean) => void;
}) => {
  const [data, setData] = useState<any[]>();
  const [properties, setProperties] = useState<string[]>();
  const [reload, setReload] = useState<number>(0);
  const [showEditData, setShowEditData] = useState<boolean>(false);

  const [actProp, setActProp] = useState<string>("");
  const [actDataRowID, setActDataRowID] = useState<string>("");
  const [actData, setActData] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("api/database/DB_getAll", {
          method: "POST",
          body: JSON.stringify({
            tableName: props.tableName,
          }),
        });

        const result = await response.json();
        if (!result) return;

        setData(result);
        setProperties(Object.keys(result[0]));
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, [props.tableName, reload]);

  return (
    <Stack>
      <Button
        style={{ height: "200px", background: "red" }}
        onClick={() => {
          props.setAdminArea(false);
        }}
      >
        Zurückgggggggg
      </Button>
      <Typography sx={{ alignSelf: "center", pb: "12px" }}>
        {data ? props.tableName : null}
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            {properties
              ? properties.map((prop: string) => (
                  <TableCell sx={{ fontWeight: "bold" }} key={prop}>
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
                      }}
                    >
                      {dataRow[prop]}
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
        ></EditData>
      ) : null}
    </Stack>
  );
};

export default DatabaseTable;
