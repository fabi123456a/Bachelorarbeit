import React, { useRef, useState } from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function AddModelForm({
  addModel,
}: {
  addModel: (name: string, path: string, file: any) => void;
}) {
  const modelFileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>("");

  const whitelistedFileTypes = ["fbx"];

  return (
    <>
      <input
        ref={modelFileRef}
        onChange={(e) => {
          if (e.target.files) {
            if (
              !whitelistedFileTypes.includes(
                e.target.files[0].name
                  .split(".")
                  .reverse()[0]
                  .toLocaleLowerCase()
              )
            ) {
              alert(
                `Only Files with extension "${whitelistedFileTypes.toString()}" are allowed`
              );
              return;
            }
            if (!e?.target?.files || !e?.target?.files[0]) return;
            const reader = new FileReader();
            reader.onload = async function (e2) {
              const blob = new Blob(
                [new Uint8Array(e2?.target?.result as ArrayBuffer)],
                {
                  type: e?.target?.files ? e?.target?.files[0].type : "",
                }
              );
              name &&
                addModel(
                  name,
                  URL.createObjectURL(blob),
                  e?.target?.files && e?.target?.files[0]
                );
            };
            reader.readAsArrayBuffer(e.target.files[0]);
          }
        }}
        type="file"
        style={{ display: "none" }}
      />

      <Button
        color="success"
        variant="contained"
        style={{ margin: "12px", marginLeft: "24px", marginRight: "24px" }}
        onClick={() => {
          const name = window.prompt("Model Name", "");
          if (!name) {
            alert("Please add a Name");
            return;
          }
          setName(name ?? "");
          modelFileRef.current?.click();
        }}
      >
        <AddIcon></AddIcon>
      </Button>
    </>
  );
}
