import {
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
      <Select value={texture} label="Texture" onChange={handleChange}>
        <MenuItem value={""}>keine Texture</MenuItem>
        <MenuItem value={"stoff"}>Stoff</MenuItem>
        <MenuItem value={"wood"}>Holz</MenuItem>
        <MenuItem value={"pavingStones"}>PavingStones</MenuItem>
        <MenuItem value={"woodMetal"}>WoodMetal</MenuItem>
        <MenuItem value={"stoneFloor"}>StoneFloor</MenuItem>
        {/* <MenuItem value={"metal"}>Metal</MenuItem>
        <MenuItem value={"sciFi"}>SciFiction</MenuItem> */}
      </Select>
      <Typography>{props.texture ? props.texture : "keine Texture"}</Typography>
    </>
  );
}
