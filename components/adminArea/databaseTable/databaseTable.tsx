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
import { fetchData } from "../../../utils/fetchData";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

const DatabaseTable = (props: {
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
          "user",
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
  }, [reload, sortBy]);

  return (
    <Stack className="databaseTableContainer">
      <Stack className="roundedShadow">
        <Typography sx={{ p: "12px" }} fontWeight={"bold"} fontSize={"20px"}>
          {data ? "Alle Benutzer" : null}
        </Typography>

        <Table size="small" className="">
          <TableHead>
            <TableRow>
              {properties
                ? properties.map((prop: string) => {
                    if (prop == "password" || prop == "id") return;
                    return (
                      <TableCell
                        sx={{ fontWeight: "bold" }}
                        key={prop}
                        onClick={() => {
                          setSortBy(prop);
                        }}
                      >
                        {prop}
                      </TableCell>
                    );
                  })
                : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ? data.map((dataRow: any) => (
                  <TableRow key={dataRow["id"]}>
                    {properties.map((prop: string) => {
                      if (prop == "password" || prop == "id") return;
                      return (
                        <TableCell
                          key={dataRow[prop] + dataRow["id"] + prop}
                          onClick={() => {
                            if (prop === "id" || prop == "password") {
                              alert("Das kann nicht geändert werden.");
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
                      );
                    })}
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
            setReload={setReload}
          ></Insert>
        </Stack>
      ) : null}

      {showEditData ? (
        <EditData
          idUser={props.user.id}
          sessionID={props.sessionID}
          setShowEdit={setShowEditData}
          tableName={"user"}
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
