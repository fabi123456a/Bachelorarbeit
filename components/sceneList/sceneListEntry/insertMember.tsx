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
  const [name, setName] = useState<string>("");
  const [user, setUser] = useState<User>(null);
  const refName = useRef<string>("");

  const checkLoginID = async (loginID1: string) => {
    // const userRequest = await fetch("/api/database/User/DB_getUserByLoginID", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     loginID: loginID,
    //     sessionID: props.sessionID,
    //     idUser: props.idUser,
    //   }),
    // });

    // const user = await userRequest.json();

    const requestedUser = await fetchData(
      props.idUser,
      props.sessionID,
      "user",
      "select",
      { email: loginID1 },
      null,
      null
    );

    if (requestedUser.length == 0 || requestedUser.err) {
      setUser(null);
      return;
    }
    setUser(requestedUser);
  };

  const addMemberShipToDB = async (
    idScene1: string,
    idUser1: string,
    readonly: boolean
  ) => {
    // const response = await fetch(
    //   "/api/database/Membership/DB_insertMemberShip",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({
    //       idScene: idScene,
    //       idUser: idUser,
    //       readonly: readonly,
    //       sessionID: props.sessionID,
    //     }),
    //   }
    // );

    // const result = await response.json();

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

    if (request.err) return;

    return request;
  };

  const checkIfIsAlreadyMember = (loginID: string): boolean => {
    let erg: boolean = false;
    props.members.forEach(
      (
        member: SceneMemberShip & {
          user: User;
        }
      ) => {
        if (refName.current == member.user.email) return (erg = true);
      }
    );
    return erg;
  };

  return (
    <Stack className="" sx={{ mt: "2vh" }}>
      <Stack direction={"row"}>
        <TextField
          label="User hinzufügen..."
          size="small"
          value={name}
          onChange={async (e) => {
            setName(e.target.value);
            refName.current = e.target.value;
            await checkLoginID(refName.current);
          }}
        ></TextField>
        <Button
          onClick={async () => {
            if (user) {
              let check = checkIfIsAlreadyMember(refName.current);
              if (check) {
                alert(refName.current + " ist bereits member.");
                return;
              }
              await addMemberShipToDB(props.scene.id, user[0].id, false);
              props.setReload(Math.random());
              setName("");
              setUser(null);
            } else {
              alert("Geben sie einen User an den es gibt.");
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
          {name ? (
            <>
              <Typography fontSize={"13px"}>
                kein User mit der loginID {name} gefunden
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
