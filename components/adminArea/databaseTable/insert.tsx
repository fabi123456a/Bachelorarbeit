import Checkbox from "@mui/material/Checkbox";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { fetchData } from "../../../utils/fetchData";
import { User } from "@prisma/client";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { SHA256 } from "crypto-js";

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

  // legt einen User an und gibt ihn zurück
  const handleInsert = async (): Promise<User> => {
    if (!txtLogin || !txtPw) {
      alert("Bitte geben Sie einen Benutzernamen UND ein Passwort an.");
      return;
    }

    let insertData: User = {
      id: uuidv4(),
      email: txtLogin,
      password: SHA256(txtPw).toString(),
      read: checkedRead,
      write: checkedWrite,
      delete: checkedDelete,
      isAdmin: checkedAdmin,
    };

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
      <Stack direction={"row"} sx={{ alignItems: "center" }}>
        <Typography fontWeight={"bold"} fontSize={"20px"} sx={{ p: "12px" }}>
          Neuen Benutzer erstellen
        </Typography>
        <PersonAddAltIcon
          color={"success"}
          sx={{ m: "10px" }}
        ></PersonAddAltIcon>
      </Stack>

      <Stack sx={{ m: "10px", maxWidth: "300px" }}>
        <TextField
          label="E-Mail"
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
          const insertedUser = await handleInsert();
          if (!insertedUser) {
            alert("Fehler beim hinzufügen des Benutzers.");
            return;
          } else {
            props.setReload(Math.random());
            setTxtPw("");
            setTxtxLogin("");
            setCheckedRead(false);
            setCheckedWrite(false);
            setCheckedUpdate(false);
            setCheckedDelete(false);
            setCheckedAdmin(false);
          }
        }}
      >
        Hinzufügen
      </Button>
    </Stack>
  );
};

export default Insert;
