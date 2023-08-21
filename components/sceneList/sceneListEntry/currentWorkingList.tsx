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
  const [currentScenEdits, setCurrentSceneEdits] =
    useState<CurrentSceneEdit[]>();

  const getCurrentSceneEdits = async (): Promise<CurrentSceneEdit[]> => {
    const requestedCurrentSceneEdits = await fetchData(
      props.loggedInUser.id,
      props.sessionID,
      "CurrentSceneEdit",
      "select",
      { idScene: props.idScene },
      null,
      null
    );

    if (requestedCurrentSceneEdits.err) {
      alert(requestedCurrentSceneEdits.err);
      return;
    }
    return requestedCurrentSceneEdits;
  };

  useEffect(() => {
    getCurrentSceneEdits().then((edits: CurrentSceneEdit[]) => {
      setCurrentSceneEdits(edits);
    });
  }, []);

  return (
    <Stack className="roundedShadow">
      Online
      <Stack>
        {currentScenEdits
          ? currentScenEdits.map((edit: CurrentSceneEdit) => {
              return (
                <Stack direction={"row"} sx={{ alignItems: "center" }}>
                  <CircleIcon color="success"></CircleIcon>
                  <Typography>{edit.idUser}</Typography>
                </Stack>
              );
            })
          : null}
      </Stack>
    </Stack>
  );
};

export default CurrentWorkingList;
