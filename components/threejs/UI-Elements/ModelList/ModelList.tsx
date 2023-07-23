import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import UploadFbx from "./fbxHandle/uploadFbx";
import ModelListItem from "./ModelListItem";
import { checkPropsForNull } from "../../../../utils/checkIfPropIsNull";
import { useState } from "react";
import Draggable from "react-draggable";

export default function ModelList(props: {
  paths: { name: string; path: string }[]; // enthält alle Pfade der FBX-Models die auf dem Server liegen
  addObject: (pfad: string, info: string) => void;
  setRefreshData: () => void;
  idScene: string;
  idUser: string;
}) {
  const [visible, setVisible] = useState<boolean>(false);

  // bedingtes rendern
  if (checkPropsForNull(props)) return null;

  return props.paths && visible ? (
    <Draggable>
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
              idUser={props.idUser}
              idScene={props.idScene}
              name={path.name}
              key={path.path}
              pfad={path.path}
              addObject={props.addObject}
            ></ModelListItem>
          ))}
        </Stack>
        <UploadFbx setRefreshData={props.setRefreshData}></UploadFbx>
      </Stack>
    </Draggable>
  ) : (
    <Stack
      className="showModelListBtn roundedShadow minOpenBtn"
      onClick={() => {
        setVisible(true);
      }}
    >
      <Typography>3D Modelle</Typography>
    </Stack>
  );
}
