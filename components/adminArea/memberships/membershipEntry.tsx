import { Checkbox, IconButton, Stack, Typography } from "@mui/material";
import { Scene, SceneMemberShip, User } from "@prisma/client";
import MemberListEntry from "./membersList";
import { useState } from "react";
import { DeleteForever } from "@mui/icons-material";
import { fetchData } from "../../../utils/fetchData";

const MembershipEntry = (props: {
  membership: SceneMemberShip & {
    user: User;
  };
  scene: Scene;
  setReload: (n: number) => void;
  sessionID: string;
  idUser: string;
}) => {
  const [checkbox, setCheckbox] = useState<boolean>(
    props.membership ? props.membership.readOnly : false
  );
  const [isHovered, setIsHovered] = useState(false);

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
    //       idUser: props.idUser,
    //     }),
    //   }
    // );

    // const erg = await deleteRequest.json();

    const requestDelete = await fetchData(
      props.idUser,
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
    //       idUser: props.idUser,
    //     }),
    //   }
    // );

    const requestedChatEntries = await fetchData(
      props.idUser,
      props.sessionID,
      "sceneMemberShip",
      "update",
      { id: id },
      { readOnly: readonly },
      null
    );

    if (requestedChatEntries.err) return;
  };

  return props.scene && props.membership ? (
    <Stack
      className="membershipEntry"
      direction={"row"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <IconButton
        onClick={async () => {
          //alert(member.user.loginID);
          const confirmed = window.confirm(
            "Willst du " + props.membership.user.email + " wirklich löschen?"
          );

          if (!confirmed) return;

          await deleteMemberShipByIdInDB(props.membership.id);
          props.setReload(Math.random());
        }}
      >
        <DeleteForever></DeleteForever>
      </IconButton>

      <Typography sx={{ minWidth: "20vh" }}>
        {props.scene.idUserCreater == props.membership.user.id
          ? props.membership.user.email + " (Ersteller)"
          : props.membership.user.email}
      </Typography>
      {props.scene.idUserCreater == props.membership.user.id ? null : (
        <>
          <Checkbox
            checked={checkbox}
            onChange={async (e) => {
              setCheckbox((prev) => !prev);
              //alert(e.target.checked);
              await updateMembershipInDB(props.membership.id, e.target.checked);
            }}
          ></Checkbox>
          <Typography sx={{ ml: "-8px" }}>readonly</Typography>
        </>
      )}
    </Stack>
  ) : (
    <Typography>lädt...</Typography>
  );
};

export default MembershipEntry;
