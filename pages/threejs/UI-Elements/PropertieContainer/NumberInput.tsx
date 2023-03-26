import { TextField } from "@mui/material";
import React from "react";

export default function NumberInput(props: {
  label: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}) {
  return (
    <TextField
      type="number"
      id="filled-number"
      label={props.label}
      value={props.value}
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        step: "0.01",
        style: {
          padding: "0.5rem",
        },
      }}
      onChange={(e) => props.onChange(e)}
    />
  );
}
