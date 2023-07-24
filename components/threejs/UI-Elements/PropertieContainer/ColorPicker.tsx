import { useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { TypeObjectProps } from "../../../../pages/threejs/types";

function ColorPicker(props: {
  setCurrentObjectProps: (props: TypeObjectProps) => void;
  currentObjectProps: TypeObjectProps;
}) {
  const [color, setColor] = useState(
    props.currentObjectProps ? props.currentObjectProps.color : "#eeeeee"
  ); // Farbwert im Status speichern

  const handleColorChange = (event) => {
    const newObjectProps = { ...props.currentObjectProps }; // Kopie von currentObjectProps erstellen
    newObjectProps.color = event.target.value; // Farbwert aktualisieren
    newObjectProps.texture = undefined;

    props.setCurrentObjectProps(newObjectProps); // Aktualisierte Object-Props übergeben

    setColor(event.target.value); // Aktualisiere den Farbwert im Status
  };

  useEffect(() => {
    setColor(props.currentObjectProps ? props.currentObjectProps.color : "");
  }, [props.currentObjectProps]); // props.currentObjectProps.color geht nicht wegen build deswegen props.currentObjectProps

  return (
    <Stack>
      {props.currentObjectProps ? (
        <>
          <Typography fontWeight={"bolder"}>Farbe ändern</Typography>
          <input
            type="color"
            id="favcolor"
            name="favcolor"
            value={color}
            onChange={handleColorChange}
          />
          <p>{color}</p>
        </>
      ) : null}
    </Stack>
  );
}

export default ColorPicker;
