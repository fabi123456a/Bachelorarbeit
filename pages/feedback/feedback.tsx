import FeedbackIcon from "@mui/icons-material/Feedback";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { User } from "@prisma/client";
import CloseIcon from "@mui/icons-material/Close";

const Feedback = () => {
  const [txt, setTxt] = useState<string>("");
  const [flag, setFlag] = useState<boolean>(false);

  const handleFeedbackClick = async () => {
    const response = await fetch("/api/database/Feedback/DB_insertFeedback", {
      method: "POST",
      body: JSON.stringify({
        text: txt,
      }),
    });

    const result = await response.json();

    return result;
  };

  return (
    <>
      {flag ? (
        <Stack className="feedback">
          <CloseIcon
            color="error"
            style={{ alignSelf: "flex-end" }}
            onClick={() => {
              setFlag(false);
            }}
          ></CloseIcon>
          <TextField
            style={{ background: "white" }}
            label="Feedback"
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
            multiline
            rows={4}
            maxRows={4}
          ></TextField>
          <Button
            onClick={() => {
              handleFeedbackClick();
              alert("Vielen Dank für ihr Feedback!");
              setTxt("");
            }}
          >
            Send
          </Button>
        </Stack>
      ) : (
        <FeedbackIcon
          color="success"
          onClick={() => {
            setFlag(true);
          }}
          className="feedbackIcon"
        ></FeedbackIcon>
      )}
    </>
  );
};

export default Feedback;
