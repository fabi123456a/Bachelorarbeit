import DeleteForever from "@mui/icons-material/DeleteForever";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Scene, SceneMemberShip, User } from "@prisma/client";
import { useEffect, useState } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const MemberListEntry = (props: {
  scene: Scene;
  setScene: (scene: Scene) => void;
}) => {
  const [members, setMembers] = useState<
    SceneMemberShip &
      {
        user: User;
      }[]
  >(null);
  const [isHovered, setIsHovered] = useState(false);
  const [reload, setReload] = useState(0);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getAllSceneMembershipsFromScene = async (idScene: string) => {
    const requestMemberships = await fetch(
      "/api/database/Membership/DB_getAllMembersBySceneID",
      {
        method: "POST",
        body: JSON.stringify({
          idScene: idScene,
        }),
      }
    );
    const memberships: SceneMemberShip &
      {
        user: User;
      }[] = await requestMemberships.json();
    return memberships;
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

  useEffect(() => {
    getAllSceneMembershipsFromScene(props.scene.id).then(
      (
        members: SceneMemberShip &
          {
            user: User;
          }[]
      ) => setMembers(members)
    );
  }, [reload]);

  return props.scene ? (
    <Stack className="">
      <Stack direction={"row"}>
        <Typography fontWeight={"bold"}>{props.scene.name}</Typography>
        <Button
          onClick={() => {
            props.setScene(props.scene);
          }}
        >
          ansehen
        </Button>
      </Stack>
      <Typography fontSize={"small"}>
        {"Version: " + props.scene.newestVersion + ".0"}
      </Typography>
      {members ? (
        members.map(
          (
            member: SceneMemberShip & {
              user: User;
            }
          ) => (
            <Stack
              className=""
              direction={"row"}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {props.scene.idUserCreater == member.user.id ? null : (
                <IconButton
                  onClick={async () => {
                    //alert(member.user.loginID);
                    const confirmed = window.confirm(
                      "Willst du " + member.user.loginID + " wirklich löschen?"
                    );

                    if (!confirmed) return;

                    await deleteMemberShipByIdInDB(member.id);
                    setReload(Math.random());
                  }}
                >
                  <DeleteForever></DeleteForever>
                </IconButton>
              )}
              <Typography>
                {props.scene.idUserCreater == member.user.id
                  ? member.user.loginID + " (Ersteller)"
                  : member.user.loginID}
              </Typography>
            </Stack>
          )
        )
      ) : (
        <Typography>lädt..</Typography>
      )}
    </Stack>
  ) : (
    <Typography>lädt...</Typography>
  );
};

export default MemberListEntry;
