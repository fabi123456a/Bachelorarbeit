import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import AddModelForm from "./AddModelForm";
import { ModelListItem } from "./ModelListItem";
import UploadFbx from "../../../fbxHandle/uploadFbx";

export function ModelList(props: {
  paths: { name: string; path: string }[]; // enthält alle Pfade der FBX-Models die auf dem Server liegen
  addObject: (pfad: string, info: string) => void;
  addModel: (name: string, url: string, file: any) => void;
  deleteModel: (url: string) => void;
  setRefreshData: () => void;
}) {
  return (
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
            deleteModel={props.deleteModel}
          ></ModelListItem>
        ))}
      </Stack>
      <UploadFbx setRefreshData={props.setRefreshData}></UploadFbx>
      {/* <AddModelForm addModel={props.addModel} /> */}
    </Stack>
  );
}
