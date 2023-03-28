import { NextApiRequest, NextApiResponse } from "next";
import { ModelScene, ModelUser } from "./_models";
import { prismaClient } from "./_prismaClient";

export default async function DB_insertScene(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const b = req.body;
  const requestData = JSON.parse(b);

  let idScene: number = getRandomInt(999999);

  let sceneModel: ModelScene = {
    id: idScene.toString(),
    idUserCreater: requestData["idUserCreator"],
    createDate: new Date(),
    name: requestData["name"],
    path: idScene + ".json",
  };

  const result = await prismaClient.scenes.create({
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
