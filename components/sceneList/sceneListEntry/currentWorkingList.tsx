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

    if (requestedCurrentSceneEdits.err) {
      alert(requestedCurrentSceneEdits.err);
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

  return currentScenEdits ? (
    currentScenEdits.length == 0 ? null : (
      <Stack className="roundedShadow">
        Online
        <Stack>
          {currentScenEdits
            ? currentScenEdits.map(
                (
                  edit: CurrentSceneEdit & {
                    user: User;
                  }
                ) => {
                  return (
                    <Stack direction={"row"} sx={{ alignItems: "center" }}>
                      <CircleIcon color="success"></CircleIcon>
                      <Typography>{edit.user.email}</Typography>
                    </Stack>
                  );
                }
              )
            : null}
        </Stack>
      </Stack>
    )
  ) : null;
};

export default CurrentWorkingList;
