import { useState } from "react";
import { Stack } from "@mui/material";

function ColorPicker(props: {
  setCurrentObjectProps: (props: TypeObjectProps) => void;
  currentObjectProps: TypeObjectProps;
}) {
  const [color, setColor] = useState("#ff0000"); // Farbwert im Status speichern

  const handleColorChange = (event) => {
    const newObjectProps = { ...props.currentObjectProps }; // Kopie von currentObjectProps erstellen
    newObjectProps.color = event.target.value; // Farbwert aktualisieren

    props.setCurrentObjectProps(newObjectProps); // Aktualisierte Object-Props übergeben

    setColor(event.target.value); // Aktualisiere den Farbwert im Status
  };

  return (
    <Stack>
      Colorpicker
      <input
        type="color"
        id="favcolor"
        name="favcolor"
        value={color}
        onChange={handleColorChange}
      />
      <p>{color}</p>
    </Stack>
  );
}

export default ColorPicker;
