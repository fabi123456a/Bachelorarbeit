import { Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const Textures = (props: {}) => {
  const [textures, setTextures] = useState<string[]>(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const getAllTexturesFromFS = async () => {
    const requestTextures = await fetch("api/filesystem/FS_getTextures");

    const textures = requestTextures.json();

    // alert(textures);

    return textures;
  };

  const addTextureFilesToFS = async (textureName: string) => {
    const formData = new FormData();

    formData.append("file", selectedFiles[0]);


    const xxx = await fetch("api/filesystem/FS_uploadTexture", {
      method: "POST",
      body: formData,
    });

  };

  useEffect(() => {
    getAllTexturesFromFS().then((textures: string[]) => setTextures(textures));
  }, []);

  function handleFileSelect(event) {
    const selectedFiles = Array.from(event.target.files);

    if (validateSelectedFiles(selectedFiles)) {
      // Die ausgewählten Dateien sind gültig
      setSelectedFiles(selectedFiles);
    } else {
      // Die ausgewählten Dateien sind ungültig
      setSelectedFiles(selectedFiles);
      console.log("Ungültige Dateien ausgewählt.");
    }
  }

  function validateSelectedFiles(files) {
    const requiredFilenames = [
      "Substance_Graph_AmbientOcclusion.jpg",
      "Substance_Graph_BaseColor.jpg",
      "Substance_Graph_Height.jpg",
      "Substance_Graph_Normal.jpg",
      "Substance_Graph_Roughness.jpg",
    ];

    // Überprüfe, ob genau fünf Dateien ausgewählt wurden
    if (files.length !== 5) {
      return false;
    }

    // Überprüfe, ob die ausgewählten Dateien die richtigen Namen haben
    const selectedFilenames = files.map((file) => file.name);
    const isValid = requiredFilenames.every((filename) =>
      selectedFilenames.includes(filename)
    );

    return isValid;
  }

  return (
    <Stack className="texturesContainer">
      {textures
        ? textures.map((tex: string) => (
            <Stack className="roundedShadow textureContainer">
              <img
                src={`./textures/${tex}/Substance_Graph_BaseColor.jpg`}
                height={"50px"}
                style={{ marginRight: "8px", height: "20vh", width: "20vh" }}
              ></img>
              <Typography>{tex}</Typography>
            </Stack>
          ))
        : null}
      <Stack className="roundedShadow textureContainer">
        <Typography>Texture hinzufügen</Typography>
        <Stack direction={"row"}>
          <input
            type="file"
            accept=".jpg"
            multiple
            onChange={handleFileSelect}
          />
          {validateSelectedFiles(selectedFiles) ? (
            <Stack>
              <Typography>filenames are right</Typography>
              <CheckCircleOutlineIcon color="success"></CheckCircleOutlineIcon>
            </Stack>
          ) : (
            <Stack>
              <Typography>
                wrong filenames or to many or to less files
              </Typography>
              <ErrorOutlineIcon color="error"></ErrorOutlineIcon>
            </Stack>
          )}
        </Stack>

        <div>
          <h3>Ausgewählte Dateien:</h3>
          <ul>
            {selectedFiles.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </div>
        <Stack direction={"row"} sx={{ m: "8px" }}>
          <TextField size="small" label="Texture Name"></TextField>
          <Button
            onClick={() => {
              addTextureFilesToFS("");
            }}
          >
            Hinzufügen
          </Button>
        </Stack>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={"#ff9800"}>
              Es werden 5 .jpg formate benötigt die genau so heißen müssen
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction={"row"}>
              <img
                src={`./textures/gravel/Substance_Graph_AmbientOcclusion.jpg`}
                height={"50px"}
                style={{ margin: "8px", height: "20vh", width: "20vh" }}
              ></img>
              <Typography>Substance_Graph_AmbientOcclusion.jpg</Typography>
            </Stack>

            <Stack direction={"row"}>
              <img
                src={`./textures/gravel/Substance_Graph_BaseColor.jpg`}
                height={"50px"}
                style={{ margin: "8px", height: "20vh", width: "20vh" }}
              ></img>
              <Typography>Substance_Graph_BaseColor.jpg</Typography>
            </Stack>
            <Stack direction={"row"}>
              <img
                src={`./textures/gravel/Substance_Graph_Height.jpg`}
                height={"50px"}
                style={{ margin: "8px", height: "20vh", width: "20vh" }}
              ></img>
              <Typography>Substance_Graph_Height.jpg</Typography>
            </Stack>

            <Stack direction={"row"}>
              <img
                src={`./textures/gravel/Substance_Graph_Normal.jpg`}
                height={"50px"}
                style={{ margin: "8px", height: "20vh", width: "20vh" }}
              ></img>
              <Typography>Substance_Graph_Normal.jpg</Typography>
            </Stack>

            <Stack direction={"row"}>
              <img
                src={`./textures/gravel/Substance_Graph_Roughness.jpg`}
                height={"50px"}
                style={{ margin: "8px", height: "20vh", width: "20vh" }}
              ></img>
              <Typography>Substance_Graph_Roughness.jpg</Typography>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Stack>
  );
};

export default Textures;
