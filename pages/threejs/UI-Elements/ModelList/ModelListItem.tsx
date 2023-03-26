import { Button, IconButton } from "@mui/material";
import { Stack } from "@mui/system";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export function ModelListItem(props: {
  name: string;
  pfad: string;
  addObject: (pfad: string) => void;
  deleteModel: (url: string) => void;
}) {
  return (
    <Stack style={{ margin: "8px" }} direction={"row"}>
      <Button
        onClick={() => props.addObject(props.pfad)}
        style={{ flex: "1" }}
        variant="contained"
      >
        {props.name}
      </Button>
      <IconButton
        onClick={() => {
          props.deleteModel(props.pfad);
        }}
      >
        <DeleteForeverIcon></DeleteForeverIcon>
      </IconButton>
    </Stack>
  );
}
