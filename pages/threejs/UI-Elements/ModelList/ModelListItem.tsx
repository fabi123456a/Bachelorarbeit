import { Button, IconButton } from "@mui/material";
import { Stack } from "@mui/system";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function ModelListItem(props: {
  name: string;
  pfad: string;
  addObject: (pfad: string, info: string) => void;
  deleteModel: (url: string) => void;
}) {
  return (
    <Stack style={{ margin: "8px" }} direction={"row"}>
      <Button
        onClick={() =>
          props.addObject(props.pfad, get_model_name(props.pfad.toLowerCase()))
        }
        style={{ flex: "1" }}
        variant="contained"
      >
        {props.name.toLowerCase().replace(".fbx", "")}
      </Button>
      {/* <IconButton TODO: das löschen von fbxModels soll über admin afea gehen
        onClick={() => {
          props.deleteModel(props.pfad);
        }}
      >
        <DeleteForeverIcon></DeleteForeverIcon>
      </IconButton> */}
    </Stack>
  );
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
