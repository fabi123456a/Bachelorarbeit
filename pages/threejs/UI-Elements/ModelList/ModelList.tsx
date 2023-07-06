import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import UploadFbx from "./fbxHandle/uploadFbx";
import ModelListItem from "./ModelListItem";
import { checkPropsForNull } from "../../../../utils/checkIfPropIsNull";
import { useState } from "react";
import ReorderIcon from "@mui/icons-material/Reorder";

export default function ModelList(props: {
  paths: { name: string; path: string }[]; // enthält alle Pfade der FBX-Models die auf dem Server liegen
  addObject: (pfad: string, info: string) => void;
  setRefreshData: () => void;
}) {
  const [visible, setVisible] = useState<boolean>(true);

  // bedingtes rendern
  if (checkPropsForNull(props)) return null;

  return props.paths && visible ? (
    <Stack
      className="modelList roundedShadow"
      direction="column"
      height="100%"
      alignContent={"center"}
    >
      <CloseIcon
        className="iconButton"
        onClick={() => {
          setVisible(false);
        }}
      />

      <Typography textAlign={"center"} fontSize={"1.25rem"}>
        Modelle
      </Typography>
      <Stack className="modelListEntryContainer">
        {props.paths.map((path) => (
          <ModelListItem
            name={path.name}
            key={path.path}
            pfad={path.path}
            addObject={props.addObject}
          ></ModelListItem>
        ))}
      </Stack>
      <UploadFbx setRefreshData={props.setRefreshData}></UploadFbx>
    </Stack>
  ) : (
    <Stack
      className="showModelListBtn roundedShadow iconButton"
      onClick={() => setVisible(true)}
    >
      <ReorderIcon></ReorderIcon>
    </Stack>
  );
}
