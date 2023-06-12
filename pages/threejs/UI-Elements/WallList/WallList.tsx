import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { WallListItem } from "./WallListItem";

export function WallList(props: {
  addWall: (objProps: TypeObjectProps) => void;
}) {
  const names: string[] = ["floor", "wall", "cube"];
  const data: object = {
    floor: { x: 50, y: 0.001, z: 50 },
    wall: { x: 0.001, y: 10, z: 50 },
    cube: { x: 5, y: 5, z: 5 },
  };

  return (
    <Stack
      sx={{ background: "lightgray" }}
      direction="column"
      height="100px"
      alignContent={"center"}
      className="wallList"
    >
      <Typography textAlign={"center"} fontSize={"1.25rem"}>
        Raumelemente
      </Typography>
      <Stack direction={"row"}>
        {names.map((name: string) => (
          <WallListItem
            key={name}
            name={name}
            addWall={props.addWall}
            data={data}
          ></WallListItem>
        ))}
      </Stack>
    </Stack>
  );
}

// bottom
// scale: { x: 50, y: 0.001, z: 50 },

// wall
// scale: { x: 0.001, y: 10, z: 50 },

// cube
//
