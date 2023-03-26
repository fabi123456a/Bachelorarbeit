import { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const UploadFbx = (props: {}) => {
  // states
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();

  // file upload
  const handleUpload = async () => {
    setUploading(true);

    try {
      // wenn kein file ausgewählt ist returnen
      if (!selectedFile) {
        alert("keine datei ausgewählt!");
        setUploading(false);
        return;
      }

      // prüfen ob es ein fbx datei ist
      if (getDateiEndug(selectedFile) != "fbx") {
        alert("es können nur fbx dateien hochgeladen werden!");
        setUploading(false);
        return;
      }

      // Formdata erstellen & File adden
      const formData = new FormData();
      formData.append("file", selectedFile);

      // fetch
      //const { data } = await axios.post("/api/uploadFbx", formData);
      await axios.post("/api/uploadFbx", formData);
    } catch (error: any) {
      console.log(error.response?.data);
    }

    setUploading(false);
  };

  return (
    <Stack direction={"row"}>
      <input
        type="file"
        onChange={({ target }) => {
          if (target.files) {
            const file = target.files[0];
            setSelectedFile(file);
          }
        }}
      />
      <Button
        onClick={async () => {
          // datei auf server laden
          await handleUpload();
        }}
        disabled={uploading}
        variant={"outlined"}
      >
        {uploading ? "Uploading.." : "Upload"}
      </Button>
    </Stack>
  );
};

export default UploadFbx;

// hilfsfunktionen

function getDateiEndug(file: File) {
  return file.name.split(".")[1];
}
