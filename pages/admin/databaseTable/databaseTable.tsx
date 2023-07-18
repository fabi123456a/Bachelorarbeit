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
import { User } from "@prisma/client";
import {fetchData} from "../../fetchData";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

const DatabaseTable = (props: {
  tableName: string;
  showInsert: boolean;
  sessionID: string;
  user: User;
}) => {
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
        // const response = await fetch("api/database/DB_getAll", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     tableName: props.tableName,
        //     orderBy: sortBy,
        //     sessionID: props.sessionID,
        //     idUser: props.user.id,
        //   }),
        // });

        // const result = await response.json();
        // if (!result || result["error"]) return;

        // TODO: sortBy
        const request = await fetchData(
          props.user.id,
          props.sessionID,
          props.tableName,
          "select",
          {},
          null,
          null
        );

        if (request.err) return;

        setData(request);
        setProperties(Object.keys(request[0]));

        // const dataTypes = Object.values(result[0]).map((value) => typeof value);
        // setX(dataTypes);
        const dataTypes = Object.values(request[0]).map(
          (value) => typeof value
        );
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
    <Stack className="databaseTableContainer roundedShadow">
      <Stack className="roundedShadow">
        <Typography
          sx={{ alignSelf: "center", pb: "12px" }}
          fontWeight={"bold"}
          fontSize={"20px"}
        >
          {data ? "alle " + props.tableName + "'s" : null}
        </Typography>

        <Table size="small" className="">
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
                            //alert("ID's ändern ist eine schlechte Idee :(");
                            return;
                          }
                          setActProp(prop);
                          setActDataRowID(dataRow["id"]);
                          setActData(dataRow[prop]);
                          setShowEditData(true);
                          setActDataType(typeof dataRow[prop]);
                        }}
                        sx={
                          actProp == prop &&
                          actData == dataRow[prop] &&
                          actDataRowID == dataRow["id"]
                            ? { background: "#ffef62" }
                            : {}
                        }
                      >
                        {/* {dataRow[prop]} */}
                        {typeof dataRow[prop] === "boolean" ? (
                          dataRow[prop] ? (
                            <CheckIcon color="success"></CheckIcon>
                          ) : (
                            <CloseIcon color="error"></CloseIcon>
                          )
                        ) : (
                          dataRow[prop]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </Stack>

      {props.showInsert ? (
        <Stack className="roundedShadow">
          <Insert
            idUser={props.user.id}
            sessionID={props.sessionID}
            tableName={props.tableName}
            porperties={properties}
            setReload={setReload}
            types={types}
          ></Insert>
        </Stack>
      ) : null}

      {showEditData ? (
        <EditData
          idUser={props.user.id}
          sessionID={props.sessionID}
          setShowEdit={setShowEditData}
          tableName={props.tableName}
          porpertie={actProp}
          id={actDataRowID}
          currentData={actData}
          setReload={setReload}
          dataType={actDataType}
          setActData={setActData}
          setActDataRowID={setActDataRowID}
          setActProp={setActProp}
        ></EditData>
      ) : null}
    </Stack>
  );
};

export default DatabaseTable;
