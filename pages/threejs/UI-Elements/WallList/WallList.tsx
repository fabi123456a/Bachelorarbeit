import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import WallListItem from "./WallListItem";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Draggable from "react-draggable";

export default function WallList(props: {
  addWall: (objProps: TypeObjectProps) => void;
}) {
  const [visible, setVisible] = useState<boolean>(true);

  const names: string[] = ["floor", "wall", "cube", "cylinder"];
  const data: object = {
    floor: { x: 50, y: 0.001, z: 50 },
    wall: { x: 0.001, y: 10, z: 50 },
    cube: { x: 5, y: 5, z: 5 },
    cylinder: { x: 1, y: 4, z: 1 }, // bei cylineder x = radius, y = height, z = tiefe
  };

  return visible ? (
    <Draggable>
      <Stack
        // sx={{ background: "lightgray" }}
        // direction="column"
        // height="100px"
        // alignContent={"center"}
        className="wallList roundedShadow"
      >
        <CloseIcon
          className="iconButton"
          onClick={() => {
            setVisible(false);
          }}
        ></CloseIcon>
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
    </Draggable>
  ) : (
    <Stack
      className="showWallListBtn roundedShadow minOpenBtn"
      onClick={() => {
        setVisible(true);
      }}
    >
      <Typography>Raum Elemente</Typography>
    </Stack>
  );
}

// bottom
// scale: { x: 50, y: 0.001, z: 50 },

// wall
// scale: { x: 0.001, y: 10, z: 50 },

// cube
//
