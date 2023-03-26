import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { type } from "os";

const prisma = new PrismaClient();

export type ModelScene = {
  id: number;
  idUserCreater: number;
  name: string;
  createDate: Date;
  path: string;
};

export default async function DB_insertScene(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const idUserCreater = req.query.idUserCreater as string;
  // const name = req.query.name as string;

  const b = req.body;
  const requestData = JSON.parse(b);

  let idScene: number = getRandomInt(44444);

  const result = prisma.scene.create({
    data: {
      id: idScene.toString(),
      idUserCreater: "2", //requestData["idUserCreator"],
      createDate: new Date(),
      name: requestData["name"],
      path: idScene + ".json",
    },
  });

  if (result == null) res.status(200).json({ result: false });
  else {
    res.status(200).json({ result: (await result).id });
  }
}

// hilf fkt
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
