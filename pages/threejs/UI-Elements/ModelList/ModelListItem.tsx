import { Button, IconButton } from "@mui/material";
import { Stack } from "@mui/system";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { checkPropsForNull } from "../../../../utils/checkIfPropIsNull";

export default function ModelListItem(props: {
  name: string;
  pfad: string;
  addObject: (pfad: string, info: string) => void;
}) {
  // bedingtes rendern
  if (checkPropsForNull(props)) return null;

  return props.name ? (
    <Stack style={{ margin: "8px" }} direction={"row"}>
      <Button
        onClick={() => {
          props.addObject(props.pfad, get_model_name(props.pfad.toLowerCase()));
        }}
        className="modelListEntry"
        variant="contained"
      >
        {props.name.toLowerCase().replace(".fbx", "")}
      </Button>
      {/* <Stack
        className="roundedShadow modelListEntry"
        onClick={() => {
          props.addObject(props.pfad, get_model_name(props.pfad.toLowerCase()));
        }}
      >
        {props.name.toLowerCase().replace(".fbx", "")}
      </Stack> */}
    </Stack>
  ) : null;
}

function get_model_name(path: string): string {
  // Teile den Pfad anhand des Schrägstrichs (/) auf
  const parts = path.split("/");

  // Nimm den letzten Teil des Pfads
  const filename = parts[parts.length - 1];

  // Entferne die Dateierweiterung (.fbx) und gib den verbleibenden Teil zurück
  const modelName = filename.replace(".fbx", "");

  return modelName;
}
