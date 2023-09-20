import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Model, Scene, SceneMemberShip, User } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { fetchData } from "../../../utils/fetchData";
import { v4 as uuidv4 } from "uuid";

const AddMember = (props: {
  scene: Scene;
  members: (SceneMemberShip & {
    user: User;
  })[];
  setReload: (n: number) => void;
  sessionID: string;
  idUser: string;
}) => {
  const [email, setEmail] = useState<string>("");
  const [user, setUser] = useState<User>(null);
  const refEmail = useRef<string>("");

  // prüft ob der Benutzer exestiert, ergebnis wird in status user geschrieben
  const checkIfUserExist = async (loginID1: string) => {
    const requestedUser: User[] = await fetchData(
      props.idUser,
      props.sessionID,
      "user",
      "select",
      { email: loginID1 },
      null,
      null
    );

    if (!requestedUser || requestedUser.length == 0) {
      setUser(null);
      return;
    }
    setUser(requestedUser[0]);
  };

  // erstellt ein neuen Membership
  const addMemberShipToDB = async (
    idScene1: string,
    idUser1: string,
    readonly: boolean
  ): Promise<SceneMemberShip> => {
    const membership: SceneMemberShip = {
      id: uuidv4(),
      idScene: idScene1,
      idUser: idUser1,
      entryDate: new Date(),
      readOnly: readonly,
    };

    const request = await fetchData(
      props.idUser,
      props.sessionID,
      "sceneMemberShip",
      "create",
      null,
      membership,
      null
    );

    if (!request) return null;

    return request;
  };

  // prüft ob ein Benutzer (also die E-Mail) bereits ein Mitglied ist
  const checkIfIsAlreadyMember = (email: string): boolean => {
    let erg: boolean = false;
    props.members.forEach(
      (
        member: SceneMemberShip & {
          user: User;
        }
      ) => {
        if (email == member.user.email) return (erg = true);
      }
    );
    return erg;
  };

  return (
    <Stack className="" sx={{ mt: "2vh" }}>
      <Stack direction={"row"}>
        <TextField
          label="E-Mail eingeben"
          size="small"
          value={email}
          onChange={async (e) => {
            setEmail(e.target.value);
            refEmail.current = e.target.value;
            await checkIfUserExist(refEmail.current);
          }}
        ></TextField>
        <Button
          onClick={async () => {
            if (user) {
              // prüfen ob die angegebene E-Mail bereits ein Member ist
              const check = checkIfIsAlreadyMember(refEmail.current);
              if (check) {
                alert(refEmail.current + " ist bereits member.");
                return;
              }

              // den Benutzer als Mitglied der Szene hinzufügen
              const erg = await addMemberShipToDB(
                props.scene.id,
                user.id,
                false
              );

              if (!erg) alert("Das hat nicht funktioniert.");
              else {
                props.setReload(Math.random());
                setEmail("");
                setUser(null);
              }
            } else {
              alert("Geben Sie einen registrierten Benutzer an.");
            }
          }}
        >
          Hinzufügen
        </Button>
      </Stack>

      {user ? (
        <Stack direction={"row"} sx={{ m: "8px" }}>
          <Typography fontSize={"13px"}>
            User <b>{user.email}</b> gefunden
          </Typography>
          <CheckCircleOutlineIcon color="success"></CheckCircleOutlineIcon>
        </Stack>
      ) : (
        <Stack direction={"row"} sx={{ m: "8px" }}>
          {email ? (
            <>
              <Typography fontSize={"13px"}>
                kein User mit der E-Mail {email} gefunden
              </Typography>
              <HighlightOffIcon color="error"></HighlightOffIcon>
            </>
          ) : null}
        </Stack>
      )}
    </Stack>
  );
};

export default AddMember;
