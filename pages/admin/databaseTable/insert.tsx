import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const Insert = (props: { tableName: string; porperties: string[] }) => {
  useEffect(() => {}, []);

  return (
    <Stack>
      <Button
        onClick={() => {
          alert(props.tableName + ": " + props.porperties[0]);
        }}
      >
        Insert
      </Button>
    </Stack>
  );
};

export default Insert;
