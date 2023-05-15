import { NextApiRequest, NextApiResponse } from "next";
import {Scene, User} from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function DB_insertScene(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const b = req.body;
  const requestData = JSON.parse(b);

  let idScene: number = getRandomInt(999999);

  let sceneModel: Scene = {
    id: idScene.toString(),
    idUserCreater: requestData["idUserCreator"],
    createDate: new Date(),
    name: requestData["name"],
    path: idScene + ".json",
  };

  const result = await prismaClient.scene.create({
    data: sceneModel,
  });

  if (result == null) res.status(200).json({ result: false });
  else {
    res.status(200).json(sceneModel);
  }
}

// hilf fkt
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
