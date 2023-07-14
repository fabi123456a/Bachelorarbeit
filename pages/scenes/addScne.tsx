import { Button, Stack, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { Model, Scene, SceneMemberShip, User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import fetchData from "../fetchData";

// einmal in DB und json file to FS
const AddScene = (props: {
  user: User;
  setScene: (scene: Scene) => void;
  setReload: (i: number) => void;
  sessionID: string;
}) => {
  const [name, setName] = useState<string>("");
  const refSceneID = useRef<string>(uuidv4());

  const addSceneToDB = async () => {
    refSceneID.current = uuidv4();
    // const response = await fetch("/api/database/Scene/DB_insertScene", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     idScene: refSceneID.current,
    //     idUserCreator: props.user.id,
    //     name: name,
    //     version: 0,
    //     sessionID: props.sessionID,
    //     idUser: props.user.id,
    //   }),
    // });

    // const result = await response.json();

    const sceneData: Scene = {
      id: refSceneID.current,
      createDate: new Date(),
      idUserCreater: props.user.id,
      name: name,
      newestVersion: 1,
    };

    const requestInsertScene = await fetchData(
      props.user.id,
      props.sessionID,
      "scene",
      "create",
      {},
      sceneData,
      null
    );

    if (requestInsertScene.error) return null;

    return requestInsertScene;
  };

  // der creator ist auch in membership drin
  const addMemberShipToDB = async (
    idScene1: string,
    idUser1: string,
    readonly: boolean
  ) => {
    // const response = await fetch(
    //   "/api/database/Membership/DB_insertMemberShip",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({
    //       idScene: idScene,
    //       idUser: idUser,
    //       readonly: readonly,
    //       sessionID: props.sessionID,
    //     }),
    //   }
    // );

    // const result = await response.json();

    const membership: SceneMemberShip = {
      id: uuidv4(),
      idScene: idScene1,
      idUser: idUser1,
      entryDate: new Date(),
      readOnly: readonly,
    };

    const request = await fetchData(
      props.user.id,
      props.sessionID,
      "sceneMemberShip",
      "create",
      {},
      membership,
      null
    );

    if (request.err) return;

    return request;
  };

  const addModelsToDB = async (model: Model) => {
    // const response = await fetch("/api/database/Model/DB_insertModel", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     model: model,
    //     sessionID: props.sessionID,
    //     idUser: props.user.id,
    //   }),
    // });

    // const result = await response.json();

    // return result;

    // TODO:
    const rquestInsertModel = await fetchData(
      props.user.id,
      props.sessionID,
      "model",
      "create",
      {},
      model,
      null
    );

    if (rquestInsertModel.err) return;

    return rquestInsertModel;
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
            if (!scene) {
              alert("scene ertsellen fehlgeschlagen");
              return;
            }

            // membership
            await addMemberShipToDB(refSceneID.current, props.user.id, false);

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
    color: "#eeeeee",
    name: "Boden",
    version: 1,
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
    color: "#eeeeee",
    name: "rechte Wand",
    version: 1,
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
    color: "#eeeeee",
    name: "linke Wand",
    version: 1,
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
    color: "#eeeeee",
    name: "hinten Wand",
    version: 1,
  };
  emptyRoom.push(backWall);

  return emptyRoom;
}

// '"models":[{"id":"Boden","position":{"x":0,"y":0,"z":0},"scale":{"x":50,"y":0.001,"z":50},"rotation":{"x":0,"y":0,"z":0}, "visibleInOtherPerspective": true,"showXTransform":false,"showYTransform":false,"showZTransform":false,"modelPath":null,"info":"", "name": "Boden", "color":"#eee", "texture": null}' +
//           ',{"id":"rechte Wand","position":{"x":25,"y":5,"z":0},"scale":{"x":0.001,"y":10,"z":50},"rotation":{"x":0,"y":0,"z":0},"visibleInOtherPerspective": true,"showXTransform":false,"showYTransform":false,"showZTransform":false,"modelPath":null,"info":"", "name": "rechte Wand", "color":"#065623", "texture": null}' +
//           ',{"id":"linke Wand","position":{"x":-25,"y":5,"z":0},"scale":{"x":0.001,"y":10,"z":50},"rotation":{"x":0,"y":0,"z":0},"visibleInOtherPerspective": true,"showXTransform":false,"showYTransform":false,"showZTransform":false,"modelPath":null,"info":"", "name": "linke Wand", "color":"#065623", "texture": null}' +
//           ',{"id":"Wand","position":{"x":0,"y":5,"z":-25},"scale":{"x":50,"y":10,"z":0.001},"rotation":{"x":0,"y":0,"z":0},"visibleInOtherPerspective": true,"showXTransform":false,"showYTransform":false,"showZTransform":false,"modelPath":null,"info":"", "name": "hinten Wand", "color":"#065623", "texture": null}]}', // leere scene daten
