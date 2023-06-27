import { Image } from "@mui/icons-material";
import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

export default function TextureSelector(props: {
  currentObjProps: TypeObjectProps;
  setCurrentObjProps: (obj: TypeObjectProps) => void;
  texture: string;
}) {
  const [texture, setTexture] = useState(props.texture ? props.texture : "");

  const handleChange = (event: SelectChangeEvent) => {
    let value: string = event.target.value as string;
    setTexture(value);

    const newObjectProps = { ...props.currentObjProps };
    newObjectProps.texture = value;
    newObjectProps.color = "#ffffff";

    props.setCurrentObjProps(newObjectProps);
  };

  useEffect(() => {
    setTexture(props.texture);
  }, [props.texture]);

  return (
    <>
      <Typography fontWeight={"bolder"}>Texture</Typography>
      <Select
        value={texture}
        label="Texture"
        onChange={handleChange}
        sx={{ overflowX: "scroll" }}
      >
        <MenuItem value={""}>keine Texture</MenuItem>
        <MenuItem value={"stoff"}>
          <img
            src="./textures/stoff/Substance_Graph_BaseColor.jpg"
            height={"50px"}
          ></img>{" "}
          Stoff
        </MenuItem>
        <MenuItem value={"wood"}>
          <img
            src="./textures/wood/Substance_Graph_BaseColor.jpg"
            height={"50px"}
          ></img>
          Holz
        </MenuItem>
        <MenuItem value={"pavingStones"}>
          <img
            src="./textures/pavingStones/Substance_Graph_BaseColor.jpg"
            height={"50px"}
          ></img>
          PavingStones
        </MenuItem>
        <MenuItem value={"woodMetal"}>
          <img
            src="./textures/woodMetal/Substance_Graph_BaseColor.jpg"
            height={"50px"}
          ></img>
          WoodMetal
        </MenuItem>
        <MenuItem value={"stoneFloor"}>
          <img
            src="./textures/stoneFloor/Substance_Graph_BaseColor.jpg"
            height={"50px"}
          ></img>
          StoneFloor
        </MenuItem>
        <MenuItem value={"metal"}>
          <img
            src="./textures/metal/Substance_Graph_BaseColor.jpg"
            height={"50px"}
          ></img>
          Metal
        </MenuItem>
        <MenuItem value={"sciFi"}>
          <img
            src="./textures/sciFi/Substance_Graph_BaseColor.jpg"
            height={"50px"}
          ></img>
          SciFiction
        </MenuItem>
        <MenuItem value={"gravel"}>
          <img
            src="./textures/gravel/Substance_Graph_BaseColor.jpg"
            height={"50px"}
          ></img>
          Gravel
        </MenuItem>
      </Select>
    </>
  );
}
