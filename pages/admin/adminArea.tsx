import { Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { DeleteForeverOutlined } from "@mui/icons-material";
import DatabaseTable from "./databaseTable/databaseTable";
import FbxList from "./fbxModels/fbxList";
import { User } from "@prisma/client";

const AdminArea = (props: {
  setAdminArea: (flag: boolean) => void;
  user: User;
}) => {
  const [flag, setFlag] = useState<boolean>(false);

  return props.user ? (
    !props.user.readOnly ? (
      <Stack className="adminArea">
        <Button
          onClick={() => {
            setFlag((prev) => !prev);
          }}
        >
          Wechseln
        </Button>
        {!flag ? (
          <DatabaseTable
            tableName="user"
            setAdminArea={props.setAdminArea}
          ></DatabaseTable>
        ) : (
          <FbxList setAdminArea={props.setAdminArea}></FbxList>
        )}
      </Stack>
    ) : (
      <Typography>
        Sie haben keine Berechtigung um den Berreich zu öffnen
      </Typography>
    )
  ) : null;
};

export default AdminArea;
