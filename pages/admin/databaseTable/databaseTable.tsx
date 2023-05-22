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

const DatabaseTable = (props: { tableName: string }) => {
  const [data, setData] = useState<any[]>();
  const [properties, setProperties] = useState<string[]>();

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
  }, [props.tableName]);

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
                        alert(prop);
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
        <Insert tableName={props.tableName} porperties={properties}></Insert>
      </Stack>
    </Stack>
  );
};

export default DatabaseTable;
