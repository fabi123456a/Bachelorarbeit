import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { Scene } from "@prisma/client";
import { checkSessionID } from "../Session/_checkSessionID";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  try {
    const allScenes: Scene[] = await prismaClient.scene.findMany();

    if (allScenes) {
      console.log("DB: alle scenen responed");
      res.status(200).json(allScenes);
    }
  } catch (err) {
    console.log("DB: alle scene laden FEHLGESCHLAGEN");
    console.log(err);
    res.status(200).json(null);
  }
}
