import { Button, IconButton, Stack, Typography } from "@mui/material";
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
}) => {
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

  return props.membership ? (
    <Stack
      className=""
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Stack direction={"row"}>
        <Typography>{props.membership.user.loginID}</Typography>
        {isHovered ? (
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
        ) : null}
        {props.membership.user.id == props.scene.idUserCreater ? (
          <Typography color={"grey"}>(Ersteller)</Typography>
        ) : null}
      </Stack>
    </Stack>
  ) : (
    <Stack>lädt..</Stack>
  );
};

export default MembersListEntry;
