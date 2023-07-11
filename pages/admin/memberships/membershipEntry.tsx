import { Checkbox, IconButton, Stack, Typography } from "@mui/material";
import { Scene, SceneMemberShip, User } from "@prisma/client";
import MemberListEntry from "./membersListEntry";
import { useState } from "react";
import { DeleteForever } from "@mui/icons-material";

const MembershipEntry = (props: {
  membership: SceneMemberShip & {
    user: User;
  };
  scene: Scene;
  setReload: (n: number) => void;
}) => {
  const [checkbox, setCheckbox] = useState<boolean>(props.membership.readOnly);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const deleteMemberShipByIdInDB = async (id: string) => {
    const deleteRequest = await fetch(
      "/api/database/Membership/DB_deleteMemberShipByID",
      {
        method: "POST",
        body: JSON.stringify({
          id: id,
        }),
      }
    );

    const erg = await deleteRequest.json();
    if (erg) return true;
    else return false;
  };

  const updateMembershipInDB = async (id: string, readonly: boolean) => {
    const deleteRequest = await fetch(
      "/api/database/Membership/DB_changeReadonlyByID",
      {
        method: "POST",
        body: JSON.stringify({
          id: id,
          readonly: readonly,
        }),
      }
    );
  };

  return (
    <Stack
      className="membershipEntry"
      direction={"row"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {props.scene.idUserCreater == props.membership.user.id ? null : (
        <IconButton
          onClick={async () => {
            //alert(member.user.loginID);
            const confirmed = window.confirm(
              "Willst du " +
                props.membership.user.loginID +
                " wirklich löschen?"
            );

            if (!confirmed) return;

            await deleteMemberShipByIdInDB(props.membership.id);
            props.setReload(Math.random());
          }}
        >
          <DeleteForever></DeleteForever>
        </IconButton>
      )}
      <Typography sx={{ minWidth: "20vh" }}>
        {props.scene.idUserCreater == props.membership.user.id
          ? props.membership.user.loginID + " (Ersteller)"
          : props.membership.user.loginID}
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
  );
};

export default MembershipEntry;
