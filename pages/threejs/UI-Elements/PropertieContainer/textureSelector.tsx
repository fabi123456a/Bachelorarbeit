import { MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import React, { useState } from "react";

export default function TextureSelector(props: {
  currentObjProps: TypeObjectProps;
  setCurrentObjProps: (obj: TypeObjectProps) => void;
}) {
  const [texture, setTexture] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    let value: string = event.target.value as string;
    setTexture(value);

    const newObjectProps = { ...props.currentObjProps };
    newObjectProps.texture = value;

    props.setCurrentObjProps(newObjectProps);
  };

  return (
    <>
      <Select value={texture} label="Texture" onChange={handleChange}>
        <MenuItem value={undefined}>keine Texture</MenuItem>
        <MenuItem value={"stoff"}>Stoff</MenuItem>
        <MenuItem value={"wood"}>Holz</MenuItem>
        <MenuItem value={"pavingStones"}>PavingStones</MenuItem>
        <MenuItem value={"woodMetal"}>WoodMetal</MenuItem>
        <MenuItem value={"stoneFloor"}>StoneFloor</MenuItem>
        <MenuItem value={"metal"}>Metal</MenuItem>
        <MenuItem value={"sciFi"}>SciFiction</MenuItem>
      </Select>
    </>
  );
}
