import { Checkbox, IconButton, Stack, Typography } from "@mui/material";
import { Model, Scene, SceneMemberShip, User } from "@prisma/client";
import { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { DeleteForever } from "@mui/icons-material";

const MembersListEntry = (props: {
  membership: SceneMemberShip & {
    user: User;
  };
  setReload: (n: number) => void;
  scene: Scene;
  loggedInUser: User;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [checkbox, setCheckbox] = useState<boolean>(props.membership.readOnly);

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

  return props.membership ? (
    <Stack
      className=""
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Stack direction={"row"} sx={{ alignItems: "center" }}>
        <Typography>{props.membership.user.loginID}</Typography>

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
            {props.membership.readOnly ? (
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
