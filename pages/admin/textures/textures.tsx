import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { User } from "@prisma/client";
import { DeleteForeverOutlined } from "@mui/icons-material";

const Textures = (props: { loggedInUser: User; sessionID: string }) => {
  const [textures, setTextures] = useState<string[]>(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [textureName, setTextureName] = useState("");
  const [reload, setReload] = useState(0);

  const getAllTexturesFromFS = async () => {
    const requestTextures = await fetch("api/filesystem/FS_getTextures", {
      method: "POST",
      body: JSON.stringify({
        sessionID: props.sessionID,
        idUser: props.loggedInUser.id,
      }),
    });

    const textures = requestTextures.json();

    // alert(textures);

    return textures;
  };

  const addTextureFilesToFS = async (textureName: string) => {
    const formData = new FormData();

    // for (let i = 0; i < selectedFiles.length; i++) {
    //   formData.append("files", selectedFiles[i]);
    // }

    selectedFiles.map((file) => {
      formData.append("files", file);
    });

    const xxx = await fetch(
      `api/filesystem/FS_uploadTexture?textureName=${textureName}`,
      {
        method: "POST",
        body: formData, // TODO: tetxure sessionID
      }
    );
  };

  const handleTextureDelete = async (textureName: string): Promise<boolean> => {
    const request = await fetch("api/filesystem/FS_deleteTexture", {
      method: "POST",
      body: JSON.stringify({
        textureName: textureName,
        sessionID: props.sessionID,
        idUser: props.loggedInUser.id,
      }),
    });

    const erg = await request.json();

    return erg;
  };

  useEffect(() => {
    getAllTexturesFromFS().then((textures: string[]) => setTextures(textures));
  }, [reload]);

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

    if (!files) return;

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
            <Stack
              direction={"row"}
              className="roundedShadow textureContainer"
              key={tex}
            >
              <img
                src={`./textures/${tex}/Substance_Graph_BaseColor.jpg`}
                height={"50px"}
                style={{ marginRight: "8px", height: "20vh", width: "20vh" }}
              ></img>
              <Typography>{tex}</Typography>
              {props.loggedInUser.isAdmin ? (
                <IconButton
                  className="iconButton"
                  onClick={async () => {
                    const confirmed = window.confirm(
                      "Willst du die Texture '" + tex + "' wirklich löschen?"
                    );

                    if (!confirmed) return;

                    const flag = await handleTextureDelete(tex);
                    if (flag && !(typeof flag === "object")) {
                      // notwendig weil wenn keine session id dann wird {error: ".."} zurückgeliefert
                      alert("texture wurde gelöscht");
                      setReload(Math.random());
                    } else {
                      alert("löschen fehlgeschlagen");
                    }
                  }}
                >
                  <DeleteForeverOutlined></DeleteForeverOutlined>
                </IconButton>
              ) : null}
            </Stack>
          ))
        : null}
      {props.loggedInUser.write ? (
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
              <Stack direction={"row"} sx={{ alignItems: "center" }}>
                <CheckCircleOutlineIcon color="success"></CheckCircleOutlineIcon>
                <Typography fontSize={"12px"} color={"#2e7d32"}>
                  filenames are right
                </Typography>
              </Stack>
            ) : selectedFiles?.length >= 1 ? (
              <Stack direction={"row"} sx={{ alignItems: "center" }}>
                <ErrorOutlineIcon color="warning"></ErrorOutlineIcon>
                <Typography fontSize={"12px"} color={"#ed6c02"}>
                  wrong files or to many or to less files
                </Typography>
              </Stack>
            ) : null}
          </Stack>

          <div>
            <h3>Ausgewählte Dateien:</h3>
            <ul>
              {selectedFiles.map((file) => (
                <li key={file.name}>{file.name}</li>
              ))}
            </ul>
          </div>
          {validateSelectedFiles(selectedFiles) ? (
            <Stack direction={"row"} sx={{ m: "8px" }}>
              <TextField
                value={textureName}
                size="small"
                label="Texture Name"
                onChange={(e) => {
                  setTextureName(e.target.value);
                }}
              ></TextField>
              <Button
                onClick={async () => {
                  if (!textureName) {
                    alert("Geben sie einen Texture namen an.");
                    return;
                  }
                  await addTextureFilesToFS(textureName);
                  setReload(Math.random());
                  setSelectedFiles([]);
                  setTextureName("");
                }}
              >
                Hinzufügen
              </Button>
            </Stack>
          ) : null}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color={"#0288d1"} fontSize={"12px"}>
                Es werden 5 .jpg formate benötigt die genau so heißen müssen
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction={"row"} sx={{ alignItems: "center" }}>
                <img
                  src={`./textures/gravel/Substance_Graph_AmbientOcclusion.jpg`}
                  height={"50px"}
                  style={{ margin: "8px", height: "12vh", width: "12vh" }}
                ></img>
                <Typography>Substance_Graph_AmbientOcclusion.jpg</Typography>
              </Stack>

              <Stack direction={"row"} sx={{ alignItems: "center" }}>
                <img
                  src={`./textures/gravel/Substance_Graph_BaseColor.jpg`}
                  height={"50px"}
                  style={{ margin: "8px", height: "12vh", width: "12vh" }}
                ></img>
                <Typography>Substance_Graph_BaseColor.jpg</Typography>
              </Stack>
              <Stack direction={"row"} sx={{ alignItems: "center" }}>
                <img
                  src={`./textures/gravel/Substance_Graph_Height.jpg`}
                  height={"50px"}
                  style={{ margin: "8px", height: "12vh", width: "12vh" }}
                ></img>
                <Typography>Substance_Graph_Height.jpg</Typography>
              </Stack>

              <Stack direction={"row"} sx={{ alignItems: "center" }}>
                <img
                  src={`./textures/gravel/Substance_Graph_Normal.jpg`}
                  height={"50px"}
                  style={{ margin: "8px", height: "12vh", width: "12vh" }}
                ></img>
                <Typography>Substance_Graph_Normal.jpg</Typography>
              </Stack>

              <Stack direction={"row"} sx={{ alignItems: "center" }}>
                <img
                  src={`./textures/gravel/Substance_Graph_Roughness.jpg`}
                  height={"50px"}
                  style={{ margin: "8px", height: "12vh", width: "12vh" }}
                ></img>
                <Typography>Substance_Graph_Roughness.jpg</Typography>
              </Stack>

              <Typography
                sx={{
                  margin: "8px",
                  border: "1px solid black",
                  padding: "8px",
                }}
              >
                hier findet man ganz viele &nbsp;
                <a href="https://3dtextures.me" target="_blank">
                  Texturen
                </a>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Stack>
      ) : null}
    </Stack>
  );
};

export default Textures;
