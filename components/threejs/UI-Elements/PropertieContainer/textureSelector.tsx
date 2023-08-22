import { Image } from "@mui/icons-material";
import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { TypeObjectProps } from "../../../../pages/threejs/types";

export default function TextureSelector(props: {
  currentObjProps: TypeObjectProps;
  setCurrentObjProps: (obj: TypeObjectProps) => void;
  texture: string;
  sessionID: string;
  idUser: string;
}) {
  const [texture, setTexture] = useState(props.texture ? props.texture : "");
  const [textures, setTextures] = useState<string[]>(null);

  const handleChange = (event: SelectChangeEvent) => {
    let value: string = event.target.value as string;

    if (value == "keine Textur") setTexture("");
    else setTexture(value);

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
        idUser: props.idUser,
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
        // sx={{ overflowX: "scroll" }}
        size="small"
      >
        <MenuItem value={"keine Textur"}>keine Texture</MenuItem>
        {textures
          ? textures.map((tex: string) => (
              <MenuItem value={tex} key={tex}>
                <Stack direction={"row"} sx={{ alignItems: "center" }}>
                  <img
                    src={`./textures/${tex}/Substance_Graph_BaseColor.jpg`}
                    height={"50px"}
                    style={{ marginRight: "8px" }}
                  ></img>
                  {tex}
                </Stack>
              </MenuItem>
            ))
          : null}
      </Select>
      <Typography fontSize={"12px"}>
        Texturen werden nach dem Speichern sichtbar.
      </Typography>
    </>
  );
}
