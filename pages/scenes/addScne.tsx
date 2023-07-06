import { Button, Stack, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { Model, Scene, User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

// einmal in DB und json file to FS
const AddScene = (props: {
  user: User;
  setScene: (scene: Scene) => void;
  setReload: (i: number) => void;
}) => {
  const [name, setName] = useState<string>();
  const refSceneID = useRef<string>(uuidv4());

  const addSceneToDB = async () => {
    refSceneID.current = uuidv4();
    const response = await fetch("/api/database/Scene/DB_insertScene", {
      method: "POST",
      body: JSON.stringify({
        id: refSceneID.current,
        idUserCreator: props.user.id,
        name: name,
        version: 0,
      }),
    });

    const result = await response.json();

    return result;
  };

  const addModelsToDB = async (model: Model) => {
    const response = await fetch("/api/database/Model/DB_insertModel", {
      method: "POST",
      body: JSON.stringify(model),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    return result;
  };

  return (
    <Stack className="newScene centerH">
      <Typography>Neu</Typography>
      <Stack>
        <TextField
          label={"Name der Leitstelle"}
          onChange={(event) => {
            setName(event.target.value);
          }}
          value={name}
        ></TextField>
        <Button
          onClick={async () => {
            if (name == null) {
              alert("Scenename eingeben");
              return;
            }

            // insert scene into DB
            const scene: Scene = await addSceneToDB();

            // models into DB hinzufügen
            const modelsEmptyRoom: Model[] = getEmptyRoom(scene.id);

            modelsEmptyRoom.forEach(async (model: Model) => {
              await addModelsToDB(model);
            });

            // sceneList neu laden
            props.setReload(Math.random());

            //inhalt textfeld zuücksetzenb
            setName("");
          }}
        >
          Erstellen
        </Button>
      </Stack>
    </Stack>
  );
};

export default AddScene;

function getEmptyRoom(idScene: string): Model[] {
  let emptyRoom: Model[] = [];

  let boden: Model = {
    id: uuidv4(),
    idScene: idScene,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    scaleX: 50,
    scaleY: 0.001,
    scaleZ: 50,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    visibleInOtherPerspective: true,
    showXTransform: false,
    showYTransform: false,
    showZTransform: false,
    modelPath: null,
    texture: null,
    info: "",
    color: "#eee",
    name: "Boden",
    version: 0,
  };
  emptyRoom.push(boden);

  let rightWall: Model = {
    id: uuidv4(),
    idScene: idScene,
    positionX: 25,
    positionY: 5,
    positionZ: 0,
    scaleX: 0.001,
    scaleY: 10,
    scaleZ: 50,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    visibleInOtherPerspective: true,
    showXTransform: false,
    showYTransform: false,
    showZTransform: false,
    modelPath: null,
    texture: null,
    info: "",
    color: "#eee",
    name: "rechte Wand",
    version: 0,
  };
  emptyRoom.push(rightWall);

  let leftWall: Model = {
    id: uuidv4(),
    idScene: idScene,
    positionX: -25,
    positionY: 5,
    positionZ: 0,
    scaleX: 0.001,
    scaleY: 10,
    scaleZ: 50,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    visibleInOtherPerspective: true,
    showXTransform: false,
    showYTransform: false,
    showZTransform: false,
    modelPath: null,
    texture: null,
    info: "",
    color: "#eee",
    name: "linke Wand",
    version: 0,
  };
  emptyRoom.push(leftWall);

  let backWall: Model = {
    id: uuidv4(),
    idScene: idScene,
    positionX: 0,
    positionY: 5,
    positionZ: -25,
    scaleX: 50,
    scaleY: 10,
    scaleZ: 0.001,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    visibleInOtherPerspective: true,
    showXTransform: false,
    showYTransform: false,
    showZTransform: false,
    modelPath: null,
    texture: null,
    info: "",
    color: "#eee",
    name: "hinten Wand",
    version: 0,
  };
  emptyRoom.push(backWall);

  return emptyRoom;
}

// '"models":[{"id":"Boden","position":{"x":0,"y":0,"z":0},"scale":{"x":50,"y":0.001,"z":50},"rotation":{"x":0,"y":0,"z":0}, "visibleInOtherPerspective": true,"showXTransform":false,"showYTransform":false,"showZTransform":false,"modelPath":null,"info":"", "name": "Boden", "color":"#eee", "texture": null}' +
//           ',{"id":"rechte Wand","position":{"x":25,"y":5,"z":0},"scale":{"x":0.001,"y":10,"z":50},"rotation":{"x":0,"y":0,"z":0},"visibleInOtherPerspective": true,"showXTransform":false,"showYTransform":false,"showZTransform":false,"modelPath":null,"info":"", "name": "rechte Wand", "color":"#065623", "texture": null}' +
//           ',{"id":"linke Wand","position":{"x":-25,"y":5,"z":0},"scale":{"x":0.001,"y":10,"z":50},"rotation":{"x":0,"y":0,"z":0},"visibleInOtherPerspective": true,"showXTransform":false,"showYTransform":false,"showZTransform":false,"modelPath":null,"info":"", "name": "linke Wand", "color":"#065623", "texture": null}' +
//           ',{"id":"Wand","position":{"x":0,"y":5,"z":-25},"scale":{"x":50,"y":10,"z":0.001},"rotation":{"x":0,"y":0,"z":0},"visibleInOtherPerspective": true,"showXTransform":false,"showYTransform":false,"showZTransform":false,"modelPath":null,"info":"", "name": "hinten Wand", "color":"#065623", "texture": null}]}', // leere scene daten
