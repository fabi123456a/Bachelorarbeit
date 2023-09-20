import { Checkbox, IconButton, Stack, Typography } from "@mui/material";
import { Model, Scene, SceneMemberShip, User } from "@prisma/client";
import { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { DeleteForever } from "@mui/icons-material";
import { fetchData } from "../../../utils/fetchData";

const MembersListEntry = (props: {
  membership: SceneMemberShip & {
    user: User;
  };
  setReload: (n: number) => void;
  scene: Scene;
  loggedInUser: User;
  sessionID: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [checkbox, setCheckbox] = useState<boolean>(
    props.membership ? props.membership.readOnly : false
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // löscht einen membership
  const deleteMemberShipByIdInDB = async (
    idMembership: string
  ): Promise<boolean> => {
    const requestDelete = await fetchData(
      props.loggedInUser.id,
      props.sessionID,
      "sceneMemberShip",
      "delete",
      { id: idMembership },
      null,
      null
    );

    if (!requestDelete) return false;
    return true;
  };

  // ändert den readonly status eines memberships
  const updateMembershipInDB = async (
    idMembership: string,
    readonly: boolean
  ): Promise<SceneMemberShip> => {
    const requestedChangeReadonly = await fetchData(
      props.loggedInUser.id,
      props.sessionID,
      "sceneMemberShip",
      "update",
      { id: idMembership },
      { readOnly: readonly },
      null
    );

    if (!requestedChangeReadonly) return null;
    return requestedChangeReadonly;
  };

  return props.membership ? (
    <Stack
      className=""
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Stack direction={"row"} sx={{ alignItems: "center" }}>
        <Typography sx={{ minWidth: "15vh" }}>
          {props.membership.user.email}
        </Typography>

        {props.membership.user.id == props.scene.idUserCreater ? (
          <Typography color={"grey"} sx={{ ml: "8px" }}>
            (Ersteller)
          </Typography>
        ) : props.scene.idUserCreater == props.loggedInUser.id ? ( // wenn der Ersteller der Szene eingeloggt ist
          <Stack direction={"row"} sx={{ alignItems: "center" }}>
            <Checkbox
              checked={checkbox}
              onChange={async (e) => {
                // status der Checkbox switchen
                setCheckbox((prev) => !prev);

                // readonly status im Membership ändern
                const erg = await updateMembershipInDB(
                  props.membership.id,
                  e.target.checked
                );

                if (!erg) alert("Das hat nicht funktioniert.");
              }}
            ></Checkbox>
            <Typography>readonly</Typography>
          </Stack>
        ) : (
          <Stack direction={"row"} sx={{ alignItems: "center" }}>
            {props.membership.readOnly || !props.membership.user.write ? (
              <Typography sx={{ ml: "8px", color: "grey" }}>
                readonly
              </Typography>
            ) : null}
          </Stack>
        )}

        {isHovered ? (
          props.loggedInUser.id == props.scene.idUserCreater ? (
            props.membership.user.id == props.scene.idUserCreater ? null : (
              <IconButton
                onClick={async () => {
                  const confirmed = window.confirm(
                    "Willst du " +
                      props.membership.user.email +
                      " aus der Konfiguration entfernen?"
                  );
                  if (!confirmed) return;

                  const flag = await deleteMemberShipByIdInDB(
                    props.membership.id
                  );

                  if (!flag) alert("Das hat nicht funktioniert.");

                  props.setReload(Math.random());
                }}
              >
                <DeleteForever color={"error"}></DeleteForever>
              </IconButton>
            )
          ) : null
        ) : null}
      </Stack>
    </Stack>
  ) : (
    <Stack>lädt..</Stack>
  );
};

export default MembersListEntry;
