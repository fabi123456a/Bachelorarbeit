import { Stack, Typography } from "@mui/material";
import { fetchData } from "../../../utils/fetchData";
import { CurrentSceneEdit, User } from "@prisma/client";
import { useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";

const CurrentWorkingList = (props: {
  idScene: string;
  loggedInUser: User;
  sessionID: string;
}) => {
  const [currentScenEdits, setCurrentSceneEdits] = useState<
    (CurrentSceneEdit & {
      user: User;
    })[]
  >();

  const getCurrentSceneEdits = async (): Promise<
    (CurrentSceneEdit & {
      user: User;
    })[]
  > => {
    const requestedCurrentSceneEdits = await fetchData(
      props.loggedInUser.id,
      props.sessionID,
      "CurrentSceneEdit",
      "select",
      { idScene: props.idScene },
      null,
      {
        user: true,
      }
    );

    if (!requestedCurrentSceneEdits) {
      return;
    }
    return requestedCurrentSceneEdits;
  };

  useEffect(() => {
    getCurrentSceneEdits().then(
      (
        edits: (CurrentSceneEdit & {
          user: User;
        })[]
      ) => {
        setCurrentSceneEdits(edits);
      }
    );
  }, []);

  return (
    <Stack className="roundedShadow">
      <Typography fontWeight={"bold"}>Online</Typography>
      <Stack>
        {currentScenEdits ? (
          currentScenEdits.length > 0 ? (
            currentScenEdits.map(
              (
                edit: CurrentSceneEdit & {
                  user: User;
                }
              ) => {
                return (
                  <Stack direction={"row"} sx={{ alignItems: "center" }}>
                    <CircleIcon color="success"></CircleIcon>
                    <Typography>
                      {edit.user.displayName}({edit.user.email})
                    </Typography>
                  </Stack>
                );
              }
            )
          ) : (
            <Typography fontSize={"12px"}>
              Keiner bearbeitet die Konfiguration gerade. Wenn ein Benutzer die
              Konfiguration bearbeitet wird dies hier angezeigt.
            </Typography>
          )
        ) : null}
      </Stack>
    </Stack>
  );
};

export default CurrentWorkingList;
