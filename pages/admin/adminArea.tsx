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
        {!flag ? (
          <DatabaseTable tableName="user"></DatabaseTable>
        ) : (
          <FbxList></FbxList>
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
