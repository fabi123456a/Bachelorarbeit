import Checkbox from "@mui/material/Checkbox";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { fetchData } from "../../../utils/fetchData";
import { User } from "@prisma/client";

const Insert = (props: {
  setReload: (zahl: number) => void;
  sessionID: string;
  idUser: string;
}) => {
  const [txtLogin, setTxtxLogin] = useState<string>("");
  const [txtPw, setTxtPw] = useState<string>("");
  const [checkedRead, setCheckedRead] = useState(false);
  const [checkedWrite, setCheckedWrite] = useState(false);
  const [checkedUpdate, setCheckedUpdate] = useState(false);
  const [checkedDelete, setCheckedDelete] = useState(false);
  const [checkedAdmin, setCheckedAdmin] = useState(false);

  const handleInsert = async () => {
    let insertData: User = {
      id: uuidv4(),
      loginID: txtLogin,
      password: txtPw,
      read: checkedRead,
      write: checkedWrite,
      delete: checkedDelete,
      isAdmin: checkedAdmin,
    };

    // const response = await fetch("/api/database/DB_insertInTable", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     tableName: props.tableName,
    //     data: insertData,
    //     sessionID: props.sessionID,
    //     idUser: props.idUser,
    //   }),
    // });

    // const erg = await response.json();

    const requestInsert = await fetchData(
      props.idUser,
      props.sessionID,
      "user",
      "create",
      null,
      insertData,
      null
    );

    if (requestInsert.err) return;

    return requestInsert;
  };

  return (
    <Stack>
      <Typography
        fontWeight={"bold"}
        fontSize={"20px"}
        sx={{ alignSelf: "center" }}
      >
        Neuen User erstellen
      </Typography>
      <Stack sx={{ m: "10px", maxWidth: "300px" }}>
        <TextField
          label="Login ID"
          value={txtLogin}
          onChange={(e) => {
            setTxtxLogin(e.target.value);
          }}
        ></TextField>
      </Stack>
      <Stack sx={{ m: "10px", maxWidth: "300px" }}>
        <TextField
          label="Passwort"
          value={txtPw}
          onChange={(e) => {
            setTxtPw(e.target.value);
          }}
        ></TextField>
      </Stack>
      <Stack direction={"row"} sx={{ alignItems: "center" }}>
        <Checkbox
          checked={checkedRead}
          onChange={(e) => {
            setCheckedRead(e.target.checked);
          }}
        ></Checkbox>
        <Typography>lesen</Typography>
      </Stack>
      <Stack direction={"row"} sx={{ alignItems: "center" }}>
        <Checkbox
          checked={checkedWrite}
          onChange={(e) => {
            setCheckedWrite(e.target.checked);
          }}
        ></Checkbox>
        <Typography>schreiben</Typography>
      </Stack>
      <Stack direction={"row"} sx={{ alignItems: "center" }}>
        <Checkbox
          checked={checkedUpdate}
          onChange={(e) => {
            setCheckedUpdate(e.target.checked);
          }}
        ></Checkbox>
        <Typography>updaten</Typography>
      </Stack>
      <Stack direction={"row"} sx={{ alignItems: "center" }}>
        <Checkbox
          checked={checkedDelete}
          onChange={(e) => {
            setCheckedDelete(e.target.checked);
          }}
        ></Checkbox>
        <Typography>löschen</Typography>
      </Stack>
      <Stack direction={"row"} sx={{ alignItems: "center" }}>
        <Checkbox
          checked={checkedAdmin}
          onChange={(e) => {
            setCheckedAdmin(e.target.checked);
          }}
        ></Checkbox>
        <Typography>ist Admin</Typography>
      </Stack>
      <Button
        onClick={async () => {
          await handleInsert();
          props.setReload(Math.random());
        }}
      >
        Hinzufügen
      </Button>
    </Stack>
  );
};

export default Insert;
