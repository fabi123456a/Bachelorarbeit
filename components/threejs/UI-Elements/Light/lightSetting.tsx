import {
  Button,
  Divider,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  IconButton,
  Slider,
} from "@mui/material";
import Draggable from "react-draggable";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import { Scene } from "@prisma/client";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { checkPropsForNull } from "../../../../utils/checkIfPropIsNull";
import LightModeIcon from "@mui/icons-material/LightMode";

const LightSettings = (props: {
  ambientValue: number;
  setAmbientValue: (value: number) => void;
  addLightToScene: () => void;
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  return visible ? (
    <Draggable>
      <Stack className="lightSettings roundedShadow">
        <CloseIcon
          className="iconButton"
          onClick={() => {
            setVisible(false);
          }}
        ></CloseIcon>
        <Typography textAlign={"center"} fontSize={"1.25rem"}>
          Licht
        </Typography>
        <Divider sx={{ m: "6px" }}></Divider>
        <Stack direction={"row"} sx={{ alignItems: "center" }}>
          <Typography sx={{ mr: "6px" }}>Ambientlight: </Typography>
          <TextField
            onFocus={(e) => e.target.blur()}
            onChange={(e) => {
              props.setAmbientValue(parseFloat(e.target.value));
            }}
            size="small"
            id="outlined-number"
            label="Number"
            type="number"
            value={props.ambientValue}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ maxWidth: "10vh" }}
            inputProps={{
              step: 0.1, // Hier die gewünschte Schrittweite angeben
            }}
          />
        </Stack>
        <Stack direction={"row"} sx={{ alignItems: "center" }}>
          <LightModeIcon color="warning"></LightModeIcon>
          <Button
            onClick={() => {
              props.addLightToScene();
            }}
          >
            add Pointlight
          </Button>
        </Stack>
      </Stack>
    </Draggable>
  ) : (
    <Stack
      className="showlightSettingsBtn roundedShadow minOpenBtn"
      onClick={() => {
        setVisible(true);
      }}
    >
      <Typography>Licht</Typography>
    </Stack>
  );
};

export default LightSettings;
