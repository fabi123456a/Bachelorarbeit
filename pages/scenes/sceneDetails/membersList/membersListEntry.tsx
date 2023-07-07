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
  creator: User;
  loggedInUser: User;
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
          props.loggedInUser.id == props.creator.id ? (
            <IconButton
              onClick={async () => {
                await deleteMemberShipByIdInDB(props.membership.id);
                props.setReload(Math.random());
              }}
            >
              <DeleteForever></DeleteForever>
            </IconButton>
          ) : null
        ) : null}
      </Stack>
    </Stack>
  ) : (
    <Stack>lädt..</Stack>
  );
};

export default MembersListEntry;
