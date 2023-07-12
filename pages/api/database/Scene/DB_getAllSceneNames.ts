import { NextApiRequest, NextApiResponse } from "next";
import { checkSessionID } from "../Session/_checkSessionID";
import { Scene } from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function DB_getAllSceneNames(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const requestBody = JSON.parse(req.body);
  const idUser = requestBody["id"];

  let scenes: Scene[];

  if (idUser) {
    scenes = await prismaClient.scene.findMany({
      where: {
        idUserCreater: { equals: idUser },
      },
    });
  } else {
    scenes = await prismaClient.scene.findMany();
  }

  if (scenes == null) res.status(200).json(null);
  else {
    res.status(200).json(scenes);
  }
}
