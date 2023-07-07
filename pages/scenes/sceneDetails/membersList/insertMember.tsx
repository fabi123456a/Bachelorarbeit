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

const AddMember = (props: {
  scene: Scene;
  members: (SceneMemberShip & {
    user: User;
  })[];
  setReload: (n: number) => void;
}) => {
  const [name, setName] = useState<string>("");
  const [user, setUser] = useState<User>(null);
  const refName = useRef<string>("");

  const checkLoginID = async (loginID: string) => {
    const userRequest = await fetch("/api/database/User/DB_getUserByLoginID", {
      method: "POST",
      body: JSON.stringify({
        loginID: loginID,
      }),
    });

    const user: User = await userRequest.json();
    if (user) setUser(user);
    else setUser(null);
  };

  const addMemberShipToDB = async (
    idScene: string,
    idUser: string,
    readonly: boolean
  ) => {
    const response = await fetch(
      "/api/database/Membership/DB_insertMemberShip",
      {
        method: "POST",
        body: JSON.stringify({
          idScene: idScene,
          idUser: idUser,
          readonly: readonly,
        }),
      }
    );

    const result = await response.json();

    return result;
  };

  const checkIfIsAlreadyMember = (loginID: string): boolean => {
    let erg: boolean = false;
    props.members.forEach(
      (
        member: SceneMemberShip & {
          user: User;
        }
      ) => {
        if (refName.current == member.user.loginID) return (erg = true);
      }
    );
    return erg;
  };

  return (
    <Stack className="">
      <Stack direction={"row"}>
        <TextField
          label="User"
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
              await addMemberShipToDB(props.scene.id, user.id, false);
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
          <Typography>{user.loginID}</Typography>
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
