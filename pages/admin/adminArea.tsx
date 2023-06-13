import { Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { DeleteForeverOutlined } from "@mui/icons-material";
import DatabaseTable from "./databaseTable/databaseTable";
import FbxList from "./fbxModels/fbxList";

const AdminArea = (props: { setAdminArea: (flag: boolean) => void }) => {
  const [flag, setFlag] = useState<boolean>(false);

  return (
    <Stack className="adminArea">
      <Button
        onClick={() => {
          setFlag((prev) => !prev);
        }}
      >
        Toogle
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
  );
};

export default AdminArea;
