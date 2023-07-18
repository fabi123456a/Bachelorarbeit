import { Checkbox, IconButton, Stack, Typography } from "@mui/material";
import { Model, Scene, SceneMemberShip, User } from "@prisma/client";
import { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { DeleteForever } from "@mui/icons-material";
import { fetchData } from "../../../fetchData";

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

  const deleteMemberShipByIdInDB = async (id: string) => {
    // const deleteRequest = await fetch(
    //   "/api/database/Membership/DB_deleteMemberShipByID",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({
    //       id: id,
    //       sessionID: props.sessionID,
    //       idUser: props.loggedInUser.id,
    //     }),
    //   }
    // );

    // const erg = await deleteRequest.json();

    const requestDelete = await fetchData(
      props.loggedInUser.id,
      props.sessionID,
      "sceneMemberShip",
      "delete",
      { id: id },
      null,
      null
    );

    if (requestDelete.err) return;

    if (requestDelete) return true;
    else return false;
  };

  const updateMembershipInDB = async (id: string, readonly: boolean) => {
    // const deleteRequest = await fetch(
    //   "/api/database/Membership/DB_changeReadonlyByID",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({
    //       id: id,
    //       readonly: readonly,
    //       sessionID: props.sessionID,
    //       idUser: props.loggedInUser.id,
    //     }),
    //   }
    // );
    const requestedChatEntries = await fetchData(
      props.loggedInUser.id,
      props.sessionID,
      "sceneMemberShip",
      "update",
      { id: id },
      { readOnly: readonly },
      null
    );

    if (requestedChatEntries.err) return;
  };

  return props.membership ? (
    <Stack
      className=""
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Stack direction={"row"} sx={{ alignItems: "center" }}>
        <Typography sx={{ minWidth: "15vh" }}>
          {props.membership.user.loginID}
        </Typography>

        {props.membership.user.id == props.scene.idUserCreater ? (
          <Typography color={"grey"} sx={{ ml: "8px" }}>
            (Ersteller)
          </Typography>
        ) : props.scene.idUserCreater == props.loggedInUser.id ? (
          <Stack direction={"row"} sx={{ alignItems: "center" }}>
            <Checkbox
              checked={checkbox}
              onChange={async (e) => {
                setCheckbox((prev) => !prev);
                //alert(e.target.checked);
                await updateMembershipInDB(
                  props.membership.id,
                  e.target.checked
                );
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
                    "Willst du " + props.membership.user.loginID + " entfernen?"
                  );
                  if (!confirmed) return;

                  await deleteMemberShipByIdInDB(props.membership.id);
                  props.setReload(Math.random());
                }}
              >
                <DeleteForever></DeleteForever>
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
