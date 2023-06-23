import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import AddModelForm from "./AddModelForm";

import UploadFbx from "./fbxHandle/uploadFbx";
import ModelListItem from "./ModelListItem";
import { checkPropsForNull } from "../../../../utils/checkIfPropIsNull";

export default function ModelList(props: {
  paths: { name: string; path: string }[]; // enthält alle Pfade der FBX-Models die auf dem Server liegen
  addObject: (pfad: string, info: string) => void;
  setRefreshData: () => void;
}) {
  // bedingtes rendern
  if (checkPropsForNull(props)) return null;

  return props.paths ? (
    <Stack
      style={{ overflowY: "auto" }}
      direction="column"
      height="100%"
      alignContent={"center"}
      className="modelList"
    >
      <Typography textAlign={"center"} fontSize={"1.25rem"}>
        Modelle
      </Typography>
      <Stack direction={"column"} style={{ overflowY: "auto", flex: "1" }}>
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
  ) : null;
}

