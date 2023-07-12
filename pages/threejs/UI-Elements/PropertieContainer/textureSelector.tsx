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
  sessionID: string;
}) {
  const [texture, setTexture] = useState(props.texture ? props.texture : "");
  const [textures, setTextures] = useState<string[]>(null);

  const handleChange = (event: SelectChangeEvent) => {
    let value: string = event.target.value as string;
    setTexture(value);

    const newObjectProps = { ...props.currentObjProps };
    newObjectProps.texture = value;
    newObjectProps.color = "";

    props.setCurrentObjProps(newObjectProps);
  };

  const getAllTexturesFromFS = async () => {
    const requestTextures = await fetch("api/filesystem/FS_getTextures", {
      method: "POST",
      body: JSON.stringify({
        sessionID: props.sessionID,
      }),
    });

    const textures = requestTextures.json();

    // alert(textures);

    return textures;
  };

  useEffect(() => {
    setTexture(props.texture);
  }, [props.texture]);

  useEffect(() => {
    getAllTexturesFromFS().then((textures: string[]) => setTextures(textures));
  }, []);

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
        {textures
          ? textures.map((tex: string) => (
              <MenuItem value={tex}>
                <img
                  src={`./textures/${tex}/Substance_Graph_BaseColor.jpg`}
                  height={"50px"}
                  style={{ marginRight: "8px" }}
                ></img>{" "}
                {tex}
              </MenuItem>
            ))
          : null}

        {/* <MenuItem value={"stoff"}>
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
        </MenuItem> */}
      </Select>
    </>
  );
}
