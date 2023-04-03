import { Button, IconButton, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export function WallListItem(props: {
  name: string;
  data: object;
  addWall: (objProps: TypeObjectProps) => void;
}) {
  return (
    <Stack style={{ margin: "8px" }} direction={"row"}>
      <Button
        variant="outlined"
        onClick={() => {
          let x: TypeObjectProps = {
            id: "" + Math.random() * 1000,
            editMode: undefined,
            showXTransform: false,
            showYTransform: false,
            showZTransform: false,
            modelPath: null,
            position: { x: 0, y: 0, z: 0 },
            scale: {
              x: props.data[props.name]["x"],
              y: props.data[props.name]["y"],
              z: props.data[props.name]["z"],
            },
            rotation: { x: 0, y: 0, z: 0 },
            removeBoundingBox: () => {},
            info: "wall",
          };

          props.addWall(x);
        }}
      >
        {props.name}
      </Button>
    </Stack>
  );
}
