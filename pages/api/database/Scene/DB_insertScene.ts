import { NextApiRequest, NextApiResponse } from "next";
import { Scene, User } from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { checkSessionID } from "../Session/_checkSessionID";

export default async function DB_insertScene(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const b = req.body;
  const requestData = JSON.parse(b);
  const idUserCreator = requestData["idUserCreator"];
  const sceneName = requestData["name"];
  const id = requestData["id"];
  const version = requestData["version"];

  let scene: Scene = {
    id: id,
    idUserCreater: idUserCreator,
    createDate: new Date(),
    name: sceneName,
    newestVersion: version,
  };

  const createScene = await prismaClient.scene.create({
    data: scene,
  });

  if (createScene == null) {
    console.log("DB: scene in DB einfügen ist fehlgeschlagen");
    res.status(200).json(null);
  } else {
    console.log("DB: scene wurde hinzugefügt: " + createScene.id);
    res.status(200).json(createScene);
  }
}
