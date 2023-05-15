import { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const GetFbx = (props: {}) => {
  const getFbx = async (name: string) => {
    const response = await fetch(`/api/database/fbxModels/getFbx?fbxName=${name}`, {
      method: "GET",
    });

    const result = await response.json();
    alert(result["txt"]);
  };

  // RETURN
  return (
    <Stack direction={"row"}>
      <Button
        onClick={() => {
          getFbx("mercedes.fbx");
        }}
      >
        GetFBX
      </Button>
    </Stack>
  );
};

export default GetFbx;
