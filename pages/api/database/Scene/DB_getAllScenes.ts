import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { Scene } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
