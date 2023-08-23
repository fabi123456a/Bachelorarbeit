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
  const [user, setUser] = useState<User[]>();
  const [properties, setProperties] = useState<string[]>();
  const [reload, setReload] = useState<number>(0);
  // const [showEditData, setShowEditData] = useState<boolean>(false);

  // const [actProp, setActProp] = useState<string>("");
  // const [actDataRowID, setActDataRowID] = useState<string>("");
  // const [actData, setActData] = useState<string>("");
  // const [actDataType, setActDataType] = useState<string>("");

  const deleteUserByID = async (idUser: string): Promise<boolean> => {
    const requestedDelete = await fetchData(
      props.user.id,
      props.sessionID,
      "user",
      "delete",
      { id: idUser },
      null,
      null
    );

    if (!requestedDelete) {
      console.log("error while delete a user by id: " + idUser);
      return false;
    }
    return true;
  };

  const changeRight = async (
    idUser: string,
    right: "read" | "write" | "delete" | "isAdmin",
    flag: boolean
  ): Promise<boolean> => {
    const requestedDelete = await fetchData(
      props.user.id,
      props.sessionID,
      "user",
      "update",
      { id: idUser },
      { [right]: flag },
      null
    );

    if (!requestedDelete) {
      console.log("error while update right from user");
      return false;
    }
    return true;
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const requestedUser = await fetchData(
          props.user.id,
          props.sessionID,
          "user",
          "select",
          {},
          null,
          null
        );

        if (!requestedUser) {
          console.log("fetch user failed");
          return;
        }

        setUser(requestedUser);
        setProperties(Object.keys(requestedUser[0]));
      } catch (error) {
        console.error(error);
        setUser(null);
      }
    }

    fetchUser();
  }, [reload]);

  return (
    <Stack className="databaseTableContainer">
      <Stack className="roundedShadow">
        <Typography sx={{ p: "12px" }} fontWeight={"bold"} fontSize={"20px"}>
          {user ? "Alle Benutzer" : null}
        </Typography>

        <Table size="small" className="">
          <TableHead>
            <TableRow>
              {properties
                ? properties.map((prop: string) => {
                    if (prop == "password" || prop == "id") return;
                    return (
                      <TableCell sx={{ fontWeight: "bold" }} key={prop}>
                        {prop}
                      </TableCell>
                    );
                  })
                : null}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user
              ? user.map((dataRow: any) => (
                  <TableRow key={dataRow["id"]}>
                    {properties.map((prop: string) => {
                      if (prop == "password" || prop == "id") return;
                      return (
                        <TableCell
                          key={dataRow[prop] + dataRow["id"] + prop}
                          onClick={async () => {
                            // if (
                            //   prop === "id" ||
                            //   prop == "password" ||
                            //   prop == "email"
                            // ) {
                            //   alert("Das kann nicht geändert werden.");
                            //   return;
                            // }
                            // setActProp(prop);
                            // setActDataRowID(dataRow["id"]);
                            // setActData(dataRow[prop]);
                            // setShowEditData(true);
                            // setActDataType(typeof dataRow[prop]);

                            // alert(actProp);

                            if (dataRow["id"] == "ADMIN") {
                              alert("Der Admin kann nicht geändert werden");
                              return;
                            }

                            const flag = await changeRight(
                              dataRow["id"],
                              prop as "read" | "write" | "delete" | "isAdmin",
                              !dataRow[prop]
                            );

                            if (!flag) {
                              alert("Das konnte nicht geändert werden.");
                              return;
                            }
                            setReload(Math.random());
                          }}
                          // sx={
                          //   actProp == prop &&
                          //   actData == dataRow[prop] &&
                          //   actDataRowID == dataRow["id"]
                          //     ? { background: "#ffef62" }
                          //     : {}
                          // }
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
                    <TableCell>
                      {dataRow["id"] == "ADMIN" ? null : (
                        <Button
                          color="error"
                          size={"small"}
                          onClick={async () => {
                            const erg = await deleteUserByID(dataRow["id"]);

                            if (!erg) {
                              alert("Löschen des Benutzers Fehlgeschlagen.");
                              return;
                            }
                            alert(
                              "Der Benutzer " +
                                dataRow["email"] +
                                " wurde gelöscht."
                            );
                            setReload(Math.random());
                          }}
                        >
                          Löschen
                        </Button>
                      )}
                    </TableCell>
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

      {/* {showEditData ? (
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
      ) : null} */}
    </Stack>
  );
};

export default DatabaseTable;
